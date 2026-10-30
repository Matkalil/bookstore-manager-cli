import { Emprestimo } from '../models/Emprestimo';
import { EmprestimoRepository } from '../repositories/EmprestimoRepository';
import { ClienteService } from './ClienteService';
import { LivroService } from './LivroService';

export interface EmprestimoDetalhado {
  emprestimo: Emprestimo;
  tituloLivro: string;
  nomeCliente: string;
}

export class EmprestimoService {
  private emprestimoRepository: EmprestimoRepository;
  private livroService: LivroService;
  private clienteService: ClienteService;

  constructor(
    emprestimoRepository: EmprestimoRepository,
    livroService: LivroService,
    clienteService: ClienteService,
  ) {
    this.emprestimoRepository = emprestimoRepository;
    this.livroService = livroService;
    this.clienteService = clienteService;
  }

  public async realizar(
    livroId: number,
    clienteId: number,
  ): Promise<Emprestimo> {
    await this.clienteService.buscarPorId(clienteId);
    await this.livroService.emprestarExemplar(livroId);

    const id = await this.emprestimoRepository.gerarProximoId();
    const emprestimo = new Emprestimo(id, livroId, clienteId, new Date(), null);
    return this.emprestimoRepository.salvar(emprestimo);
  }

  public async registrarDevolucao(id: number): Promise<Emprestimo> {
    const emprestimo = await this.buscarPorId(id);

    if (!emprestimo.estaAtivo()) {
      throw new Error(`O empréstimo com ID ${id} já foi devolvido.`);
    }

    await this.livroService.devolverExemplar(emprestimo.livroId);
    emprestimo.dataDevolucao = new Date();
    return this.emprestimoRepository.salvar(emprestimo);
  }

  public async buscarPorId(id: number): Promise<Emprestimo> {
    const emprestimo = await this.emprestimoRepository.buscarPorId(id);

    if (!emprestimo) {
      throw new Error(`Empréstimo com ID ${id} não encontrado.`);
    }

    return emprestimo;
  }

  public async listarDetalhado(): Promise<EmprestimoDetalhado[]> {
    const emprestimos = await this.emprestimoRepository.listar();
    return Promise.all(
      emprestimos.map((emprestimo) => this.detalhar(emprestimo)),
    );
  }

  public async buscarDetalhadoPorId(id: number): Promise<EmprestimoDetalhado> {
    const emprestimo = await this.buscarPorId(id);
    return this.detalhar(emprestimo);
  }

  private async detalhar(emprestimo: Emprestimo): Promise<EmprestimoDetalhado> {
    const livro = await this.livroService.buscarPorId(emprestimo.livroId);
    const cliente = await this.clienteService.buscarPorId(emprestimo.clienteId);

    return {
      emprestimo,
      tituloLivro: livro.titulo,
      nomeCliente: cliente.nome,
    };
  }
}
