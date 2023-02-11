export function centerString(string: string, length: number): string {
  return string.padStart((string.length + length) / 2).padEnd(length);
}
