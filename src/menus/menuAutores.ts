import { AutorController } from "../controller/AutorController";
import { executarMenu } from './executarMenu';

export async function exibirMenuAutores(autorController: AutorController): Promise<void> {
  await executarMenu(
    'AUTORES',
    [
      { descricao: 'Cadastrar autor', acao: () => autorController.cadastrar() },
      { descricao: 'Listar autores', acao: () => autorController.listar() },
      { descricao: 'Consultar autor por ID', acao: () => autorController.consultar() },
      { descricao: 'Atualizar autor', acao: () => autorController.atualizar() },
      { descricao: 'Remover autor', acao: () => autorController.remover() },
    ],
    'Voltar ao menu principal',
  );
}