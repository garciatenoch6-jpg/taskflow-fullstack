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

## API (base `/api`)
| Método | Endpoint | Acceso | Función |
|---|---|---|---|
| GET | `/health` | Público | Estado del servidor/BD |
| POST | `/auth/register` | Público | Registrar usuario |
| POST | `/auth/login` | Público | Iniciar sesión |
| GET | `/auth/me` | JWT | Consultar perfil |
| GET | `/tasks` | JWT | Listar tareas propias |
| POST | `/tasks` | JWT | Crear tarea |
| PATCH | `/tasks/:id` | JWT | Editar tarea/estado |
| DELETE | `/tasks/:id` | JWT | Eliminar tarea |

Las rutas protegidas requieren `Authorization: Bearer <token>`.

## Estructura
- `backend/`: API, modelos, controladores, rutas y middleware.
- `frontend/`: páginas, estilos y JavaScript del navegador.
- `DOCUMENTACION_TECNICA.md`: arquitectura, modelos, endpoints y flujo de autenticación.

## Seguridad
Las contraseñas se almacenan con bcryptjs; JWT protege las rutas; las tareas se filtran por propietario. No publiques `.env` ni secretos. `.env.example` solo contiene valores de ejemplo.

## Despliegue
Para desplegar se necesita una base MongoDB accesible desde la nube (por ejemplo MongoDB Atlas) y configurar las variables de entorno en el servicio de hosting. No uses `127.0.0.1` como URI de MongoDB en un servidor remoto.
