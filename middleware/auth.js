const jwt = require('jsonwebtoken');

// Middleware para proteger rotas
module.exports = function (req, res, next) {
  // Pega o token do header da requisição
  const authHeader = req.header('Authorization');

  // Verifica se o header de autorização existe
  if (!authHeader) {
    return res.status(401).json({ message: 'Nenhum token, autorização negada' });
  }
  
  // O token geralmente vem no formato "Bearer <token>"
  const token = authHeader.split(' ')[1];

  // Verifica se o token existe após o split
  if (!token) {
    return res.status(401).json({ message: 'Formato de token inválido, autorização negada' });
  }

  try {
    // Verifica e decodifica o token usando o segredo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adiciona o payload do usuário (que contém o id) ao objeto da requisição
    req.user = decoded.user;
    next(); // Passa para o próximo middleware ou para a rota
  } catch (err) {
    res.status(401).json({ message: 'Token não é válido' });
  }
};
