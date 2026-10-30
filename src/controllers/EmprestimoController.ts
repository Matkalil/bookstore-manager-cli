import {
  EmprestimoService,
  EmprestimoDetalhado,
} from '../services/EmprestimoService';
import { perguntarNumero, exibirErro } from '../utils/terminal';
import { formatarData } from '../utils/datas';

export class EmprestimoController {
  private emprestimoService: EmprestimoService;

  constructor(emprestimoService: EmprestimoService) {
    this.emprestimoService = emprestimoService;
  }

  public async realizar(): Promise<void> {
    try {
      const livroId = await perguntarNumero('ID do livro: ');
      const clienteId = await perguntarNumero('ID do cliente: ');

      const emprestimo = await this.emprestimoService.realizar(
        livroId,
        clienteId,
      );
      console.log(`[OK] Empréstimo registrado com o ID ${emprestimo.id}.`);
    } catch (erro) {
      exibirErro(erro);
    }
  }

  public async registrarDevolucao(): Promise<void> {
    try {
      const id = await perguntarNumero('ID do empréstimo: ');

      const emprestimo = await this.emprestimoService.registrarDevolucao(id);
      console.log(`[OK] Devolução do empréstimo ${emprestimo.id} registrada.`);
    } catch (erro) {
      exibirErro(erro);
    }
  }

  public async listar(): Promise<void> {
    try {
      const emprestimos = await this.emprestimoService.listarDetalhado();

      if (emprestimos.length === 0) {
        console.log('Nenhum empréstimo registrado.');
        return;
      }

      emprestimos.forEach((detalhe) =>
        console.log(this.formatarEmprestimo(detalhe)),
      );
    } catch (erro) {
      exibirErro(erro);
    }
  }

  public async consultar(): Promise<void> {
    try {
      const id = await perguntarNumero('ID do empréstimo: ');
      const detalhe = await this.emprestimoService.buscarDetalhadoPorId(id);
      console.log(this.formatarEmprestimo(detalhe));
    } catch (erro) {
      exibirErro(erro);
    }
  }

  private formatarEmprestimo(detalhe: EmprestimoDetalhado): string {
    const devolucao = detalhe.emprestimo.dataDevolucao
      ? formatarData(detalhe.emprestimo.dataDevolucao)
      : 'pendente';

    return `#${detalhe.emprestimo.id} - ${detalhe.tituloLivro} | Cliente: ${detalhe.nomeCliente} | Empréstimo: ${formatarData(detalhe.emprestimo.dataEmprestimo)} | Devolução: ${devolucao}`;
  }
}
