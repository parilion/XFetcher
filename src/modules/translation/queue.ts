export type TranslationJob = {
  rawPostId: string;
};

export function buildTranslationJob(rawPostId: string): TranslationJob {
  if (rawPostId.trim() === "") {
    throw new Error("rawPostId is required");
  }

  return { rawPostId };
}
