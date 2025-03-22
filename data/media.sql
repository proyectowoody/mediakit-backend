
DROP TABLE IF EXISTS article_images;
DROP TABLE IF EXISTS detailbuymediakit;
DROP TABLE IF EXISTS favoritemediakit;
DROP TABLE IF EXISTS cashmediakit;
DROP TABLE IF EXISTS carmediakit;
DROP TABLE IF EXISTS commentmediakit;
DROP TABLE IF EXISTS addressmediakit;
DROP TABLE IF EXISTS buymediakit;
DROP TABLE IF EXISTS blog_images;
DROP TABLE IF EXISTS blogmediakit;
DROP TABLE IF EXISTS articlemediakit;
DROP TABLE IF EXISTS subcategorymediakit;
DROP TABLE IF EXISTS categorymediakit;
DROP TABLE IF EXISTS suppliersmediakit;
DROP TABLE IF EXISTS usermediakit;

CREATE TABLE usermediakit (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    isVerified BOOLEAN,
    role ENUM('admin', 'client') NOT NULL DEFAULT 'client',
    PRIMARY KEY (id),
    UNIQUE KEY email (email)
);

CREATE TABLE categorymediakit (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    imagen VARCHAR(500),
    PRIMARY KEY (id),
    UNIQUE KEY nombre (nombre)
);

CREATE TABLE subcategorymediakit (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    categoria_id INT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY nombre (nombre),
    FOREIGN KEY (categoria_id) REFERENCES categorymediakit(id) ON DELETE CASCADE
);

CREATE TABLE suppliersmediakit (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    imagen VARCHAR(500),
    PRIMARY KEY (id),
    UNIQUE KEY nombre (nombre)
);

CREATE TABLE articlemediakit (
    id INT NOT NULL AUTO_INCREMENT,
    categoria_id INT NOT NULL,
    supplier_id INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    estado VARCHAR(255) NOT NULL,
    precio INT NOT NULL,
    discount INT NOT NULL DEFAULT 0,
    precioActual INT NOT NULL DEFAULT 0,
    offer BOOLEAN NOT NULL DEFAULT 0,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (categoria_id) REFERENCES categorymediakit(id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliersmediakit(id) ON DELETE CASCADE
);

CREATE TABLE article_images (
    id INT NOT NULL AUTO_INCREMENT,
    article_id INT NOT NULL,
    url VARCHAR(500) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (article_id) REFERENCES articlemediakit(id) ON DELETE CASCADE
);

CREATE TABLE favoritemediakit (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    articulo_id INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES usermediakit(id) ON DELETE CASCADE,
    FOREIGN KEY (articulo_id) REFERENCES articlemediakit(id) ON DELETE CASCADE
);

CREATE TABLE carmediakit (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    articulo_id INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES usermediakit(id) ON DELETE CASCADE,
    FOREIGN KEY (articulo_id) REFERENCES articlemediakit(id) ON DELETE CASCADE
);

CREATE TABLE cashmediakit (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    cash VARCHAR(500) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES usermediakit(id) ON DELETE CASCADE
);

CREATE TABLE buymediakit (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES usermediakit(id) ON DELETE CASCADE
);

CREATE TABLE detailbuymediakit (
    id INT NOT NULL AUTO_INCREMENT,
    buy_id INT NOT NULL,
    articulo_id INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (buy_id) REFERENCES buymediakit(id) ON DELETE CASCADE,
    FOREIGN KEY (articulo_id) REFERENCES articlemediakit(id) ON DELETE CASCADE
);

CREATE TABLE addressmediakit (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    calle VARCHAR(255) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    piso_puerta VARCHAR(50) NULL,
    codigo_postal VARCHAR(5) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    provincia VARCHAR(100) NOT NULL,
    comunidad_autonoma VARCHAR(100) NOT NULL,
    pais VARCHAR(50) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES usermediakit(id) ON DELETE CASCADE
);

CREATE TABLE commentmediakit (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    descripcion TEXT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES usermediakit(id) ON DELETE CASCADE
);

CREATE TABLE blogmediakit (
    id INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(50) NOT NULL, 
    descripcion TEXT NOT NULL,
    slug VARCHAR(50) NOT NULL, 
    categoria VARCHAR(50) NOT NULL, 
    contenido TEXT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE blog_images (
    id INT NOT NULL AUTO_INCREMENT,
    blog_id INT NOT NULL,
    url VARCHAR(500) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (blog_id) REFERENCES blogmediakit(id) ON DELETE CASCADE
);




