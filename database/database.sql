CREATE DATABASE IF NOT EXISTS sistema_produtos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sistema_produtos;

CREATE TABLE IF NOT EXISTS produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(80) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    quantidade INT NOT NULL DEFAULT 0
);

INSERT INTO produto (nome, categoria, preco, quantidade)
SELECT 'Teclado Mecânico', 'Periféricos', 249.90, 10
WHERE NOT EXISTS (SELECT 1 FROM produto WHERE nome = 'Teclado Mecânico');

INSERT INTO produto (nome, categoria, preco, quantidade)
SELECT 'Mouse Sem Fio', 'Periféricos', 89.90, 25
WHERE NOT EXISTS (SELECT 1 FROM produto WHERE nome = 'Mouse Sem Fio');
