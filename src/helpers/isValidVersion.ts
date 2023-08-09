/* eslint-disable no-plusplus */
export function isValidVersion(version: string): boolean {
  const regex = /^\d+(\.\d+)*$/; // Expressão regular para validar o formato da versão
  if (!version) {
    return false; // Verifica se a versão é uma string não vazia
  }
  const trimVersion = version.trim(); // Remove espaços em branco antes e depois da string
  if (!regex.test(trimVersion)) {
    return false; // Verifica se a string segue o padrão de formato de versão
  }
  const versionArr = trimVersion.split('.'); // Separa a string em um array de números
  // Verifica se cada número é inteiro e se há mais de um ponto seguido
  for (let i = 0; i < versionArr.length; i++) {
    const num = parseInt(versionArr[i], 10);
    if (Number.isNaN(num) || !Number.isInteger(num)) {
      return false;
    }
    if (versionArr[i].startsWith('0') && versionArr[i] !== '0') {
      return false; // Verifica se não há zeros à esquerda
    }
    if (versionArr[i].endsWith('.') || versionArr[i].includes('..')) {
      return false; // Verifica se não há mais de um ponto seguido
    }
  }
  return true;
}
