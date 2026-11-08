DROP DATABASE IF EXISTS thecumbres;
CREATE DATABASE thecumbres CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE thecumbres;


CREATE TABLE usuarios (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  usuario       VARCHAR(50)  NOT NULL UNIQUE,
  nombre        VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  creado_en     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Catalogo: volcanes
CREATE TABLE volcanes (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  nombre       VARCHAR(100) NOT NULL UNIQUE,
  departamento VARCHAR(100) NOT NULL,
  altura_m     INT          NOT NULL,
  descripcion  TEXT,
  creado_en    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_volcan_altura CHECK (altura_m > 0)
);

-- Entidad principal: tours
CREATE TABLE tours (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  nombre           VARCHAR(150)  NOT NULL,
  volcan_id        INT           NOT NULL,
  fecha_salida     DATE          NOT NULL,
  duracion_horas   INT           NOT NULL,
  dificultad       ENUM('facil','moderada','dificil') NOT NULL,
  precio           DECIMAL(10,2) NOT NULL,
  cupo_maximo      INT           NOT NULL,
  cupos_reservados INT           NOT NULL DEFAULT 0,
  estado           ENUM('programado','completo','cancelado','finalizado') NOT NULL DEFAULT 'programado',
  punto_encuentro  VARCHAR(150)  NOT NULL,
  guia             VARCHAR(100)  NOT NULL,
  descripcion      TEXT,
  creado_en        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Llave foranea: un tour pertenece a un volcan.
  -- ON DELETE RESTRICT: MySQL impide borrar un volcan que tenga tours.
  CONSTRAINT fk_tours_volcan FOREIGN KEY (volcan_id)
    REFERENCES volcanes(id) ON DELETE RESTRICT ON UPDATE CASCADE,

  CONSTRAINT chk_tour_precio   CHECK (precio > 0),
  CONSTRAINT chk_tour_duracion CHECK (duracion_horas > 0),
  CONSTRAINT chk_tour_cupo     CHECK (cupo_maximo > 0),
  CONSTRAINT chk_tour_reservas CHECK (cupos_reservados >= 0 AND cupos_reservados <= cupo_maximo)
);

-- Datos de ejemplo

-- Usuario: admin / Contraseña: admin123
INSERT INTO usuarios (usuario, nombre, password_hash) VALUES
('admin', 'Administrador', '$2b$10$/AhWpyDAgqx8n..HB0jhPOqdav4l9MHCS3XWYfLykL4W4SwKUc4Li');

INSERT INTO volcanes (nombre, departamento, altura_m, descripcion) VALUES
('Acatenango',  'Chimaltenango',  3976, 'Uno de los ascensos mas populares del pais; desde su cumbre se observa la actividad del volcan de Fuego.'),
('Pacaya',      'Escuintla',      2552, 'Volcan activo de ascenso corto, ideal para principiantes y familias.'),
('Agua',        'Sacatepequez',   3760, 'Volcan inactivo que domina el paisaje de Antigua Guatemala.'),
('Santa Maria', 'Quetzaltenango', 3772, 'Ascenso exigente con vista al domo activo del Santiaguito.'),
('Tajumulco',   'San Marcos',     4220, 'El punto mas alto de Centroamerica.'),
('Ipala',       'Chiquimula',     1650, 'Volcan con una laguna en su crater. Sin tours programados por ahora.');

INSERT INTO tours (nombre, volcan_id, fecha_salida, duracion_horas, dificultad, precio, cupo_maximo, cupos_reservados, estado, punto_encuentro, guia, descripcion) VALUES
('Acatenango con vista al Fuego',  1, '2026-11-21', 30, 'dificil',  650.00, 15,  9, 'programado', 'Parque Central de Antigua',     'Carlos Mendez',  'Ascenso de dos dias con noche en campamento base frente al volcan de Fuego.'),
('Acatenango express',             1, '2026-12-05', 14, 'dificil',  450.00, 10, 10, 'completo',   'Parque Central de Antigua',     'Lucia Batz',     'Ascenso y descenso en el mismo dia para montanistas con experiencia.'),
('Pacaya al atardecer',            2, '2026-11-15',  5, 'facil',    180.00, 25, 12, 'programado', 'Entrada San Francisco de Sales','Jorge Coc',      'Caminata corta hasta los campos de lava, con malvaviscos incluidos.'),
('Pacaya en familia',              2, '2026-10-25',  5, 'facil',    150.00, 20, 18, 'finalizado', 'Entrada San Francisco de Sales','Jorge Coc',      'Recorrido tranquilo pensado para ninos y adultos mayores.'),
('Volcan de Agua desde Santa Maria de Jesus', 3, '2026-11-29', 10, 'moderada', 300.00, 12, 4, 'programado', 'Santa Maria de Jesus',   'Ana Xicay',      'Ascenso por la ruta tradicional con vista a Antigua y al valle.'),
('Santa Maria al amanecer',        4, '2026-12-12', 12, 'dificil',  350.00, 12,  2, 'programado', 'Llanos del Pinal, Xela',        'Pedro Tzul',     'Salida de madrugada para ver el amanecer y el Santiaguito desde la cumbre.'),
('Tajumulco: techo de Centroamerica', 5, '2026-12-19', 28, 'dificil', 550.00, 15, 6, 'programado', 'San Marcos cabecera',          'Maria Fuentes',  'Expedicion de dos dias con campamento a mas de 3,800 metros.'),
('Agua nocturno',                  3, '2026-11-14', 10, 'moderada', 320.00, 10,  0, 'cancelado',  'Santa Maria de Jesus',          'Ana Xicay',      'Cancelado por condiciones climaticas.');
