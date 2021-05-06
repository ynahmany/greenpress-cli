export enum ColorPalette {
  cyan = 36,
  yellow = 33,
  green = 32,
  red = 31
}
const logColor = (text: string | Buffer, color: ColorPalette) => `\x1b[${color}m${text}\x1b[0m`;

export const green = (text: string) => logColor(text, ColorPalette.green);
export const blue = (text: string) => logColor(text, ColorPalette.cyan);
export const yellow = (text: string) => logColor(text, ColorPalette.yellow);
export const red = (text: string | Buffer) => logColor(text, ColorPalette.red);
