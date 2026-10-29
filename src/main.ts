import {
  autoresSeed,
  livrosSeed,
  clientesSeed,
  emprestimosSeed,
} from './data/seed';
import { AutorRepository } from './repositories/AutorRepository';
import { LivroRepository } from './repositories/LivroRepository';
import { ClienteRepository } from './repositories/ClienteRepository';
import { EmprestimoRepository } from './repositories/EmprestimoRepository';
import { AutorService } from './services/AutorService';
import { LivroService } from './services/LivroService';
import { ClienteService } from './services/ClienteService';
import { AutorController } from './controllers/AutorController';
import { LivroController } from './controllers/LivroController';
import { ClienteController } from './controllers/ClienteController';
import { executarMenu } from './menus/executarMenu';
import { exibirMenuAutores } from './menus/menuAutores';
import { exibirMenuLivros } from './menus/menuLivros';
import { exibirMenuClientes } from './menus/menuClientes';
import { exibirErro, fecharTerminal } from './utils/terminal';

async function main(): Promise<void> {
  const autorRepository = new AutorRepository(autoresSeed);
  const livroRepository = new LivroRepository(livrosSeed);
  const clienteRepository = new ClienteRepository(clientesSeed);
  const emprestimoRepository = new EmprestimoRepository(emprestimosSeed);

  const autorService = new AutorService(autorRepository, livroRepository);
  const livroService = new LivroService(
    livroRepository,
    autorService,
    emprestimoRepository,
  );
  const clienteService = new ClienteService(
    clienteRepository,
    emprestimoRepository,
  );

  const autorController = new AutorController(autorService);
  const livroController = new LivroController(livroService);
  const clienteController = new ClienteController(clienteService);

  console.log('Bem-vindo ao BookStore Manager CLI!');

  await executarMenu(
    'MENU PRINCIPAL',
    [
      { descricao: 'Autores', acao: () => exibirMenuAutores(autorController) },
      { descricao: 'Livros', acao: () => exibirMenuLivros(livroController) },
      {
        descricao: 'Clientes',
        acao: () => exibirMenuClientes(clienteController),
      },
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
