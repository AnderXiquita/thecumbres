import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

// POST /api/auth/login
export async function login(req, res) {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ mensaje: 'Usuario y contrasena son obligatorios' });
  }

  const [filas] = await pool.query(
    'SELECT id, usuario, nombre, password_hash FROM usuarios WHERE usuario = ?',
    [usuario]
  );
  const user = filas[0];

  const valido = user && (await bcrypt.compare(password, user.password_hash));
  if (!valido) {
    return res.status(401).json({ mensaje: 'Usuario o contrasena incorrectos' });
  }

  const token = jwt.sign(
    { id: user.id, usuario: user.usuario, nombre: user.nombre },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

  res.json({
    token,
    usuario: { id: user.id, usuario: user.usuario, nombre: user.nombre },
  });
}