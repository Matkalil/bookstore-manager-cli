import { Autor } from '../models/Autor'; 
import { Livro } from '../models/Livro';
import { Cliente } from '../models/Cliente';
import { Emprestimo } from '../models/Emprestimo';

export const autoresSeed: Autor[] = [
  new Autor(1, 'Isaac Asimov', new Date('1920-01-02T00:00:00'), 'Rússia'),
  new Autor(2, 'Arthur C. Clarke', new Date('1917-12-16T00:00:00'), 'Reino Unido'),
  new Autor(3, 'Ursula K. Le Guin', new Date('1929-10-21T00:00:00'), 'Estados Unidos'),
  new Autor(4, 'Machado de Assis', new Date('1839-06-21T00:00:00'), 'Brasil'),
  new Autor(5, 'Clarice Lispector', new Date('1920-12-10T00:00:00'), 'Ucrânia'),
  new Autor(6, 'Gabriel G. Márquez', new Date('1927-03-06T00:00:00'), 'Colômbia'),
];

export const livrosSeed: Livro[] = [
  new Livro(1, 'Cavernas de Aço', '9780000000011', 3, 2, 1, 1954),
  new Livro(2, 'O Fim da Eternidade', '9780000000028', 2, 2, 1, 1955),
  new Livro(3, 'Eu, Robô', '9780000000035', 4, 4, 1, 1950),
  new Livro(4, 'O Fim da Infância', '9780000000042', 2, 2, 2, 1953),
  new Livro(5, '2001: Uma Odisseia no Espaço', '9780000000059', 3, 2, 2, 1968),
  new Livro(6, 'Memórias Póstumas de Brás Cubas', '9780000000066', 5, 5, 4, 1881),
  new Livro(7, 'O Alienista', '9780000000073', 2, 2, 4, 1882),
  new Livro(8, 'A Paixão Segundo G.H.', '9780000000080', 1, 0, 5, 1964),
  new Livro(9, 'Cem Anos de Solidão', '9780000000097', 3, 3, 6, 1967),
  new Livro(10, 'Em Agosto nos Vemos', '9780000000103', 2, 2, 6, 2024),
];

export const clientesSeed: Cliente[] = [
  new Cliente(1, 'Iracema Valadares', 'iracema.valadares@email.com', '10000000001', '(48) 99101-0001'),
  new Cliente(2, 'Teodoro Brancalhão', 'teodoro.brancalhao@email.com', '10000000002', '(48) 99101-0002'),
  new Cliente(3, 'Jandira Kowalski', 'jandira.kowalski@email.com', '10000000003', '(48) 99101-0003'),
  new Cliente(4, 'Otávio Scarpellini', 'otavio.scarpellini@email.com', '10000000004', '(48) 99101-0004'),
  new Cliente(5, 'Celeste Aranha Duarte', 'celeste.duarte@email.com', '10000000005', '(48) 99101-0005'),
  new Cliente(6, 'Benedito Quaresma', 'benedito.quaresma@email.com', '10000000006', '(48) 99101-0006'),
];

export const emprestimosSeed: Emprestimo[] = [
  new Emprestimo(1, 3, 2, new Date('2026-10-01T00:00:00'), new Date('2026-10-10T00:00:00')),
  new Emprestimo(2, 4, 3, new Date('2026-10-03T00:00:00'), new Date('2026-10-15T00:00:00')),
  new Emprestimo(3, 1, 1, new Date('2026-10-05T00:00:00'), null),
  new Emprestimo(4, 5, 1, new Date('2026-10-12T00:00:00'), null),
  new Emprestimo(5, 3, 3, new Date('2026-10-14T00:00:00'), new Date('2026-10-20T00:00:00')),
  new Emprestimo(6, 8, 4, new Date('2026-10-18T00:00:00'), null),
];