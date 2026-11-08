import { pool } from '../db.js';

const DIFICULTADES = ['facil', 'moderada', 'dificil'];
const ESTADOS = ['programado', 'completo', 'cancelado', 'finalizado'];

const SELECT_TOUR = `
  SELECT t.*,
         (t.cupo_maximo - t.cupos_reservados) AS cupos_disponibles,
         v.nombre AS volcan_nombre
  FROM tours t
  INNER JOIN volcanes v ON v.id = t.volcan_id
`;

function fechaHoy() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function validarTour(datos, esNuevo) {
  const {
    nombre, volcan_id, fecha_salida, duracion_horas, dificultad,
    precio, cupo_maximo, cupos_reservados, estado, punto_encuentro, guia,
  } = datos;

  if (!nombre || !nombre.trim()) return 'El nombre es obligatorio';
  if (!volcan_id) return 'Debe seleccionar un volcan';
  if (!fecha_salida || !/^\d{4}-\d{2}-\d{2}$/.test(fecha_salida)) return 'La fecha de salida no es valida';
  if (esNuevo && fecha_salida < fechaHoy()) return 'La fecha de salida no puede estar en el pasado';

  if (!Number.isInteger(Number(duracion_horas)) || Number(duracion_horas) <= 0) {
    return 'La duracion debe ser un numero entero de horas mayor a 0';
  }
  if (!DIFICULTADES.includes(dificultad)) return 'La dificultad no es valida';
  if (!(Number(precio) > 0)) return 'El precio debe ser mayor a 0';
  if (!Number.isInteger(Number(cupo_maximo)) || Number(cupo_maximo) <= 0) {
    return 'El cupo maximo debe ser un entero mayor a 0';
  }

  const reservados = Number(cupos_reservados ?? 0);
  if (!Number.isInteger(reservados) || reservados < 0) return 'Los cupos reservados no son validos';
  if (reservados > Number(cupo_maximo)) return 'Los cupos reservados no pueden superar el cupo maximo';

  if (estado && !ESTADOS.includes(estado)) return 'El estado no es valido';
  if (!punto_encuentro || !punto_encuentro.trim()) return 'El punto de encuentro es obligatorio';
  if (!guia || !guia.trim()) return 'El guia es obligatorio';
  return null;
}

function valoresTour(d) {
  return [
    d.nombre.trim(), d.volcan_id, d.fecha_salida, d.duracion_horas, d.dificultad,
    d.precio, d.cupo_maximo, d.cupos_reservados ?? 0, d.estado || 'programado',
    d.punto_encuentro.trim(), d.guia.trim(), d.descripcion || null,
  ];
}

// GET /api/tours?buscar=&volcan_id=&dificultad=&estado=
export async function listar(req, res) {
  const { buscar, volcan_id, dificultad, estado } = req.query;
  const condiciones = [];
  const valores = [];

  if (buscar) {
    condiciones.push('(t.nombre LIKE ? OR t.guia LIKE ?)');
    valores.push(`%${buscar}%`, `%${buscar}%`);
  }
  if (volcan_id) {
    condiciones.push('t.volcan_id = ?');
    valores.push(volcan_id);
  }
  if (dificultad) {
    condiciones.push('t.dificultad = ?');
    valores.push(dificultad);
  }
  if (estado) {
    condiciones.push('t.estado = ?');
    valores.push(estado);
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
  const [filas] = await pool.query(`${SELECT_TOUR} ${where} ORDER BY t.fecha_salida`, valores);
  res.json(filas);
}

// GET /api/tours/resumen
export async function resumen(req, res) {
  const [[totales]] = await pool.query(`
    SELECT
      COUNT(*) AS total,
      SUM(estado = 'programado' AND fecha_salida >= CURDATE()) AS proximos,
      COALESCE(SUM(CASE WHEN estado = 'programado' THEN cupo_maximo - cupos_reservados ELSE 0 END), 0) AS cupos_disponibles
    FROM tours
  `);

  const [porVolcan] = await pool.query(`
    SELECT v.nombre, COUNT(t.id) AS total
    FROM volcanes v
    INNER JOIN tours t ON t.volcan_id = v.id
    GROUP BY v.id, v.nombre
    ORDER BY total DESC
  `);

  res.json({
    total: Number(totales.total),
    proximos: Number(totales.proximos || 0),
    cupos_disponibles: Number(totales.cupos_disponibles),
    por_volcan: porVolcan,
  });
}

// GET /api/tours/:id
export async function obtener(req, res) {
  const [filas] = await pool.query(
    `SELECT t.*,
            (t.cupo_maximo - t.cupos_reservados) AS cupos_disponibles,
            v.nombre AS volcan_nombre,
            v.departamento AS volcan_departamento,
            v.altura_m AS volcan_altura_m
     FROM tours t
     INNER JOIN volcanes v ON v.id = t.volcan_id
     WHERE t.id = ?`,
    [req.params.id]
  );
  if (filas.length === 0) return res.status(404).json({ mensaje: 'Tour no encontrado' });
  res.json(filas[0]);
}

// POST /api/tours
export async function crear(req, res) {
  const error = validarTour(req.body, true);
  if (error) return res.status(400).json({ mensaje: error });

  const [resultado] = await pool.query(
    `INSERT INTO tours
      (nombre, volcan_id, fecha_salida, duracion_horas, dificultad, precio,
       cupo_maximo, cupos_reservados, estado, punto_encuentro, guia, descripcion)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    valoresTour(req.body)
  );
  res.status(201).json({ id: resultado.insertId, mensaje: 'Tour creado' });
}

// PUT /api/tours/:id
export async function actualizar(req, res) {
  const error = validarTour(req.body, false);
  if (error) return res.status(400).json({ mensaje: error });

  const [resultado] = await pool.query(
    `UPDATE tours SET
       nombre = ?, volcan_id = ?, fecha_salida = ?, duracion_horas = ?, dificultad = ?, precio = ?,
       cupo_maximo = ?, cupos_reservados = ?, estado = ?, punto_encuentro = ?, guia = ?, descripcion = ?
     WHERE id = ?`,
    [...valoresTour(req.body), req.params.id]
  );
  if (resultado.affectedRows === 0) return res.status(404).json({ mensaje: 'Tour no encontrado' });
  res.json({ mensaje: 'Tour actualizado' });
}

// PATCH /api/tours/:id/estado
export async function cambiarEstado(req, res) {
  const { estado } = req.body;
  if (!ESTADOS.includes(estado)) return res.status(400).json({ mensaje: 'El estado no es valido' });

  const [resultado] = await pool.query('UPDATE tours SET estado = ? WHERE id = ?', [estado, req.params.id]);
  if (resultado.affectedRows === 0) return res.status(404).json({ mensaje: 'Tour no encontrado' });
  res.json({ mensaje: 'Estado actualizado' });
}

// DELETE /api/tours/:id
export async function eliminar(req, res) {
  const [resultado] = await pool.query('DELETE FROM tours WHERE id = ?', [req.params.id]);
  if (resultado.affectedRows === 0) return res.status(404).json({ mensaje: 'Tour no encontrado' });
  res.json({ mensaje: 'Tour eliminado' });
}