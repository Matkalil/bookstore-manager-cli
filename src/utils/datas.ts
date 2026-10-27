export function formatarData(data: Date): string {
  return data.toLocaleDateString("pt-BR");
}

export function converterTextoParaData(texto: string): Date | null {
  const partes = texto.split("/");

  if (partes.length !== 3) {
    return null;
  }

  const dia = Number(partes[0]);
  const mes = Number(partes[1]);
  const ano = Number(partes[2]);

  const data = new Date(ano, mes - 1, dia);

  const dataExiste =
    data.getDate() === dia &&
    data.getMonth() === mes - 1 &&
    data.getFullYear() === ano;

  if (!dataExiste) {
    return null;
  }

  return data;
}
