import express from 'express';
import allRoutes from './routes/index.js';

// Cria a aplicação Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para o Express entender JSON no corpo das requisições
app.use(express.json());

// Middleware para usar todas as nossas rotas a partir do prefixo '/api'
app.use('/api', allRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
