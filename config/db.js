const mongoose = require('mongoose');

// Função assíncrona para conectar ao MongoDB
const connectDB = async () => {
  try {
    // Tenta conectar usando a URI do arquivo .env
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Conectado');
  } catch (err) {
    // Se der erro, exibe o erro e encerra o processo
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
