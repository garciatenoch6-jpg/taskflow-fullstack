# Documentación técnica — TaskFlow Full Stack

## Objetivo
Aplicación web para registrar usuarios y gestionar tareas con operaciones CRUD y persistencia en MongoDB.

## Arquitectura
El navegador consume una API REST desarrollada con Express. Express sirve también los archivos estáticos del frontend. Mongoose conecta con MongoDB. bcryptjs almacena contraseñas como hash y JWT autentica las solicitudes protegidas.

## Modelos
- **User:** nombre, correo, contraseña cifrada (hash) y marcas de tiempo.
- **Task:** título, descripción, estado completed, propietario (referencia al usuario) y marcas de tiempo.

## Endpoints
- `POST /api/auth/register`: valida y registra usuario, cifra contraseña y devuelve JWT.
- `POST /api/auth/login`: verifica credenciales y devuelve JWT.
- `GET /api/auth/me`: devuelve el perfil del usuario autenticado.
- `GET /api/tasks`: lista tareas del usuario autenticado.
- `POST /api/tasks`: crea una tarea para el usuario autenticado.
- `PATCH /api/tasks/:id`: modifica título, descripción o estado de una tarea propia.
- `DELETE /api/tasks/:id`: elimina una tarea propia.
- `GET /api/health`: informa estado del servidor y conexión a MongoDB.

Las rutas protegidas requieren `Authorization: Bearer <token>`.

## Middleware
`authenticateToken` valida JWT. `validateRegistration`, `validateLogin` y `validateTask` validan entradas. `notFound` atiende rutas inexistentes y `errorHandler` centraliza errores de validación, duplicados, identificadores y servidor.

## Variables de entorno
- `PORT`: puerto HTTP.
- `MONGODB_URI`: URI de MongoDB.
- `JWT_SECRET`: secreto privado para firmar tokens.
- `JWT_EXPIRES_IN`: expiración del token.
- `CLIENT_ORIGIN`: origen permitido por CORS.

El archivo `.env` no debe subirse a GitHub; `.env.example` documenta las variables sin contener secretos reales.

## Flujo de autenticación
1. El usuario registra una cuenta o inicia sesión.
2. El backend valida los datos.
3. En registro, bcryptjs genera un hash; en login, compara la contraseña con el hash guardado.
4. El backend firma un JWT con el identificador y correo del usuario.
5. El frontend envía el token en cada petición protegida.
6. El middleware verifica el token y los controladores limitan las tareas al propietario autenticado.

## Evidencias recomendadas
Capturar registro, login, crear/editar/completar/eliminar tareas, colección `users` y `tasks` en Compass, endpoint `/api/health` y respuesta 401 al solicitar `/api/tasks` sin token. Grabar un video demostrativo con ese recorrido.
