# TheCumbres

Sistema web para la gestion de tours a volcanes de Guatemala. Permite administrar las salidas programadas (fechas, cupos, precios, guias y estado) y el catalogo de volcanes donde se realizan.

Proyecto final del curso de Desarrollo Web — Ander Abimael Lopez Xiquita.

## Tecnologias

| Capa | Tecnologia |
|---|---|
| Frontend | Angular 20, Bootstrap 5 |
| Backend | Node.js, Express 5 |
| Base de datos | MySQL 8 (driver `mysql2`) |
| Autenticacion | JWT (`jsonwebtoken`) + contrasenas con hash (`bcryptjs`) |

## Funcionalidades

- **Login** con token JWT; las rutas del frontend estan protegidas con un guard y la API con un middleware.
- **Listado de tours** con tarjetas de resumen y filtros por texto, volcan, dificultad y estado.
- **Formulario de creacion y edicion** con validaciones (fecha no pasada, cupos reservados no mayores al cupo maximo, etc.) en frontend y backend.
- **Vista de detalle** con datos del volcan, ocupacion del tour y cambio rapido de estado.
- **Gestion del catalogo de volcanes** (CRUD). No se puede eliminar un volcan con tours asociados (integridad referencial con llave foranea).

## Estructura

```
thecumbres/
  database/   Script SQL (tablas + datos de ejemplo)
  backend/    API REST (Node + Express)
  frontend/   Aplicacion Angular
```

## Requisitos

- Node.js 20.19 o superior (probado con Node 24)
- MySQL 8.0.16 o superior

## Como ejecutarlo

### 1. Base de datos

Ejecutar el script `database/thecumbres.sql` en MySQL (por ejemplo desde MySQL Workbench). Crea la base `thecumbres`, sus tablas y datos de ejemplo.

### 2. Backend

```bash
cd backend
npm install
```

Copiar `.env.example` como `.env` y colocar las credenciales de MySQL (`DB_USER`, `DB_PASSWORD`). Luego:

```bash
npm run dev
```

La API queda en `http://localhost:3000/api`.

### 3. Frontend

En otra terminal:

```bash
cd frontend
npm install
npx ng serve
```

Abrir `http://localhost:4200`.

### Usuario de prueba

- **Usuario:** admin
- **Contrasena:** admin123

## Endpoints de la API

Todas las rutas excepto el login requieren el header `Authorization: Bearer <token>`.

| Metodo | Ruta | Descripcion |
|---|---|---|
| POST | `/api/auth/login` | Inicia sesion y devuelve el token |
| GET | `/api/tours` | Lista tours (filtros: `buscar`, `volcan_id`, `dificultad`, `estado`) |
| GET | `/api/tours/resumen` | Totales para las tarjetas de resumen |
| GET | `/api/tours/:id` | Detalle de un tour con datos del volcan |
| POST | `/api/tours` | Crea un tour |
| PUT | `/api/tours/:id` | Actualiza un tour |
| PATCH | `/api/tours/:id/estado` | Cambia solo el estado |
| DELETE | `/api/tours/:id` | Elimina un tour |
| GET | `/api/volcanes` | Lista volcanes con su cantidad de tours |
| GET | `/api/volcanes/:id` | Obtiene un volcan |
| POST | `/api/volcanes` | Crea un volcan |
| PUT | `/api/volcanes/:id` | Actualiza un volcan |
| DELETE | `/api/volcanes/:id` | Elimina un volcan (409 si tiene tours) |
