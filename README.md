# Sistema de Gestión de RRHH

## Descripción
Hice un sistema para gestión de usuarios o trabajadores utilizando Python en el backend con SQLite y con autenticación con JWT utilizando contraseñas encriptas, se pueden realizar Insert, Update, Créate y Delete.


## Tecnologías

**Backend**
- Python / FastAPI
- SQLAlchemy + SQLite
- Autenticación con JWT (python-jose) y contraseñas encriptadas con bcrypt

**Frontend**
- Node.js (entorno de ejecución)
- React (Vite)
- React Router para la navegación
- Axios para las peticiones a la API
- Tailwind CSS

## Funcionalidades
- Login con autenticación por token (JWT)
- CRUD completo de empleados: crear, listar, ver detalle, editar y eliminar
- CRUD de puestos, con el salario ligado directamente al puesto (no al empleado)
- Subida de foto de perfil por empleado
- Paginación y filtros (por número de empleado y por puesto) en el backend, pensado para escalar a miles de registros
- Rutas protegidas: sin sesión activa, no se puede acceder al sistema

