import { pool } from '../db.js';

function validarVolcan({ nombre, departamento, altura_m }) {
  if (!nombre || !nombre.trim()) return 'El nombre es obligatorio';
  if (!departamento || !departamento.trim()) return 'El departamento es obligatorio';
  if (!Number.isInteger(Number(altura_m)) || Number(altura_m) <= 0) {
    return 'La altura debe ser un numero entero mayor a 0';
  }
  return null;
}

// GET /api/volcanes
export async function listar(req, res) {
  const [filas] = await pool.query(`
    SELECT v.*, COUNT(t.id) AS total_tours
    FROM volcanes v
    LEFT JOIN tours t ON t.volcan_id = v.id
    GROUP BY v.id
    ORDER BY v.nombre
  `);
  res.json(filas);
}

// GET /api/volcanes/:id
export async function obtener(req, res) {
  const [filas] = await pool.query('SELECT * FROM volcanes WHERE id = ?', [req.params.id]);
  if (filas.length === 0) return res.status(404).json({ mensaje: 'Volcan no encontrado' });
  res.json(filas[0]);
}

// POST /api/volcanes
export async function crear(req, res) {
  const error = validarVolcan(req.body);
  if (error) return res.status(400).json({ mensaje: error });

  const { nombre, departamento, altura_m, descripcion } = req.body;
  const [resultado] = await pool.query(
    'INSERT INTO volcanes (nombre, departamento, altura_m, descripcion) VALUES (?, ?, ?, ?)',
    [nombre.trim(), departamento.trim(), altura_m, descripcion || null]
  );
  res.status(201).json({ id: resultado.insertId, mensaje: 'Volcan creado' });
}

// PUT /api/volcanes/:id
export async function actualizar(req, res) {
  const error = validarVolcan(req.body);
  if (error) return res.status(400).json({ mensaje: error });

  const { nombre, departamento, altura_m, descripcion } = req.body;
  const [resultado] = await pool.query(
    'UPDATE volcanes SET nombre = ?, departamento = ?, altura_m = ?, descripcion = ? WHERE id = ?',
    [nombre.trim(), departamento.trim(), altura_m, descripcion || null, req.params.id]
  );
  if (resultado.affectedRows === 0) return res.status(404).json({ mensaje: 'Volcan no encontrado' });
  res.json({ mensaje: 'Volcan actualizado' });
}

// DELETE /api/volcanes/:id
export async function eliminar(req, res) {
  const [resultado] = await pool.query('DELETE FROM volcanes WHERE id = ?', [req.params.id]);
  if (resultado.affectedRows === 0) return res.status(404).json({ mensaje: 'Volcan no encontrado' });
  res.json({ mensaje: 'Volcan eliminado' });
}