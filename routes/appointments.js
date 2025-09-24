const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Importa o modelo de Atendimento
const Atendimento = require('../models/Appointment');

// @route   POST api/atendimentos
// @desc    Criar um novo atendimento
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  const { nomeCliente, telefone, dataAtendimento, metodo, valor } = req.body;

  try {
    const novoAtendimento = new Atendimento({
      user: req.user.id, // Associa o atendimento ao usuário logado
      nomeCliente,
      telefone,
      dataAtendimento,
      metodo,
      valor,
    });

    const atendimento = await novoAtendimento.save();
    res.json(atendimento);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// @route   GET api/atendimentos
// @desc    Obter todos os atendimentos do usuário logado
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Busca os atendimentos associados ao ID do usuário e ordena pelos mais recentes
    const atendimentos = await Atendimento.find({ user: req.user.id }).sort({ dataAtendimento: -1 });
    res.json(atendimentos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// @route   PUT api/atendimentos/:id
// @desc    Atualizar um atendimento
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  const { nomeCliente, telefone, dataAtendimento, metodo, valor } = req.body;

  // Constrói o objeto de atendimento com os campos recebidos
  const camposAtendimento = {};
  if (nomeCliente) camposAtendimento.nomeCliente = nomeCliente;
  if (telefone) camposAtendimento.telefone = telefone;
  if (dataAtendimento) camposAtendimento.dataAtendimento = dataAtendimento;
  if (metodo) camposAtendimento.metodo = metodo;
  if (valor !== undefined) camposAtendimento.valor = valor;

  try {
    let atendimento = await Atendimento.findById(req.params.id);

    if (!atendimento) return res.status(404).json({ msg: 'Atendimento não encontrado' });

    // Garante que o usuário só possa editar seus próprios atendimentos
    if (atendimento.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Não autorizado' });
    }

    atendimento = await Atendimento.findByIdAndUpdate(
      req.params.id,
      { $set: camposAtendimento },
      { new: true } // Retorna o documento modificado
    );

    res.json(atendimento);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// @route   DELETE api/atendimentos/:id
// @desc    Deletar um atendimento
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    let atendimento = await Atendimento.findById(req.params.id);

    if (!atendimento) return res.status(404).json({ msg: 'Atendimento não encontrado' });

    // Garante que o usuário só possa deletar seus próprios atendimentos
    if (atendimento.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Não autorizado' });
    }

    // CORREÇÃO: findByIdAndRemove foi substituído por findByIdAndDelete
    await Atendimento.findByIdAndDelete(req.params.id);

    res.json({ message: 'Atendimento removido com sucesso' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

module.exports = router;

