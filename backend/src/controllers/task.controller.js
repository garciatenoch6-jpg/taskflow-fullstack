const Task = require('../models/Task');
async function listTasks(req, res, next) {
  try { res.json({ tasks: await Task.find({ owner: req.user.id }).sort({ createdAt: -1 }) }); }
  catch (error) { next(error); }
}
async function createTask(req, res, next) {
  try {
    const task = await Task.create({ title: req.body.title.trim(), description: req.body.description || '', owner: req.user.id });
    res.status(201).json({ message: 'Tarea creada.', task });
  } catch (error) { next(error); }
}
async function updateTask(req, res, next) {
  try {
    const updates = {};
    for (const key of ['title', 'description', 'completed']) if (req.body[key] !== undefined) updates[key] = key === 'title' ? req.body[key].trim() : req.body[key];
    const task = await Task.findOneAndUpdate({ _id: req.params.id, owner: req.user.id }, updates, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada.' });
    res.json({ message: 'Tarea actualizada.', task });
  } catch (error) { next(error); }
}
async function deleteTask(req, res, next) {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada.' });
    res.json({ message: 'Tarea eliminada.' });
  } catch (error) { next(error); }
}
module.exports = { listTasks, createTask, updateTask, deleteTask };