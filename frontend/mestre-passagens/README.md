# Frontend - Mestre das Passagens

Interface React responsiva para busca de passagens aéreas.

## 🚀 Instalação e Execução

### 1. Instalar Dependências

```bash
npm install
```

### 2. Executar em Desenvolvimento

```bash
npm run dev -- --host
```

O frontend estará disponível em `http://localhost:5173`

### 3. Build para Produção

```bash
npm run build
```

Os arquivos de produção estarão na pasta `dist/`

## 🌐 Deploy na Vercel

### Opção 1: Via CLI

```bash
npm install -g vercel
npm run build
vercel --prod
```

### Opção 2: Via Dashboard

1. Acesse [vercel.com](https://vercel.com/)
2. Conecte seu repositório GitHub
3. Configure o **Root Directory** como `frontend/mestre-passagens`
4. Deploy automático

## ⚙️ Configuração da URL do Backend

Após o deploy do backend, atualize a URL no arquivo `src/App.jsx`:

```javascript
// Substitua localhost pela URL do seu backend
const response = await fetch('https://sua-url-do-render.com/search')
```

## 🎨 Tecnologias

- **React** - Biblioteca UI
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn/UI** - Componentes
- **Lucide React** - Ícones

## 📱 Responsividade

O frontend é totalmente responsivo e funciona em:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

