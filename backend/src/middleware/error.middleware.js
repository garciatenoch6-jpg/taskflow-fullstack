function notFound(req, res, _next) { res.status(404).json({ message: `Ruta no encontrada: ${req.originalUrl}` }); }
function errorHandler(error, _req, res, _next) {
  console.error(error);
  if (error.code === 11000) return res.status(409).json({ message: 'Ya existe una cuenta con ese correo.' });
  if (error.name === 'ValidationError') return res.status(400).json({ message: Object.values(error.errors).map(e => e.message).join(' ') });
  if (error.name === 'CastError') return res.status(400).json({ message: 'Identificador no válido.' });
  res.status(error.status || 500).json({ message: error.status ? error.message : 'Error interno del servidor.' });
}
module.exports = { notFound, errorHandler };