import { ClienteController } from '../controllers/ClienteController';
import { executarMenu } from './executarMenu';

export async function exibirMenuClientes(
  clienteController: ClienteController,
): Promise<void> {
  await executarMenu(
    'CLIENTES',
    [
      {
        descricao: 'Cadastrar cliente',
        acao: () => clienteController.cadastrar(),
      },
      { descricao: 'Listar clientes', acao: () => clienteController.listar() },
      {
        descricao: 'Consultar cliente por ID',
        acao: () => clienteController.consultar(),
      },
      {
        descricao: 'Atualizar cliente',
        acao: () => clienteController.atualizar(),
      },
      { descricao: 'Remover cliente', acao: () => clienteController.remover() },
    ],
    'Voltar ao menu principal',
  );
}
