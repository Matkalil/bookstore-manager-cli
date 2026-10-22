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

-- =============================================
-- 3. Relatórios
-- =============================================