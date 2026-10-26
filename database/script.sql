-- =============================================
-- BookStore Manager CLI - Script do banco de dados
-- =============================================

-- =============================================
-- 1. DDL - Criação da estrutura
-- =============================================
DROP TABLE IF EXISTS emprestimos;

DROP TABLE IF EXISTS livros;

DROP TABLE IF EXISTS clientes;

DROP TABLE IF EXISTS autores;

CREATE TABLE autores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    data_nascimento DATE NOT NULL
                CHECK (data_nascimento < CURRENT_DATE),
    pais_nascimento VARCHAR(80)
);

CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    cpf CHAR(11) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL
);

CREATE TABLE livros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    isbn VARCHAR(20) NOT NULL UNIQUE,
    ano_publicacao INTEGER
            CHECK (ano_publicacao > 0),
    quantidade_total INTEGER NOT NULL
            CHECK (quantidade_total >= 0),
    quantidade_disponivel INTEGER NOT NULL
            CHECK (quantidade_disponivel >= 0),
    autor_id INTEGER NOT NULL
            REFERENCES autores(id),
    CONSTRAINT chk_disponivel_ate_total CHECK (quantidade_disponivel <= quantidade_total)
);

CREATE TABLE emprestimos (
    id SERIAL PRIMARY KEY,
    livro_id INTEGER NOT NULL
            REFERENCES livros(id),
    cliente_id INTEGER NOT NULL
            REFERENCES clientes(id),
    data_emprestimo DATE NOT NULL DEFAULT CURRENT_DATE,
    data_devolucao  DATE NULL,
    CONSTRAINT chk_devolucao_apos_emprestimo CHECK (data_devolucao >= data_emprestimo)    
);

-- =============================================
-- 2. DML - Manipulação de dados
-- =============================================
INSERT INTO autores (nome, data_nascimento, pais_nascimento) VALUES
        ('Isaac Asimov', '1920-01-02', 'Rússia'),
        ('Arthur C. Clarke', '1917-12-16', 'Reino Unido'),
        ('Ursula K. Le Guin', '1929-10-21', 'Estados Unidos'),
        ('Machado de Assis', '1839-06-21', 'Brasil'),
        ('Clarice Lispector', '1920-12-10', 'Ucrânia'),
        ('Gabriel G. Márquez', '1927-03-06', 'Colômbia');

INSERT INTO clientes (nome, email, cpf, telefone) VALUES
        ('Iracema Valadares', 'iracema.valadares@email.com', '10000000001', '(48) 99101-0001'),
        ('Teodoro Brancalhão', 'teodoro.brancalhao@email.com', '10000000002', '(48) 99101-0002'),
        ('Jandira Kowalski', 'jandira.kowalski@email.com', '10000000003', '(48) 99101-0003'),
        ('Otávio Scarpellini', 'otavio.scarpellini@email.com', '10000000004', '(48) 99101-0004'),
        ('Celeste Aranha Duarte', 'celeste.duarte@email.com', '10000000005', '(48) 99101-0005'),
        ('Benedito Quaresma', 'benedito.quaresma@email.com', '10000000006', '(48) 99101-0006');

INSERT INTO livros (titulo, isbn, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id) VALUES
        ('Cavernas de Aço', '9780000000011', 1954, 3, 2, 1),
        ('O Fim da Eternidade', '9780000000028', 1955, 2, 2, 1),
        ('Eu, Robô', '9780000000035', 1950, 4, 4, 1),
        ('O Fim da Infância', '9780000000042', 1953, 2, 2, 2),
        ('2001: Uma Odisseia no Espaço', '9780000000059', 1968, 3, 2, 2),
        ('Memórias Póstumas de Brás Cubas', '9780000000066', 1881, 5, 5, 4),
        ('O Alienista', '9780000000073', 1882, 2, 2, 4),
        ('A Paixão Segundo G.H.', '9780000000080', 1964, 1, 0, 5),
        ('Cem Anos de Solidão', '9780000000097', 1967, 3, 3, 6),
        ('Em Agosto nos Vemos', '9780000000103', 2024, 2, 2, 6);

INSERT INTO emprestimos (livro_id, cliente_id, data_emprestimo, data_devolucao) VALUES
        (3, 2, '2026-10-01', '2026-10-10'),
        (4, 3, '2026-10-03', '2026-10-15'),
        (1, 1, '2026-10-05', NULL),
        (5, 1, '2026-10-12', NULL),
        (3, 3, '2026-10-14', '2026-10-20'),
        (8, 4, '2026-10-18', NULL);

--Exemplo UPDATE: Atualiza telefone da cliente Celeste
UPDATE clientes SET telefone = '(48) 99101-0007' WHERE id = 3;
--Exemplo DELETE: Deleta cliente Benedito. Cliente sem empréstimos, não interrompe script
DELETE FROM clientes WHERE id = 6;

-- =============================================
-- 3. Relatórios
-- =============================================
--Relatório 1: livros disponíveis
SELECT livros.titulo AS titulo, autores.nome AS autor, livros.quantidade_disponivel AS livros_disponiveis
FROM livros
INNER JOIN autores ON livros.autor_id = autores.id
WHERE livros.quantidade_disponivel > 0
ORDER BY titulo DESC;

--Relatório 2: livros emprestados
SELECT livros.titulo AS titulo, clientes.nome AS cliente, emprestimos.data_emprestimo AS data_emprestimo
FROM emprestimos
INNER JOIN livros ON emprestimos.livro_id = livros.id
INNER JOIN clientes ON emprestimos.cliente_id = clientes.id
WHERE emprestimos.data_devolucao IS NULL
ORDER BY emprestimos.data_emprestimo ASC;

--Relatório 3: livros cadastrados por autor
SELECT autores.nome AS autor, COUNT(livros.id) AS total_livros
FROM autores
LEFT JOIN livros ON livros.autor_id = autores.id
GROUP BY autores.id, autores.nome
ORDER BY total_livros DESC, autores.nome ASC; 

--Relatório 4: quantidade de empréstimos por livro
SELECT livros.titulo AS titulo, COUNT(emprestimos.id) AS total_emprestimos
FROM livros
LEFT JOIN emprestimos ON emprestimos.livro_id = livros.id
GROUP BY livros.id, livros.titulo
ORDER BY total_emprestimos DESC, livros.titulo ASC
LIMIT 5;

--Relatório 5: clientes com empréstimos ativos
SELECT clientes.nome AS cliente, COUNT(emprestimos.id) AS emprestimos_ativos
FROM clientes
INNER JOIN emprestimos ON emprestimos.cliente_id = clientes.id
WHERE emprestimos.data_devolucao IS NULL
GROUP BY clientes.id, clientes.nome
ORDER BY emprestimos_ativos DESC, clientes.nome ASC;