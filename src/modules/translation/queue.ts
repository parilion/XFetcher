export type TranslationJob = {
  rawPostId: string;
};

export function buildTranslationJob(rawPostId: string): TranslationJob {
  return { rawPostId };
}
