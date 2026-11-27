const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
function createToken(user) {
  return jwt.sign({ id: user._id.toString(), email: user.email }, process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '2h' });
}
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = String(email).trim().toLowerCase();
    if (await User.findOne({ email: normalizedEmail })) return res.status(409).json({ message: 'Ya existe una cuenta con ese correo.' });
    const user = await User.create({ name: String(name).trim(), email: normalizedEmail, password: await bcrypt.hash(password, 12) });
    res.status(201).json({ message: 'Cuenta creada correctamente.', token: createToken(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) { next(error); }
}
async function login(req, res, next) {
  try {
    const email = String(req.body.email).trim().toLowerCase();
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    res.json({ message: 'Inicio de sesión correcto.', token: createToken(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) { next(error); }
}
async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('name email createdAt');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });
    res.json({ user });
  } catch (error) { next(error); }
}
module.exports = { register, login, getProfile };