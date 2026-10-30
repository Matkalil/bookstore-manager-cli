import { Cliente } from '../models/Cliente';
import { RepositorioEmMemoria } from './RepositorioEmMemoria';

export class ClienteRepository extends RepositorioEmMemoria<Cliente> {}
