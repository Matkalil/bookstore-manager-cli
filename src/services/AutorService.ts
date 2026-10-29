import { Autor } from '../models/Autor';
import { AutorRepository } from '../repositories/AutorRepository';
import { textoPreenchido } from '../utils/validacoes';
import { converterTextoParaData } from '../utils/datas';
import { LivroRepository } from '../repositories/LivroRepository';

export class AutorService {
  private autorRepository: AutorRepository;
  private livroRepository: LivroRepository;

  constructor(
    autorRepository: AutorRepository,
    livroRepository: LivroRepository,
  ) {
    this.autorRepository = autorRepository;
    this.livroRepository = livroRepository;
  }

  public async cadastrar(
    nome: string,
    dataNascimentoTexto: string,
    paisNascimento: string,
  ): Promise<Autor> {
    const dataNascimento = this.validarDados(nome, dataNascimentoTexto);
    const id = await this.autorRepository.gerarProximoId();
    const autor = new Autor(
      id,
      nome,
      dataNascimento,
      paisNascimento || undefined,
    );
    return this.autorRepository.salvar(autor);
  }

  public async listar(): Promise<Autor[]> {
    return this.autorRepository.listar();
  }

  public async buscarPorId(id: number): Promise<Autor> {
    const autor = await this.autorRepository.buscarPorId(id);

    if (!autor) {
      throw new Error(`Autor com ID ${id} não encontrado.`);
    }

    return autor;
  }

  public async atualizar(
    id: number,
    nome: string,
    dataNascimentoTexto: string,
    paisNascimento: string,
  ): Promise<Autor> {
    const autor = await this.buscarPorId(id);
    const dataNascimento = this.validarDados(nome, dataNascimentoTexto);

    autor.nome = nome;
    autor.dataNascimento = dataNascimento;
    autor.paisNascimento = paisNascimento || undefined;

    return await this.autorRepository.salvar(autor);
  }

  public async remover(id: number): Promise<void> {
    await this.buscarPorId(id);

    const livros = await this.livroRepository.listar();
    const possuiLivros = livros.some((livro) => livro.autorId === id);

    if (possuiLivros) {
      throw new Error(
        'Não é possível remover o autor: existem livros cadastrados para ele.',
      );
    }

    await this.autorRepository.remover(id);
  }

  private validarDados(nome: string, dataNascimentoTexto: string): Date {
    if (!textoPreenchido(nome)) {
      throw new Error('O nome do autor é obrigatório.');
    }

    const dataNascimento = converterTextoParaData(dataNascimentoTexto);

    if (!dataNascimento) {
      throw new Error('Data de nascimento inválida. Use o formato dd/mm/aaaa.');
    }

    if (dataNascimento >= new Date()) {
      throw new Error('A data de nascimento deve ser anterior à data de hoje.');
    }

    return dataNascimento;
  }
}
