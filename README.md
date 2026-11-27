# TaskFlow Full Stack

Aplicación de gestión de tareas con frontend HTML/CSS/JavaScript, API REST Node.js/Express, MongoDB/Mongoose y autenticación JWT.

## Requisitos
- Node.js y npm.
- MongoDB Community Server iniciado localmente.

## Instalación
1. Entra a `backend`: `cd backend`
2. Instala dependencias: `npm install`
3. Copia `.env.example` como `.env`.
4. Configura `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_ORIGIN` y `PORT`.
5. Inicia el servidor: `npm run dev`
6. Abre `http://localhost:3000`.

## API
- `GET /api/health`: estado del servidor y base de datos.
- `POST /api/auth/register`: registro.
- `POST /api/auth/login`: inicio de sesión.
- `GET /api/auth/me`: perfil autenticado.
- `GET /api/tasks`: listar tareas propias.
- `POST /api/tasks`: crear tarea.
- `PATCH /api/tasks/:id`: actualizar tarea.
- `DELETE /api/tasks/:id`: eliminar tarea.

Las rutas protegidas requieren `Authorization: Bearer <token>`.

## Estructura
- `backend/`: API, modelos, controladores, rutas y middleware.
- `frontend/`: páginas, estilos y JavaScript del navegador.
- `DOCUMENTACION_TECNICA.md`: arquitectura, modelos y endpoints.

No publiques `.env` ni secretos. `.env.example` contiene solo valores de ejemplo. Para despliegue en nube usa una URI de MongoDB accesible desde el servicio (por ejemplo MongoDB Atlas); `127.0.0.1` no sirve como base remota.
