function validateRegistration(req, res, next) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Nombre, correo y contraseña son obligatorios.' });
  if (String(name).trim().length < 2) return res.status(400).json({ message: 'El nombre debe tener al menos 2 caracteres.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) return res.status(400).json({ message: 'Ingresa un correo válido.' });
  if (String(password).length < 8) return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres.' });
  next();
}
function validateLogin(req, res, next) {
  if (!req.body.email || !req.body.password) return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' });
  next();
}
function validateTask(req, res, next) {
  const { title, description, completed } = req.body;
  if (req.method === 'POST' && (typeof title !== 'string' || !title.trim())) return res.status(400).json({ message: 'El título es obligatorio.' });
  if (title !== undefined && (typeof title !== 'string' || !title.trim() || title.trim().length > 120)) return res.status(400).json({ message: 'El título debe tener entre 1 y 120 caracteres.' });
  if (description !== undefined && (typeof description !== 'string' || description.length > 500)) return res.status(400).json({ message: 'La descripción debe tener máximo 500 caracteres.' });
  if (completed !== undefined && typeof completed !== 'boolean') return res.status(400).json({ message: 'completed debe ser booleano.' });
  next();
}
module.exports = { validateRegistration, validateLogin, validateTask };