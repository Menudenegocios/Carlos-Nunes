
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname);

// 1. Configuração agressiva de MIME types
express.static.mime.define({
  'application/javascript': ['tsx', 'ts', 'jsx']
});

// 2. Middleware para servir arquivos .tsx, .ts, .jsx manualmente
// Lemos o arquivo e enviamos o conteúdo para evitar bloqueios de segurança (403)
app.use((req, res, next) => {
  const ext = path.extname(req.path);
  if (['.tsx', '.ts', '.jsx'].includes(ext)) {
    const filePath = path.join(ROOT_DIR, req.path);
    
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
        // Adicionamos um cabeçalho para evitar cache agressivo durante o deploy
        res.setHeader('Cache-Control', 'no-store');
        return res.send(content);
      } catch (err) {
        console.error(`Erro ao ler arquivo ${filePath}:`, err);
        return res.status(500).send('Erro interno ao processar script');
      }
    }
  }
  next();
});

// 3. Servir arquivos estáticos normais (imagens, css, etc)
app.use(express.static(ROOT_DIR));

// 4. Rota de diagnóstico
app.get('/api/status', (req, res) => {
  res.json({ online: true, root: ROOT_DIR });
});

// 5. Fallback para SPA (Single Page Application)
app.get('*', (req, res) => {
  // Se for uma requisição de arquivo que não existe, retorna 404
  if (req.path.includes('.') && !req.path.endsWith('.tsx')) {
    return res.status(404).send('Arquivo não encontrado');
  }
  // Para rotas de navegação, serve o index.html
  const indexPath = path.join(ROOT_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(500).send('Erro crítico: index.html não encontrado no servidor.');
  }
});

app.listen(PORT, () => {
  console.log(`>>> Servidor Menu ADS ativo na porta ${PORT}`);
});
