import { Cliente } from '../models/Cliente';
import { ClienteRepository } from '../repositories/ClienteRepository';
import { EmprestimoRepository } from '../repositories/EmprestimoRepository';
import { cpfValido, emailValido, textoPreenchido } from '../utils/validacoes';

export class ClienteService {
  private clienteRepository: ClienteRepository;
  private emprestimoRepository: EmprestimoRepository;

  constructor(
    clienteRepository: ClienteRepository,
    emprestimoRepository: EmprestimoRepository,
  ) {
    this.clienteRepository = clienteRepository;
    this.emprestimoRepository = emprestimoRepository;
  }

  public async cadastrar(
    nome: string,
    email: string,
    cpf: string,
    telefone: string,
  ): Promise<Cliente> {
    await this.validarDados(nome, email, cpf, telefone);
    const id = await this.clienteRepository.gerarProximoId();
    const cliente = new Cliente(id, nome, email, cpf, telefone);
    return this.clienteRepository.salvar(cliente);
  }

  public async listar(): Promise<Cliente[]> {
    return this.clienteRepository.listar();
  }

  public async buscarPorId(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.buscarPorId(id);

    if (!cliente) {
      throw new Error(`Cliente com ID ${id} não encontrado.`);
    }

    return cliente;
  }

  public async atualizar(
    id: number,
    nome: string,
    email: string,
    cpf: string,
    telefone: string,
  ): Promise<Cliente> {
    const cliente = await this.buscarPorId(id);
    await this.validarDados(nome, email, cpf, telefone, id);

    cliente.nome = nome;
    cliente.email = email;
    cliente.cpf = cpf;
    cliente.telefone = telefone;

    return await this.clienteRepository.salvar(cliente);
  }

  public async remover(id: number): Promise<void> {
    await this.buscarPorId(id);

    const emprestimos = await this.emprestimoRepository.listar();
    const possuiEmprestimos = emprestimos.some(
      (emprestimo) => emprestimo.clienteId === id,
    );

    if (possuiEmprestimos) {
      throw new Error(
        'Não é possível remover o cliente: existem empréstimos registrados para ele.',
      );
    }

    await this.clienteRepository.remover(id);
  }

  private async validarDados(
    nome: string,
    email: string,
    cpf: string,
    telefone: string,
    idAtual?: number,
  ): Promise<void> {
    if (!textoPreenchido(nome)) {
      throw new Error('O nome do cliente é obrigatório.');
    }

    if (!emailValido(email)) {
      throw new Error('E-mail inválido.');
    }

    if (!cpfValido(cpf)) {
      throw new Error('CPF inválido. Informe 11 dígitos, sem ponto ou traço.');
    }

    if (!textoPreenchido(telefone)) {
      throw new Error('O telefone do cliente é obrigatório.');
    }

    await this.validarDuplicidade(email, cpf, idAtual);
  }

  private async validarDuplicidade(
    email: string,
    cpf: string,
    idAtual?: number,
  ): Promise<void> {
    const clientes = await this.clienteRepository.listar();
    const emailDuplicado = clientes.some(
      (cliente) => cliente.email === email && cliente.id !== idAtual,
    );
    const cpfDuplicado = clientes.some(
      (cliente) => cliente.cpf === cpf && cliente.id !== idAtual,
    );

    if (emailDuplicado) {
      throw new Error(`Já existe um cliente cadastrado com o e-mail ${email}.`);
    }

    if (cpfDuplicado) {
      throw new Error(`Já existe um cliente cadastrado com o CPF ${cpf}.`);
    }
  }
}
