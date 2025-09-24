const mongoose = require('mongoose');

// Define o Schema (estrutura) do documento de usuário
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Garante que cada email seja único no banco
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Data de criação do usuário
  },
});

// Exporta o modelo para ser usado em outras partes da aplicação
module.exports = mongoose.model('user', UserSchema);
