const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Função para obter token de acesso da Amadeus
async function getAmadeusToken() {
  try {
    const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', {
      grant_type: 'client_credentials',
      client_id: process.env.AMADEUS_API_KEY,
      client_secret: process.env.AMADEUS_API_SECRET
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    return response.data.access_token;
  } catch (error) {
    console.error('Erro ao obter token da Amadeus:', error.response?.data || error.message);
    throw new Error('Falha na autenticação com a API Amadeus');
  }
}

// Função para buscar voos
async function searchFlights(origin, destination, departureDate, returnDate, adults = 1) {
  try {
    const token = await getAmadeusToken();
    
    const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
      params: {
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: departureDate,
        returnDate: returnDate,
        adults: adults,
        currencyCode: 'BRL',
        max: 250
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar voos:', error.response?.data || error.message);
    throw new Error('Falha ao buscar voos na API Amadeus');
  }
}

// Função para normalizar os resultados
function normalizeFlightResults(apiResponse) {
  if (!apiResponse.data || !Array.isArray(apiResponse.data)) {
    return [];
  }

  return apiResponse.data.map(offer => {
    const outbound = offer.itineraries[0];
    const inbound = offer.itineraries[1];
    
    // Calcular duração total
    const outboundDuration = outbound.duration.replace('PT', '').replace('H', 'h ').replace('M', 'm');
    const inboundDuration = inbound ? inbound.duration.replace('PT', '').replace('H', 'h ').replace('M', 'm') : '';
    
    // Contar escalas
    const outboundStops = outbound.segments.length - 1;
    const inboundStops = inbound ? inbound.segments.length - 1 : 0;
    
    // Obter companhias aéreas
    const airlines = [...new Set(outbound.segments.map(segment => segment.carrierCode))];
    
    return {
      id: offer.id,
      price: parseFloat(offer.price.total),
      currency: offer.price.currency,
      airlines: airlines,
      outbound: {
        departure: outbound.segments[0].departure.at,
        arrival: outbound.segments[outbound.segments.length - 1].arrival.at,
        duration: outboundDuration,
        stops: outboundStops
      },
      inbound: inbound ? {
        departure: inbound.segments[0].departure.at,
        arrival: inbound.segments[inbound.segments.length - 1].arrival.at,
        duration: inboundDuration,
        stops: inboundStops
      } : null,
      bookingLink: `https://www.amadeus.com/booking/${offer.id}` // Link genérico
    };
  });
}

// Função para filtrar resultados conforme as regras
function filterFlightsByRules(flights) {
  const maxDepartureDate = new Date('2025-12-29');
  const minStayDays = 13;
  
  return flights.filter(flight => {
    // Verificar se a ida é até 29/12/2025
    const departureDate = new Date(flight.outbound.departure);
    if (departureDate > maxDepartureDate) {
      return false;
    }
    
    // Verificar permanência mínima de 13 dias
    if (flight.inbound) {
      const returnDate = new Date(flight.inbound.departure);
      const stayDays = Math.ceil((returnDate - departureDate) / (1000 * 60 * 60 * 24));
      if (stayDays < minStayDays) {
        return false;
      }
    }
    
    return true;
  });
}

// Endpoint principal de busca
app.get('/search', async (req, res) => {
  try {
    console.log('Iniciando busca de voos...');
    
    const destinations = [
      { code: 'FLN', name: 'Florianópolis' },
      { code: 'CWB', name: 'Curitiba' }
    ];
    
    const allFlights = [];
    
    // Buscar voos para cada destino
    for (const destination of destinations) {
      console.log(`Buscando voos para ${destination.name}...`);
      
      // Buscar voos em diferentes datas de ida (26/12 a 29/12)
      const departureDates = ['2025-12-26', '2025-12-27', '2025-12-28', '2025-12-29'];
      
      for (const departureDate of departureDates) {
        // Calcular data de volta (mínimo 13 dias depois)
        const minReturnDate = new Date(departureDate);
        minReturnDate.setDate(minReturnDate.getDate() + 13);
        
        // Buscar até 14/01/2026
        const maxReturnDate = new Date('2026-01-14');
        
        // Fazer algumas buscas com diferentes datas de volta
        const returnDates = [];
        for (let d = new Date(minReturnDate); d <= maxReturnDate; d.setDate(d.getDate() + 2)) {
          returnDates.push(d.toISOString().split('T')[0]);
          if (returnDates.length >= 3) break; // Limitar para não fazer muitas requisições
        }
        
        for (const returnDate of returnDates) {
          try {
            const flightData = await searchFlights('MAO', destination.code, departureDate, returnDate);
            const normalizedFlights = normalizeFlightResults(flightData);
            const filteredFlights = filterFlightsByRules(normalizedFlights);
            
            // Adicionar informação do destino
            filteredFlights.forEach(flight => {
              flight.destination = destination.name;
              flight.destinationCode = destination.code;
            });
            
            allFlights.push(...filteredFlights);
          } catch (error) {
            console.error(`Erro ao buscar voos para ${destination.name} em ${departureDate} - ${returnDate}:`, error.message);
          }
          
          // Delay para evitar rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    // Ordenar por preço e pegar os 5 mais baratos
    const cheapestFlights = allFlights
      .sort((a, b) => a.price - b.price)
      .slice(0, 5);
    
    console.log(`Encontrados ${cheapestFlights.length} voos que atendem aos critérios`);
    
    res.json({
      success: true,
      flights: cheapestFlights,
      total: cheapestFlights.length,
      message: cheapestFlights.length > 0 
        ? 'Mestre, encontramos as melhores ofertas para você!' 
        : 'Mestre, não encontramos voos que atendam aos critérios no momento.'
    });
    
  } catch (error) {
    console.error('Erro na busca:', error);
    res.status(500).json({
      success: false,
      message: 'Mestre, ocorreu um erro ao buscar os voos. Tente novamente mais tarde.',
      error: error.message
    });
  }
});

// Endpoint de teste
app.get('/', (req, res) => {
  res.json({
    message: 'Mestre das Passagens API está funcionando!',
    endpoints: {
      search: '/search - Busca os 5 voos mais baratos de Manaus para Florianópolis e Curitiba'
    }
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});

