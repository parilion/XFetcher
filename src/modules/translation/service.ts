export function shouldTranslate(language: string): boolean {
  const normalizedLanguage = language.trim().toLowerCase();
  return normalizedLanguage !== "zh" && !normalizedLanguage.startsWith("zh-");
}
