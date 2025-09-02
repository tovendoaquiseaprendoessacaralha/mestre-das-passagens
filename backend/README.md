# Backend - Mestre das Passagens

API REST em Node.js + Express que consulta a Amadeus API para buscar passagens aéreas.

## 🚀 Instalação e Execução

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais da Amadeus:

```env
AMADEUS_API_KEY=sua_api_key_aqui
AMADEUS_API_SECRET=seu_api_secret_aqui
PORT=5000
```

### 3. Executar o Servidor

```bash
npm start
```

O servidor estará disponível em `http://localhost:5000`

## 📡 Endpoints

### GET /
Retorna informações básicas da API.

### GET /search
Busca os 5 voos mais baratos de Manaus para Florianópolis e Curitiba.

## 🔧 Como Obter Credenciais da Amadeus

1. Acesse [Amadeus for Developers](https://developers.amadeus.com/)
2. Crie uma conta gratuita
3. Crie uma nova aplicação
4. Copie o **API Key** e **API Secret**
5. Cole no arquivo `.env`

## 🌐 Deploy no Render

1. Conecte seu repositório GitHub ao Render
2. Crie um novo Web Service
3. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
4. Adicione as variáveis de ambiente no painel do Render

## 📦 Dependências

- **express** - Framework web
- **cors** - Middleware CORS
- **axios** - Cliente HTTP
- **dotenv** - Variáveis de ambiente

