export function textoPreenchido(texto: string): boolean {
  return texto.trim().length > 0;
}

export function emailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function cpfValido(cpf: string): boolean {
  return /^\d{11}$/.test(cpf);
}

export function quantidadeValida(quantidade: number): boolean {
  return Number.isInteger(quantidade) && quantidade >= 0;
}

export function anoValido(ano: number): boolean {
  const anoAtual = new Date().getFullYear();
  return Number.isInteger(ano) && ano > 0 && ano <= anoAtual;
}
