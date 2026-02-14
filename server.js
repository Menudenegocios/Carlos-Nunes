
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname);

// 1. Configuração Global de MIME Types
// Garante que o Express saiba que .tsx é um script JavaScript
express.static.mime.define({
  'application/javascript': ['tsx', 'ts', 'jsx']
});

// 2. Middleware de Log para depuração na Hostinger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 3. Interceptador de arquivos de código (TSX/TS/JSX)
// Força o cabeçalho application/javascript para que o Babel no navegador aceite o arquivo
app.get(/\.(tsx|ts|jsx)$/, (req, res, next) => {
  const filePath = path.join(ROOT_DIR, req.path);
  
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    return res.sendFile(filePath);
  }
  console.error(`Arquivo não encontrado: ${filePath}`);
  next();
});

// 4. Servir arquivos estáticos (Imagens, CSS, etc)
app.use(express.static(ROOT_DIR));

// 5. Fallback para SPA (Single Page Application)
// Redireciona rotas de navegação (ex: /dashboard) para o index.html
app.get('*', (req, res) => {
  // Se a requisição parece ser um arquivo (tem ponto) e não foi pega acima, é 404 real
  if (req.path.includes('.') && !req.path.endsWith('.tsx')) {
    return res.status(404).send('Recurso não encontrado');
  }
  res.sendFile(path.join(ROOT_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`>>> Servidor Menu ADS iniciado.`);
  console.log(`>>> Porta: ${PORT}`);
  console.log(`>>> Root: ${ROOT_DIR}`);
});
