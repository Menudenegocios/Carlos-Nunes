
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname);

// 1. Rota para favicon (evita erro 404 no log)
app.get('/favicon.ico', (req, res) => res.status(204).end());

// 2. Rota virtual para o script principal (Bypass de firewall)
app.get('/app-main.js', (req, res) => {
  const tsxPath = path.join(ROOT_DIR, 'index.tsx');
  if (fs.existsSync(tsxPath)) {
    res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    return fs.createReadStream(tsxPath).pipe(res);
  }
  res.status(404).send('Script principal index.tsx não encontrado.');
});

// 3. Rota de Saúde
app.get('/ping', (req, res) => res.send('OK - Node is alive'));

// 4. Servir arquivos estáticos (imagens, etc)
app.use(express.static(ROOT_DIR, {
  index: false
}));

// 5. Rota para servir qualquer outro arquivo de código solicitado pelo Babel/ImportMap
app.get('/*.tsx', (req, res) => {
  const filePath = path.join(ROOT_DIR, req.path);
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    return fs.createReadStream(filePath).pipe(res);
  }
  res.status(404).end();
});

app.get('/*.ts', (req, res) => {
  const filePath = path.join(ROOT_DIR, req.path);
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    return fs.createReadStream(filePath).pipe(res);
  }
  res.status(404).end();
});

// 6. SPA Fallback
app.get('*', (req, res) => {
  // Evita loops em arquivos que não existem
  if (req.path.includes('.')) return res.status(404).end();

  const indexPath = path.join(ROOT_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(500).send('Erro: index.html ausente.');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
