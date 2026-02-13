
const express = require('express');
const path = require('path');
const app = express();

// Porta padrão da Hostinger ou 3000
const PORT = process.env.PORT || 3000;

// Servir arquivos estáticos da pasta de build (assumindo que você subirá o build para a raiz ou pasta 'dist')
app.use(express.static(path.join(__dirname, '/')));

// Rota principal para SPA (redireciona todas as rotas para o index.html)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
