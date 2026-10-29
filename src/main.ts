import { autoresSeed, livrosSeed } from './data/seed';
import { AutorRepository } from './repositories/AutorRepository';
import { LivroRepository } from './repositories/LivroRepository';
import { AutorService } from './services/AutorService';
import { LivroService } from './services/LivroService';
import { AutorController } from './controllers/AutorController';
import { LivroController } from './controllers/LivroController';
import { executarMenu } from './menus/executarMenu';
import { exibirMenuAutores } from './menus/menuAutores';
import { exibirMenuLivros } from './menus/menuLivros';
import { exibirErro, fecharTerminal } from './utils/terminal';

async function main(): Promise<void> {
  const autorRepository = new AutorRepository(autoresSeed);
  const livroRepository = new LivroRepository(livrosSeed);

  const autorService = new AutorService(autorRepository, livroRepository);
  const livroService = new LivroService(livroRepository, autorService);

  const autorController = new AutorController(autorService);
  const livroController = new LivroController(livroService);

  console.log('Bem-vindo ao BookStore Manager CLI!');

  await executarMenu(
    'MENU PRINCIPAL',
    [
      { descricao: 'Autores', acao: () => exibirMenuAutores(autorController) },
      { descricao: 'Livros', acao: () => exibirMenuLivros(livroController) },
    ],
    'Encerrar aplicação',
  );

  console.log('Aplicação encerrada. Até logo!');
  fecharTerminal();
}

main().catch((erro) => {
  exibirErro(erro);
  fecharTerminal();
});
