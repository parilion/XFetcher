export function shouldTranslate(language: string): boolean {
  return language.toLowerCase() !== "zh";
}
