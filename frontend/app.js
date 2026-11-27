const API = '/api';
const token = localStorage.getItem('taskflow_token');
const user = JSON.parse(localStorage.getItem('taskflow_user') || 'null');
const list = document.querySelector('#task-list');
const message = document.querySelector('#task-message');
const dialog = document.querySelector('#edit-dialog');
let tasks = [], filter = 'all';
if (!token) location.replace('login.html');
document.querySelector('#user-greeting').textContent = user?.name ? `Hola, ${user.name}` : 'Tu espacio de organización';
document.querySelector('#today-label').textContent = new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
async function api(path, options = {}) {
  const response = await fetch(`${API}${path}`, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(options.headers || {}) } });
  const data = await response.json();
  if (response.status === 401) { localStorage.clear(); location.replace('login.html'); throw new Error('La sesión expiró.'); }
  if (!response.ok) throw new Error(data.message || 'Ocurrió un error.'); return data;
}
function render() {
  const done = tasks.filter(t => t.completed).length;
  document.querySelector('#total-count').textContent = tasks.length;
  document.querySelector('#completed-count').textContent = done;
  document.querySelector('#pending-count').textContent = tasks.length - done;
  const shown = tasks.filter(t => filter === 'all' || (filter === 'completed' ? t.completed : !t.completed));
  list.replaceChildren();
  if (!shown.length) {
    const empty = document.createElement('div'); empty.className = 'empty-state';
    const icon = document.createElement('span'); icon.textContent = '✓';
    const heading = document.createElement('h3'); heading.textContent = filter === 'all' ? 'Aún no tienes tareas' : 'No hay tareas en este filtro';
    const p = document.createElement('p'); p.textContent = 'Agrega una actividad para empezar a organizar tu día.';
    empty.append(icon, heading, p); list.append(empty); return;
  }
  shown.forEach(task => {
    const item = document.createElement('article'); item.className = `task-item${task.completed ? ' is-completed' : ''}`;
    const check = document.createElement('input'); check.type = 'checkbox'; check.className = 'task-checkbox'; check.checked = task.completed; check.setAttribute('aria-label', 'Marcar como completada');
    check.addEventListener('change', () => updateTask(task._id, { completed: check.checked }));
    const content = document.createElement('div'); content.className = 'task-content';
    const h = document.createElement('h3'); h.textContent = task.title; content.append(h);
    if (task.description) { const p = document.createElement('p'); p.textContent = task.description; content.append(p); }
    const actions = document.createElement('div'); actions.className = 'task-actions';
    const edit = document.createElement('button'); edit.className = 'icon-button'; edit.textContent = 'Editar'; edit.type = 'button'; edit.addEventListener('click', () => openEdit(task));
    const del = document.createElement('button'); del.className = 'icon-button danger-text'; del.textContent = 'Eliminar'; del.type = 'button'; del.addEventListener('click', () => deleteTask(task._id));
    actions.append(edit, del); item.append(check, content, actions); list.append(item);
  });
}
async function loadTasks() { try { tasks = (await api('/tasks')).tasks; render(); } catch (e) { message.textContent = e.message; } }
document.querySelector('#task-form').addEventListener('submit', async event => {
  event.preventDefault(); message.textContent = '';
  const title = document.querySelector('#task-title').value.trim();
  if (!title) { message.textContent = 'Escribe un título para la tarea.'; return; }
  try { const data = await api('/tasks', { method: 'POST', body: JSON.stringify({ title, description: document.querySelector('#task-description').value.trim() }) });
    tasks.unshift(data.task); event.target.reset(); render();
  } catch (e) { message.textContent = e.message; }
});
async function updateTask(id, changes) {
  try { const data = await api(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }); tasks = tasks.map(t => t._id === id ? data.task : t); render(); }
  catch (e) { message.textContent = e.message; loadTasks(); }
}
async function deleteTask(id) {
  if (!confirm('¿Seguro que deseas eliminar esta tarea?')) return;
  try { await api(`/tasks/${id}`, { method: 'DELETE' }); tasks = tasks.filter(t => t._id !== id); render(); }
  catch (e) { message.textContent = e.message; }
}
function openEdit(task) { document.querySelector('#edit-id').value = task._id; document.querySelector('#edit-title').value = task.title; document.querySelector('#edit-description').value = task.description || ''; dialog.showModal(); }
document.querySelector('#edit-form').addEventListener('submit', async event => {
  event.preventDefault(); const id = document.querySelector('#edit-id').value;
  try { const data = await api(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify({ title: document.querySelector('#edit-title').value.trim(), description: document.querySelector('#edit-description').value.trim() }) });
    tasks = tasks.map(t => t._id === id ? data.task : t); dialog.close(); render();
  } catch (e) { message.textContent = e.message; }
});
['#close-dialog', '#cancel-edit'].forEach(selector => document.querySelector(selector).addEventListener('click', () => dialog.close()));
document.querySelectorAll('.filter-button').forEach(button => button.addEventListener('click', () => {
  filter = button.dataset.filter; document.querySelectorAll('.filter-button').forEach(b => b.classList.toggle('active', b === button)); render();
}));
document.querySelector('#logout-button').addEventListener('click', () => { localStorage.removeItem('taskflow_token'); localStorage.removeItem('taskflow_user'); location.replace('login.html'); });
loadTasks();