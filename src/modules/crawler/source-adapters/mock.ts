import type {
  FetchedPost,
  FetchOriginalPostsInput,
  SourceAdapter,
  SourceType,
} from "./base";

export class MockSourceAdapter implements SourceAdapter {
  sourceType: SourceType = "mock";

  async fetchOriginalPosts(
    input: FetchOriginalPostsInput,
  ): Promise<FetchedPost[]> {
    return [
      {
        externalPostId: `${input.accountHandle}-001`,
        originalText: `Latest update from ${input.accountHandle}`,
        originalLanguage: "en",
        postedAt: "2026-06-04T12:00:00.000Z",
        sourceType: this.sourceType,
        rawPayload: input,
      },
    ];
  }
}
