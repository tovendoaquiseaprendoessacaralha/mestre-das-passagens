# Mestre das Passagens

Um sistema completo para monitorar e encontrar os melhores preços de passagens aéreas de Manaus para Florianópolis e Curitiba.

## 📋 Sobre o Projeto

O **Mestre das Passagens** é uma aplicação web que monitora preços de passagens aéreas em tempo real, focando especificamente nos trechos:

- **Manaus (MAO) → Florianópolis (FLN)**
- **Manaus (MAO) → Curitiba (CWB)**

### Critérios de Busca

- **Período:** 26/12/2025 até 14/01/2026
- **Ida:** Até 29/12/2025 (pelo menos 2 dias antes de 31/12/2025)
- **Permanência mínima:** 13 dias
- **Resultados:** Sempre mostra os 5 voos mais baratos que atendem às regras

## 🏗️ Arquitetura

O projeto é dividido em duas partes principais:

### Backend (Node.js + Express)
- API REST que consulta a Amadeus API
- Filtragem automática conforme as regras de negócio
- Normalização dos dados para facilitar o consumo
- Configuração via variáveis de ambiente

### Frontend (React)
- Interface responsiva e moderna
- Comunicação com o backend via API REST
- Exibição dos resultados em cards organizados
- Destaque visual para a melhor oferta

## 🚀 Como Executar Localmente

### Pré-requisitos

- Node.js 18+ instalado
- Conta na [Amadeus for Developers](https://developers.amadeus.com/)
- Chaves de API da Amadeus (API Key e API Secret)

### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd mestre-das-passagens
```

### 2. Configurar o Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais da Amadeus:

```env
AMADEUS_API_KEY=sua_api_key_aqui
AMADEUS_API_SECRET=seu_api_secret_aqui
PORT=5000
```

Inicie o servidor backend:

```bash
npm start
```

O backend estará disponível em `http://localhost:5000`

### 3. Configurar o Frontend

Em um novo terminal:

```bash
cd frontend/mestre-passagens
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev -- --host
```

O frontend estará disponível em `http://localhost:5173`

## 🌐 Deploy em Produção

### Deploy do Backend (Render)

1. Faça fork deste repositório
2. Crie uma conta no [Render](https://render.com/)
3. Conecte seu repositório GitHub ao Render
4. Crie um novo **Web Service**
5. Configure as seguintes opções:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Environment:** Node
6. Adicione as variáveis de ambiente:
   - `AMADEUS_API_KEY`: Sua chave da API Amadeus
   - `AMADEUS_API_SECRET`: Seu secret da API Amadeus
   - `PORT`: 5000

### Deploy do Frontend (Vercel)

1. Instale a CLI da Vercel: `npm i -g vercel`
2. No diretório `frontend/mestre-passagens`:

```bash
npm run build
vercel --prod
```

Ou conecte diretamente pelo dashboard da Vercel:

1. Acesse [vercel.com](https://vercel.com/)
2. Conecte seu repositório GitHub
3. Configure o **Root Directory** como `frontend/mestre-passagens`
4. As configurações de build serão detectadas automaticamente

### Configuração de CORS

Após o deploy, atualize a URL do backend no frontend:

No arquivo `frontend/mestre-passagens/src/App.jsx`, substitua:

```javascript
const response = await fetch('http://localhost:5000/search')
```

Por:

```javascript
const response = await fetch('https://sua-url-do-render.com/search')
```

## 📡 API Endpoints

### GET /

Retorna informações básicas da API.

**Resposta:**
```json
{
  "message": "Mestre das Passagens API está funcionando!",
  "endpoints": {
    "search": "/search - Busca os 5 voos mais baratos de Manaus para Florianópolis e Curitiba"
  }
}
```

### GET /search

Busca os 5 voos mais baratos que atendem aos critérios estabelecidos.

**Resposta de Sucesso:**
```json
{
  "success": true,
  "flights": [
    {
      "id": "flight_id",
      "price": 1250.50,
      "currency": "BRL",
      "airlines": ["G3"],
      "destination": "Florianópolis",
      "destinationCode": "FLN",
      "outbound": {
        "departure": "2025-12-28T08:30:00",
        "arrival": "2025-12-28T14:45:00",
        "duration": "6h 15m",
        "stops": 1
      },
      "inbound": {
        "departure": "2026-01-12T16:20:00",
        "arrival": "2026-01-12T22:10:00",
        "duration": "5h 50m",
        "stops": 1
      },
      "bookingLink": "https://www.amadeus.com/booking/flight_id"
    }
  ],
  "total": 1,
  "message": "Mestre, encontramos as melhores ofertas para você!"
}
```

**Resposta sem Resultados:**
```json
{
  "success": true,
  "flights": [],
  "total": 0,
  "message": "Mestre, não encontramos voos que atendam aos critérios no momento."
}
```

## 🔧 Exemplo de Requisição via cURL

```bash
# Testar se a API está funcionando
curl http://localhost:5000/

# Buscar voos
curl http://localhost:5000/search
```

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Axios** - Cliente HTTP para requisições
- **CORS** - Middleware para Cross-Origin Resource Sharing
- **dotenv** - Gerenciamento de variáveis de ambiente

### Frontend
- **React** - Biblioteca para interfaces de usuário
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/UI** - Componentes de interface
- **Lucide React** - Ícones

### API Externa
- **Amadeus for Developers** - API de dados de viagem

## 📝 Estrutura do Projeto

```
mestre-das-passagens/
├── backend/
│   ├── .env.example
│   ├── index.js
│   ├── package.json
│   └── README.md
├── frontend/
│   └── mestre-passagens/
│       ├── src/
│       │   ├── components/
│       │   ├── App.jsx
│       │   ├── App.css
│       │   └── main.jsx
│       ├── index.html
│       ├── package.json
│       └── vite.config.js
└── README.md
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🎯 Funcionalidades

- ✅ Busca automática nos dois destinos (Florianópolis e Curitiba)
- ✅ Filtragem por data de ida (até 29/12/2025)
- ✅ Validação de permanência mínima (13 dias)
- ✅ Ordenação por preço (mais barato primeiro)
- ✅ Interface responsiva para desktop e mobile
- ✅ Tratamento de erros e estados de loading
- ✅ Destaque visual para a melhor oferta
- ✅ Informações detalhadas de cada voo (escalas, duração, companhias)

## 🔮 Próximos Passos

- [ ] Implementar cache para reduzir chamadas à API
- [ ] Adicionar notificações por email quando encontrar ofertas
- [ ] Criar histórico de preços
- [ ] Implementar filtros adicionais (companhia aérea, horários)
- [ ] Adicionar mais destinos

---

**Mestre das Passagens** - Encontre sempre as melhores ofertas! ✈️

