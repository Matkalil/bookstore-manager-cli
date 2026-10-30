import { EmprestimoController } from '../controllers/EmprestimoController';
import { executarMenu } from './executarMenu';

export async function exibirMenuEmprestimos(
  emprestimoController: EmprestimoController,
): Promise<void> {
  await executarMenu(
    'EMPRÉSTIMOS',
    [
      {
        descricao: 'Realizar empréstimo',
        acao: () => emprestimoController.realizar(),
      },
      {
        descricao: 'Registrar devolução',
        acao: () => emprestimoController.registrarDevolucao(),
      },
      {
        descricao: 'Listar empréstimos',
        acao: () => emprestimoController.listar(),
      },
      {
        descricao: 'Consultar empréstimo por ID',
        acao: () => emprestimoController.consultar(),
      },
    ],
    'Voltar ao menu principal',
  );
}
