export abstract class RepositorioEmMemoria<T extends { id: number }> {
  protected registros: T[];
  private proximoId: number;

  constructor(registrosIniciais: T[] = []) {
    this.registros = [...registrosIniciais];
    const maiorId = this.registros.reduce(
      (maior, registro) => Math.max(maior, registro.id),
      0,
    );
    this.proximoId = maiorId + 1;
  }

  public async listar(): Promise<T[]> {
    return [...this.registros];
  }

  public async buscarPorId(id: number): Promise<T | undefined> {
    return this.registros.find((registro) => registro.id === id);
  }

  public async gerarProximoId(): Promise<number> {
    const id = this.proximoId;
    this.proximoId++;
    return id;
  }

  public async salvar(registro: T): Promise<T> {
    const indice = this.registros.findIndex((item) => item.id === registro.id);

    if (indice === -1) {
      this.registros.push(registro);
    } else {
      this.registros[indice] = registro;
    }

    return registro;
  }

  public async remover(id: number): Promise<boolean> {
    const quantidadeAntes = this.registros.length;
    this.registros = this.registros.filter((registro) => registro.id !== id);
    return this.registros.length < quantidadeAntes;
  }
}
