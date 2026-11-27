const API = '/api';
const form = document.querySelector('#auth-form');
const nameField = document.querySelector('#name-field');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const message = document.querySelector('#form-message');
const submit = document.querySelector('#submit-button');
let registering = false;
if (localStorage.getItem('taskflow_token')) location.replace('index.html');
document.querySelector('#switch-mode').addEventListener('click', () => {
  registering = !registering; nameField.hidden = !registering; nameInput.required = registering;
  document.querySelector('#form-title').textContent = registering ? 'Crea tu cuenta' : 'Inicia sesión';
  document.querySelector('#form-subtitle').textContent = registering ? 'Regístrate para comenzar a organizarte.' : 'Ingresa tus datos para continuar.';
  document.querySelector('#switch-copy').textContent = registering ? '¿Ya tienes cuenta?' : '¿Aún no tienes cuenta?';
  document.querySelector('#switch-mode').textContent = registering ? 'Iniciar sesión' : 'Crear cuenta';
  submit.textContent = registering ? 'Crear cuenta →' : 'Iniciar sesión →'; message.textContent = '';
});
form.addEventListener('submit', async event => {
  event.preventDefault(); message.textContent = ''; submit.disabled = true; submit.textContent = 'Procesando...';
  const body = { email: emailInput.value.trim(), password: passwordInput.value };
  if (registering) body.name = nameInput.value.trim();
  try {
    const response = await fetch(`${API}/auth/${registering ? 'register' : 'login'}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await response.json(); if (!response.ok) throw new Error(data.message || 'No se pudo completar la operación.');
    localStorage.setItem('taskflow_token', data.token); localStorage.setItem('taskflow_user', JSON.stringify(data.user)); location.href = 'index.html';
  } catch (error) { message.textContent = error.message; }
  finally { submit.disabled = false; submit.textContent = registering ? 'Crear cuenta →' : 'Iniciar sesión →'; }
});