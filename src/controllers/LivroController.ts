import { Livro } from '../models/Livro';
import { LivroService } from '../services/LivroService';
import { perguntar, perguntarNumero, exibirErro } from '../utils/terminal';

export class LivroController {
  private livroService: LivroService;

  constructor(livroService: LivroService) {
    this.livroService = livroService;
  }

  public async cadastrar(): Promise<void> {
    try {
      const titulo = await perguntar('Título: ');
      const isbn = await perguntar('ISBN: ');
      const anoPublicacaoTexto = await perguntar('Ano de publicação (opcional): ');
      const quantidadeTotal = await perguntarNumero(
        'Quantidade de exemplares: ',
      );
      const autorId = await perguntarNumero('ID do autor: ');

      const livro = await this.livroService.cadastrar(
        titulo,
        isbn,
        anoPublicacaoTexto,
        quantidadeTotal,
        autorId,
      );

      console.log(`[OK] Livro cadastrado com o ID ${livro.id}.`);
    } catch (erro) {
      exibirErro(erro);
    }
  }

  public async listar(): Promise<void> {
    try {
      const livros = await this.livroService.listar();

      if (livros.length === 0) {
        console.log('Nenhum livro cadastrado.');
        return;
      }

      livros.forEach((livro) => console.log(this.formatarLivro(livro)));
    } catch (erro) {
      exibirErro(erro);
    }
  }

  public async consultar(): Promise<void> {
    try {
      const id = await perguntarNumero('ID do livro: ');
      const livro = await this.livroService.buscarPorId(id);
      console.log(this.formatarLivro(livro));
    } catch (erro) {
      exibirErro(erro);
    }
  }

  public async atualizar(): Promise<void> {
    try {
      const id = await perguntarNumero('ID do livro: ');
      const titulo = await perguntar('Novo título: ');
      const isbn = await perguntar('Novo ISBN: ');
      const anoPublicacaoTexto = await perguntar(
        'Novo ano de publicação (opcional): ',
      );
      const quantidadeTotal = await perguntarNumero(
        'Nova quantidade de exemplares: ',
      );
      const autorId = await perguntarNumero('Novo ID do autor: ');

      const livro = await this.livroService.atualizar(
        id,
        titulo,
        isbn,
        anoPublicacaoTexto,
        quantidadeTotal,
        autorId,
      );
      console.log('[OK] Livro atualizado.');
      console.log(this.formatarLivro(livro));
    } catch (erro) {
      exibirErro(erro);
    }
  }

  public async remover(): Promise<void> {
    try {
      const id = await perguntarNumero('ID do livro: ');
      await this.livroService.remover(id);
      console.log('[OK] Livro removido.');
    } catch (erro) {
      exibirErro(erro);
    }
  }

  private formatarLivro(livro: Livro): string {
    const ano = livro.anoPublicacao ?? 'não informado';
    return `#${livro.id} - ${livro.titulo} | ISBN: ${livro.isbn} | Ano: ${ano} | Disponíveis: ${livro.quantidadeDisponivel}/${livro.quantidadeTotal} | Autor ID: ${livro.autorId}`;
  }
}
