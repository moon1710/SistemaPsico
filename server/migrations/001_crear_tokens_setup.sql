USE sistema_psico2;

CREATE TABLE IF NOT EXISTS tokens_setup (
    id VARCHAR(255) PRIMARY KEY,
    solicitudId VARCHAR(255) NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    usado BOOLEAN DEFAULT false,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaExpiracion DATETIME NOT NULL,
    datosAdicionales JSON,
    INDEX idx_token (token),
    INDEX idx_email (email),
    INDEX idx_expiracion (fechaExpiracion)
);

CREATE TABLE IF NOT EXISTS notificaciones_sistema (
    id VARCHAR(255) PRIMARY KEY,
    tipo ENUM('NUEVA_SOLICITUD', 'SOLICITUD_APROBADA', 'SOLICITUD_RECHAZADA', 'SETUP_COMPLETADO') NOT NULL,
    destinatario_email VARCHAR(255) NOT NULL,
    asunto VARCHAR(500) NOT NULL,
    mensaje TEXT NOT NULL,
    enviado BOOLEAN DEFAULT false,
    fecha_envio TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tipo (tipo),
    INDEX idx_enviado (enviado),
    INDEX idx_destinatario (destinatario_email)
);