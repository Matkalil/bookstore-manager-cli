export interface IEmprestimo {
  id: number;
  livroId: number;
  clienteId: number;
  dataEmprestimo: Date;
  dataDevolucao: Date | null;
}

export class Emprestimo implements IEmprestimo {
  public readonly id: number;
  public livroId: number;
  public clienteId: number;
  public dataEmprestimo: Date;
  public dataDevolucao: Date | null;

  constructor(
    id: number,
    livroId: number,
    clienteId: number,
    dataEmprestimo: Date,
    dataDevolucao: Date | null,
  ) {
    this.id = id;
    this.livroId = livroId;
    this.clienteId = clienteId;
    this.dataEmprestimo = dataEmprestimo;
    this.dataDevolucao = dataDevolucao;
  }
  public estaAtivo(): boolean {
    return this.dataDevolucao === null;
  }
}
