import { Autor } from '../models/Autor';
import { AutorService } from '../services/AutorService';
import { perguntar, perguntarNumero, exibirErro } from '../utils/terminal';
import { formatarData } from '../utils/datas';

export class AutorController {
  private autorService: AutorService;

  constructor(autorService: AutorService) {
    this.autorService = autorService;
  }

  public async cadastrar(): Promise<void> {
    try {
      const nome = await perguntar('Nome: ');
      const dataNascimentoTexto = await perguntar(
        'Data de nascimento (dd/mm/aaaa): ',
      );
      const paisNascimento = await perguntar('País de nascimento (opcional): ');

      const autor = await this.autorService.cadastrar(
        nome,
        dataNascimentoTexto,
        paisNascimento,
      );
      console.log(`[OK] Autor cadastrado com o ID ${autor.id}.`);
    } catch (erro) {
      exibirErro(erro);
    }
  }

  public async listar(): Promise<void> {
    try {
      const autores = await this.autorService.listar();

      if (autores.length === 0) {
        console.log('Nenhum autor cadastrado.');
        return;
      }

      autores.forEach((autor) => console.log(this.formatarAutor(autor)));
    } catch (erro) {
      exibirErro(erro);
    }
  }

  public async consultar(): Promise<void> {
    try {
      const id = await perguntarNumero('ID do autor: ');
      const autor = await this.autorService.buscarPorId(id);
      console.log(this.formatarAutor(autor));
    } catch (erro) {
      exibirErro(erro);
    }
  }

  public async atualizar(): Promise<void> {
    try {
      const id = await perguntarNumero('ID do autor: ');
      const nome = await perguntar('Novo nome: ');
      const dataNascimentoTexto = await perguntar(
        'Nova data de nascimento (dd/mm/aaaa): ',
      );
      const paisNascimento = await perguntar(
        'Novo país de nascimento (opcional): ',
      );

      const autor = await this.autorService.atualizar(
        id,
        nome,
        dataNascimentoTexto,
        paisNascimento,
      );
      console.log('[OK] Autor atualizado.');
      console.log(this.formatarAutor(autor));
    } catch (erro) {
      exibirErro(erro);
    }
  }

  public async rmeover(): Promise<void> {
    try {
      const id = await perguntarNumero('ID do autor: ');
      await this.autorService.remover(id);
      console.log('[OK] Autor removido.');
    } catch (erro) {
      exibirErro(erro);
    }
  }

  private formatarAutor(autor: Autor): string {
    const pais = autor.paisNascimento ?? 'não informado';
    return `#${autor.id} - ${autor.nome} | Nascimento: ${formatarData(autor.dataNascimento)} | País: ${pais}`;
  }
}
