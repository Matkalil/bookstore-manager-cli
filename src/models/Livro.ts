export interface ILivro {
  id: number;
  titulo: string;
  isbn: string;
  quantidadeTotal: number;
  quantidadeDisponivel: number;
  autorId: number;
  anoPublicacao?: number;
}

export class Livro implements ILivro {
  public readonly id: number;
  public titulo: string;
  public isbn: string;
  public quantidadeTotal: number;
  public quantidadeDisponivel: number;
  public autorId: number;
  public anoPublicacao?: number;

  constructor(
    id: number,
    titulo: string,
    isbn: string,
    quantidadeTotal: number,
    quantidadeDisponivel: number,
    autorId: number,
    anoPublicacao?: number,
  ) {
    this.id = id;
    this.titulo = titulo;
    this.isbn = isbn;
    this.quantidadeTotal = quantidadeTotal;
    this.quantidadeDisponivel = quantidadeDisponivel;
    this.autorId = autorId;
    this.anoPublicacao = anoPublicacao;
  }
  public estaDisponivel(): boolean {
    return this.quantidadeDisponivel > 0;
  }
}
