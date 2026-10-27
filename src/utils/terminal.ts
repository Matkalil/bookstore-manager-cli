import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const leitor = readline.createInterface({ input, output });

export async function perguntar(mensagem: string): Promise<string> {
  const resposta = await leitor.question(mensagem);
  return resposta.trim();
}

export async function perguntarNumero(mensagem: string): Promise<number> {
  while (true) {
    const resposta = await perguntar(mensagem);
    const numero = Number(resposta);

    if (resposta !== "" && Number.isInteger(numero)) {
      return numero;
    }

    console.log("[ERRO] Digite um número inteiro válido.");
  }
}

export function fecharTerminal(): void {
  leitor.close();
}
