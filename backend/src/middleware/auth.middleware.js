const jwt = require('jsonwebtoken');
function authenticateToken(req, res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) return res.status(401).json({ message: 'Debes iniciar sesión para continuar.' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch (_error) { return res.status(401).json({ message: 'La sesión no es válida o ha expirado.' }); }
}
module.exports = { authenticateToken };