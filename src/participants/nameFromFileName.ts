/** "Роберт.png" → "Роберт": the photo's file name is its owner's name. */
export function nameFromFileName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, '').normalize('NFC').trim();
}
