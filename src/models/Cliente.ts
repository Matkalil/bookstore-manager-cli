export interface ICliente {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
}

export class Cliente implements ICliente {
  public readonly id: number;
  public nome: string;
  public email: string;
  public cpf: string;
  public telefone: string;

  constructor(
    id: number,
    nome: string,
    email: string,
    cpf: string,
    telefone: string,
  ) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.cpf = cpf;
    this.telefone = telefone;
  }
}
