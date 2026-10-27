import { perguntarNumero } from '../utils/terminal';

export interface OpcaoMenu {
  descricao: string;
  acao: () => Promise<void>;
}

export async function executarMenu(
  titulo: string,
  opcoes: OpcaoMenu[],
  textoSair: string,
): Promise<void> {
  while (true) {
    console.log(`\n===== ${titulo} =====`);
    opcoes.forEach((opcao, indice) =>
      console.log(`${indice + 1}. ${opcao.descricao}`),
    );
    console.log(`0. ${textoSair}`);

    const escolha = await perguntarNumero('Escolha uma opção: ');

    if (escolha === 0) {
      return;
    }

    const opcaoEscolhida = opcoes[escolha - 1];

    if (!opcaoEscolhida) {
      console.log('[ERRO] Opção inválida.');
      continue;
    }

    await opcaoEscolhida.acao();
  }
}
