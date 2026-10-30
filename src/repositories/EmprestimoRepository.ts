import { Emprestimo } from '../models/Emprestimo';
import { RepositorioEmMemoria } from './RepositorioEmMemoria';

export class EmprestimoRepository extends RepositorioEmMemoria<Emprestimo> {}
