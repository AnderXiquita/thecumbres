import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import volcanesRoutes from './routes/volcanes.routes.js';
import toursRoutes from './routes/tours.routes.js';
import { verificarToken } from './middleware/auth.js';

const app = express();

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);                         // publica
app.use('/api/volcanes', verificarToken, volcanesRoutes); // protegida
app.use('/api/tours', verificarToken, toursRoutes);       // protegida

// Ninguna ruta coincidio
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Manejador central de errores
app.use((err, req, res, next) => {
  switch (err.errno) {
    case 1451:
      return res.status(409).json({ mensaje: 'No se puede eliminar: tiene tours asociados' });
    case 1452:
      return res.status(400).json({ mensaje: 'El volcan seleccionado no existe' });
    case 1062:
      return res.status(409).json({ mensaje: 'Ya existe un registro con ese nombre' });
    case 3819:
      return res.status(400).json({ mensaje: 'Los datos no cumplen las reglas de la base de datos' });
  }
  console.error(err);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API de TheCumbres escuchando en http://localhost:${PORT}`);
});