const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Importa o modelo de Usuário
const User = require('../models/User');

// @route   POST api/auth/register
// @desc    Registrar um usuário
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verifica se o usuário já existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Cria uma nova instância do usuário
    user = new User({
      name,
      email,
      password,
    });

    // Criptografa a senha antes de salvar
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Salva o usuário no banco de dados
    await user.save();

    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @route   POST api/auth/login
// @desc    Autenticar usuário e obter token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verifica se o usuário existe
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Compara a senha enviada com a senha criptografada no banco
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Cria o payload para o JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Gera e assina o token JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 }, // Expira em 1 hora
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;
