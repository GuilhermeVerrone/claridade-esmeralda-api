// Importação dos módulos necessários
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Conecta ao banco de dados MongoDB
connectDB();

// Inicializa a aplicação Express
const app = express();

// Middlewares
// Habilita o CORS para permitir requisições de diferentes origens (do nosso frontend)
app.use(cors());
// Habilita o parsing de JSON no corpo das requisições
app.use(express.json());

// Rota de teste inicial
app.get('/', (req, res) => {
  res.json({ message: 'API ClaridadedeEsmeralda no ar!' });
});

// Define as rotas da aplicação
// Todas as rotas que começarem com /api/auth serão gerenciadas pelo arquivo auth.js
app.use('/api/auth', require('./routes/auth'));
// Todas as rotas que começarem com /api/atendimentos serão gerenciadas pelo arquivo atendimentos.js
app.use('/api/atendimentos', require('./routes/appointments'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Define a porta do servidor, buscando do .env ou usando 5000 como padrão
const PORT = process.env.PORT || 5000;

// Inicia o servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
