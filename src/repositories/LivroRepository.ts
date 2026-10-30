import { Livro } from '../models/Livro';
import { RepositorioEmMemoria } from './RepositorioEmMemoria';

export class LivroRepository extends RepositorioEmMemoria<Livro> {}
