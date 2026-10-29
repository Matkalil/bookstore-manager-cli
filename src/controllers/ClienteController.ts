import { Cliente } from '../models/Cliente';
import { ClienteService } from '../services/ClienteService';
import { perguntar, perguntarNumero, exibirErro } from '../utils/terminal';

export class ClienteController {
  private clienteService: ClienteService;

  constructor(clienteService: ClienteService) {
    this.clienteService = clienteService;
  }

  public async cadastrar(): Promise<void> {
    try {
      const nome = await perguntar('Nome: ');
      const email = await perguntar('E-mail: ');
      const cpf = await perguntar('CPF (somente números): ');
      const telefone = await perguntar('Telefone (ex: (48) 9999-9999): ');

      const cliente = await this.clienteService.cadastrar(
        nome,
        email,
        cpf,
        telefone,
      );
      console.log(`[OK] Cliente cadastrado com o ID ${cliente.id}.`);
    } catch (erro) {
      exibirErro(erro);
    }
  }

  public async listar(): Promise<void> {
    try {
      const clientes = await this.clienteService.listar();

      if (clientes.length === 0) {
        console.log('Nenhum cliente cadastrado.');
        return;
      }

      clientes.forEach((cliente) => console.log(this.formatarCliente(cliente)));
    } catch (erro) {
      exibirErro(erro);
    }
  }

  public async consultar(): Promise<void> {
    try {
      const id = await perguntarNumero('ID do cliente: ');
      const cliente = await this.clienteService.buscarPorId(id);
      console.log(this.formatarCliente(cliente));
    } catch (erro) {
      exibirErro(erro);
    }
  }

  public async atualizar(): Promise<void> {
    try {
      const id = await perguntarNumero('ID do cliente: ');
      const nome = await perguntar('Novo nome: ');
      const email = await perguntar('Novo e-mail: ');
      const cpf = await perguntar('Novo CPF: ');
      const telefone = await perguntar(
        'Novo telefone (exemplo: (48) 9999-9999): ',
      );

      const cliente = await this.clienteService.atualizar(
        id,
        nome,
        email,
        cpf,
        telefone,
      );
      console.log('[OK] Cliente atualizado.');
      console.log(this.formatarCliente(cliente));
    } catch (erro) {
      exibirErro(erro);
    }
  }

  public async remover(): Promise<void> {
    try {
      const id = await perguntarNumero('ID do cliente: ');
      await this.clienteService.remover(id);
      console.log('[OK] Cliente removido.');
    } catch (erro) {
      exibirErro(erro);
    }
  }

  private formatarCliente(cliente: Cliente): string {
    return `#${cliente.id} - ${cliente.nome} | E-mail: ${cliente.email} | CPF: ${cliente.cpf} | Telefone: ${cliente.telefone}`;
  }
}
