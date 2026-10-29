import { Livro } from '../models/Livro';
import { LivroRepository } from '../repositories/LivroRepository';
import { EmprestimoRepository } from '../repositories/EmprestimoRepository';
import {
  anoValido,
  quantidadeValida,
  textoPreenchido,
} from '../utils/validacoes';
import { AutorService } from './AutorService';

export class LivroService {
  private livroRepository: LivroRepository;
  private autorService: AutorService;
  private emprestimoRepository: EmprestimoRepository;

  constructor(
    livroRepository: LivroRepository,
    autorService: AutorService,
    emprestimoRepository: EmprestimoRepository,
  ) {
    this.livroRepository = livroRepository;
    this.autorService = autorService;
    this.emprestimoRepository = emprestimoRepository;
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

    const emprestimos = await this.emprestimoRepository.listar();
    const possuiEmprestimos = emprestimos.some(
      (emprestimo) => emprestimo.livroId === id,
    );

    if (possuiEmprestimos) {
      throw new Error(
        'Não é possível remover o livro: existem empréstimos registrados para ele.',
      );
    }

    await this.livroRepository.remover(id);
  }

  public async emprestarExemplar(livroId: number): Promise<void> {
    const livro = await this.buscarPorId(livroId);

    if (!livro.estaDisponivel()) {
      throw new Error(
        `O livro ${livro.titulo} não possui exemplar disponível.`,
      );
    }

    livro.quantidadeDisponivel--;
    await this.livroRepository.salvar(livro);
  }

  public async devolverExemplar(livroId: number): Promise<void> {
    const livro = await this.buscarPorId(livroId);

    livro.quantidadeDisponivel++;
    await this.livroRepository.salvar(livro);
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

    if (!quantidadeValida(quantidadeTotal) || quantidadeTotal < 1) {
      throw new Error(
        'A quantidade total deve ser um número inteiro maior que zero.',
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
