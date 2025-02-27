DROP TABLE usermediakit;
DROP TABLE categorymediakit;
DROP TABLE articlemediakit;
DROP TABLE favoritemediakit;

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

CREATE TABLE articlemediakit (
    id INT NOT NULL AUTO_INCREMENT,
    categoria_id INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(255) NOT NULL,
    precio INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (categoria_id) REFERENCES categorymediakit(id) ON DELETE CASCADE
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
