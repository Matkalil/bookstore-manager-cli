import { autoresSeed } from './data/seed';
import { AutorRepository } from './repositories/AutorRepository';
import { AutorService } from './services/AutorService';
import { AutorController } from './controller/AutorController';
import { executarMenu } from './menus/executarMenu';
import { exibirMenuAutores } from './menus/menuAutores';
import { exibirErro, fecharTerminal } from './utils/terminal';

async function main(): Promise<void> {
  const autorRepository = new AutorRepository(autoresSeed);
  const autorService = new AutorService(autorRepository);
  const autorController = new AutorController(autorService);

  console.log('Bem-vindo ao BookStore Manager CLI!');

  await executarMenu(
    'MENU PRINCIPAL',
    [{ descricao: 'Autores', acao: () => exibirMenuAutores(autorController) }],
    'Encerrar aplicação',
  );

  console.log('Aplicação encerrada. Até logo!');
  fecharTerminal();
}

main().catch((erro) => {
  exibirErro(erro);
  fecharTerminal();
});