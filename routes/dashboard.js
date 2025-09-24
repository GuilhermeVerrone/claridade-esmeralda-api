const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Atendimento = require('../models/Appointment');
const mongoose = require('mongoose');

// @route   GET api/dashboard/kpis
// @desc    Obter KPIs (Key Performance Indicators) para o dashboard
// @access  Private
router.get('/kpis', authMiddleware, async (req, res) => {
    try {
        // Garante que o ID do usuário seja um ObjectId válido para o MongoDB
        const userId = new mongoose.Types.ObjectId(req.user.id);

        // Define o intervalo do mês corrente
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

        // Usa o Aggregation Pipeline do MongoDB para calcular os dados de forma eficiente
        const kpiData = await Atendimento.aggregate([
            // Fase 1: Filtrar atendimentos do usuário logado e do mês corrente
            {
                $match: {
                    user: userId,
                    dataAtendimento: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    }
                }
            },
            // Fase 2: Agrupar os resultados para calcular os totais
            {
                $group: {
                    _id: null, // Agrupa todos os documentos correspondentes em um único grupo
                    faturamentoMes: { $sum: '$valor' },
                    atendimentosMes: { $sum: 1 } // Conta cada documento como 1
                }
            }
        ]);

        // Formata a resposta, garantindo que os valores sejam numéricos mesmo se não houver atendimentos
        let results = {
            faturamentoMes: 0,
            atendimentosMes: 0,
            ticketMedio: 0
        };

        if (kpiData.length > 0) {
            results.faturamentoMes = kpiData[0].faturamentoMes;
            results.atendimentosMes = kpiData[0].atendimentosMes;
            // Evita divisão por zero se não houver atendimentos
            if (results.atendimentosMes > 0) {
                results.ticketMedio = results.faturamentoMes / results.atendimentosMes;
            }
        }

        res.json(results);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

module.exports = router;

