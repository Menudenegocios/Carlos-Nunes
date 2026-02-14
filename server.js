
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// A Hostinger define a porta automaticamente, mas usamos 3000 como fallback
const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname);

// 1. Configuração de MIME types para garantir que o navegador entenda o conteúdo
express.static.mime.define({
  'application/javascript': ['tsx', 'ts', 'jsx', 'js']
});

// 2. Rota de Saúde (Para você testar se o Node está vivo: seudominio.com/ping)
app.get('/ping', (req, res) => res.send('pong - servidor node ativo'));

// 3. Middleware de Interceptação de Código (Aumentando a compatibilidade)
app.use((req, res, next) => {
  const urlPath = req.path;
  const ext = path.extname(urlPath);
  
  if (['.tsx', '.ts', '.jsx'].includes(ext)) {
    const filePath = path.join(ROOT_DIR, urlPath);
    
    if (fs.existsSync(filePath)) {
      try {
        // Lemos como stream para evitar problemas de buffer
        res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Access-Control-Allow-Origin', '*');
        const stream = fs.createReadStream(filePath);
        return stream.pipe(res);
      } catch (err) {
        console.error(`Erro ao processar ${urlPath}:`, err);
        return res.status(500).send('Erro interno no servidor de código');
      }
    }
  }
  next();
});

// 4. Servir estáticos normais
app.use(express.static(ROOT_DIR, {
  index: false,
  setHeaders: (res, path) => {
    if (path.endsWith('.tsx') || path.endsWith('.ts')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// 5. SPA Fallback - TODA rota de navegação vai para o index.html
app.get('*', (req, res) => {
  // Se for um pedido de arquivo que não existe (ex: favicon.ico), manda 404
  if (req.path.includes('.') && !req.path.endsWith('.tsx')) {
    return res.status(404).end();
  }
  
  const indexPath = path.join(ROOT_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(500).send('Erro: index.html não encontrado na raiz do servidor.');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n=================================`);
  console.log(`Servidor Menu ADS Rodando!`);
  console.log(`Porta: ${PORT}`);
  console.log(`Diretório: ${ROOT_DIR}`);
  console.log(`=================================\n`);
});
