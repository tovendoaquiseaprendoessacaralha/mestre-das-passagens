import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Plane, Clock, MapPin, DollarSign, Loader2 } from 'lucide-react'
import './App.css'

function App() {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const searchFlights = async () => {
    setLoading(true)
    setError('')
    setFlights([])

    try {
      const response = await fetch('http://localhost:5000/search')
      const data = await response.json()

      if (data.success) {
        setFlights(data.flights)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Mestre, não foi possível conectar com o servidor. Verifique se o backend está rodando.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Plane className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Mestre das Passagens</h1>
          </div>
          <p className="text-lg text-gray-600 mb-6">
            Encontre as melhores ofertas de voos de Manaus para Florianópolis e Curitiba
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Período: 26/12/2025 a 14/01/2026 • Ida até 29/12/2025 • Permanência mínima: 13 dias
          </p>
          
          <Button 
            onClick={searchFlights} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Buscando melhores preços...
              </>
            ) : (
              'Buscar melhores preços'
            )}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600 text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {flights.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Mestre, aqui estão as 5 melhores ofertas encontradas!
            </h2>
            
            {flights.map((flight, index) => (
              <Card key={flight.id} className={`hover:shadow-lg transition-shadow duration-200 ${index === 0 ? 'border-2 border-green-400 bg-green-50' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        Manaus → {flight.destination}
                        {index === 0 && (
                          <Badge className="bg-green-500 text-white ml-2">
                            MELHOR PREÇO!
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-2xl font-bold text-green-600">
                          {formatPrice(flight.price)}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Companhias:</p>
                      <div className="flex gap-1 flex-wrap justify-end">
                        {flight.airlines.map((airline, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {airline}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Ida */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-blue-600 flex items-center gap-2">
                        <Plane className="h-4 w-4" />
                        Ida
                      </h4>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>Saída:</strong> {formatDate(flight.outbound.departure)}
                        </p>
                        <p className="text-sm">
                          <strong>Chegada:</strong> {formatDate(flight.outbound.arrival)}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1 text-xs text-gray-600">
                            <Clock className="h-3 w-3" />
                            {flight.outbound.duration}
                          </span>
                          <span className="text-xs text-gray-600">
                            {flight.outbound.stops === 0 ? 'Direto' : `${flight.outbound.stops} escala(s)`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Volta */}
                    {flight.inbound && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-blue-600 flex items-center gap-2">
                          <Plane className="h-4 w-4 rotate-180" />
                          Volta
                        </h4>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm">
                            <strong>Saída:</strong> {formatDate(flight.inbound.departure)}
                          </p>
                          <p className="text-sm">
                            <strong>Chegada:</strong> {formatDate(flight.inbound.arrival)}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1 text-xs text-gray-600">
                              <Clock className="h-3 w-3" />
                              {flight.inbound.duration}
                            </span>
                            <span className="text-xs text-gray-600">
                              {flight.inbound.stops === 0 ? 'Direto' : `${flight.inbound.stops} escala(s)`}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
                      onClick={() => window.open(flight.bookingLink, '_blank')}
                    >
                      Comprar esta passagem
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Mestre das Passagens - Encontre sempre as melhores ofertas!</p>
        </div>
      </div>
    </div>
  )
}

export default App

