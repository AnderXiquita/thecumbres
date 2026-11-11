# TheCumbres

Sistema web para la gestión de tours a volcanes de Guatemala. Permite administrar las salidas programadas (fechas, cupos, precios, guías y estado) y el catálogo de volcanes donde se realizan.

## Sobre este proyecto

TheCumbres es un proyecto pequeño a propósito. Lo construí para reforzar los fundamentos de herramientas que ya uso en mi trabajo diario, entendiendo cada pieza en lugar de solo hacerla funcionar:

- **Angular**: cómo se conectan componentes, servicios, rutas, guards e interceptores, y cuándo conviene un formulario reactivo o uno basado en plantilla.
- **Backend con Node y Express**: la separación entre rutas, controladores y middleware, el manejo centralizado de errores y la autenticación con JWT.
- **MySQL**: consultas parametrizadas, `JOIN` y agregaciones, y reglas de integridad en la propia base de datos (llaves foráneas y `CHECK`), complementadas con validaciones en el servidor y en la interfaz.

La idea fue llevar un CRUD completo de punta a punta, del diseño de la base de datos a la interfaz, y poder explicar por qué cada decisión está donde está.

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
