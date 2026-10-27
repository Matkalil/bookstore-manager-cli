export interface IAutor {
  id: number;
  nome: string;
  dataNascimento: Date;
  paisNascimento?: string;
}

export class Autor implements IAutor {
  public readonly id: number;
  public nome: string;
  public dataNascimento: Date;
  public paisNascimento?: string;

  constructor(
    id: number,
    nome: string,
    dataNascimento: Date,
    paisNascimento?: string,
  ) {
    this.id = id;
    this.nome = nome;
    this.dataNascimento = dataNascimento;
    this.paisNascimento = paisNascimento;
  }
}
