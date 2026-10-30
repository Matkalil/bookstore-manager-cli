import { LivroController } from '../controllers/LivroController';
import { executarMenu } from './executarMenu';

export async function exibirMenuLivros(
  livroController: LivroController,
): Promise<void> {
  await executarMenu(
    'LIVROS',
    [
      { descricao: 'Cadastrar livro', acao: () => livroController.cadastrar() },
      { descricao: 'Listar livros', acao: () => livroController.listar() },
      {
        descricao: 'Consultar livro por ID',
        acao: () => livroController.consultar(),
      },
      { descricao: 'Atualizar livro', acao: () => livroController.atualizar() },
      { descricao: 'Remover livro', acao: () => livroController.remover() },
    ],
    'Voltar ao menu principal',
  );
}
