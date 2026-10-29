import { Livro } from '../models/Livro';
import { LivroRepository } from '../repositories/LivroRepository';
import {
  anoValido,
  quantidadeValida,
  textoPreenchido,
} from '../utils/validacoes';
import { AutorService } from './AutorService';

export class LivroService {
  private livroRepository: LivroRepository;
  private autorService: AutorService;

  constructor(livroRepository: LivroRepository, autorService: AutorService) {
    this.livroRepository = livroRepository;
    this.autorService = autorService;
  }

  public async cadastrar(
    titulo: string,
    isbn: string,
    anoPublicacaoTexto: string,
    quantidadeTotal: number,
    autorId: number,
  ): Promise<Livro> {
    const anoPublicacao = await this.validarDados(
      titulo,
      isbn,
      anoPublicacaoTexto,
      quantidadeTotal,
      autorId,
    );
    const id = await this.livroRepository.gerarProximoId();
    const livro = new Livro(
      id,
      titulo,
      isbn,
      quantidadeTotal,
      quantidadeTotal,
      autorId,
      anoPublicacao,
    );
    return this.livroRepository.salvar(livro);
  }

  public async listar(): Promise<Livro[]> {
    return this.livroRepository.listar();
  }

  public async buscarPorId(id: number): Promise<Livro> {
    const livro = await this.livroRepository.buscarPorId(id);

    if (!livro) {
      throw new Error(`Livro com ID ${id} não encontrado.`);
    }

    return livro;
  }

  public async atualizar(
    id: number,
    titulo: string,
    isbn: string,
    anoPublicacaoTexto: string,
    quantidadeTotal: number,
    autorId: number,
  ): Promise<Livro> {
    const livro = await this.buscarPorId(id);
    const anoPublicacao = await this.validarDados(
      titulo,
      isbn,
      anoPublicacaoTexto,
      quantidadeTotal,
      autorId,
      id,
    );

    const quantidadeEmprestada =
      livro.quantidadeTotal - livro.quantidadeDisponivel;

    if (quantidadeTotal < quantidadeEmprestada) {
      throw new Error(
        `A quantidade total não pode ser menor que ${quantidadeEmprestada}, o número de exemplares emprestados.`,
      );
    }

    livro.titulo = titulo;
    livro.isbn = isbn;
    livro.anoPublicacao = anoPublicacao;
    livro.quantidadeTotal = quantidadeTotal;
    livro.quantidadeDisponivel = quantidadeTotal - quantidadeEmprestada;
    livro.autorId = autorId;

    return this.livroRepository.salvar(livro);
  }

  public async remover(id: number): Promise<void> {
    await this.buscarPorId(id);
    await this.livroRepository.remover(id);
  }

  private async validarDados(
    titulo: string,
    isbn: string,
    anoPublicacaoTexto: string,
    quantidadeTotal: number,
    autorId: number,
    idAtual?: number,
  ): Promise<number | undefined> {
    if (!textoPreenchido(titulo)) {
      throw new Error('O título do livro é obrigatório.');
    }

    if (!textoPreenchido(isbn)) {
      throw new Error('O ISBN do livro é obrigatório.');
    }

    await this.validarIsbnUnico(isbn, idAtual);

    if (!quantidadeValida(quantidadeTotal)) {
      throw new Error(
        'A quantidade total deve ser um número inteiro maior ou igual a zero.',
      );
    }

    await this.autorService.buscarPorId(autorId);

    return this.converterAno(anoPublicacaoTexto);
  }

  private async validarIsbnUnico(
    isbn: string,
    idAtual?: number,
  ): Promise<void> {
    const livros = await this.livroRepository.listar();
    const isbnDuplicado = livros.some(
      (livro) => livro.isbn === isbn && livro.id !== idAtual,
    );

    if (isbnDuplicado) {
      throw new Error(`Já existe um livro cadastrado com o ISBN ${isbn}.`);
    }
  }

  private converterAno(anoPublicacaoTexto: string): number | undefined {
    if (!textoPreenchido(anoPublicacaoTexto)) {
      return undefined;
    }

    const anoPublicacao = Number(anoPublicacaoTexto);

    if (!anoValido(anoPublicacao)) {
      throw new Error(
        'Ano de publicação inválido. Informe um ano até o ano atual.',
      );
    }

    return anoPublicacao;
  }
}
