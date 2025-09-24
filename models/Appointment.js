const mongoose = require('mongoose');

// Define o Schema (estrutura) do documento de atendimento
const AtendimentoSchema = new mongoose.Schema({
  // Adiciona uma referência ao usuário que criou o atendimento
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', // Refere-se à coleção 'users'
    required: true
  },
  nomeCliente: {
    type: String,
    required: true,
  },
  telefone: {
    type: String,
    required: false, // Opcional
  },
  dataAtendimento: {
    type: Date,
    required: true,
  },
  metodo: {
    type: String, // Ex: Tarot, Baralho Cigano
    required: true,
  },
  valor: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('atendimento', AtendimentoSchema);
