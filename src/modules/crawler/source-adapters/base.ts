export type FetchOriginalPostsInput = {
  accountHandle: string;
  proxyUrl?: string;
};

export type FetchedPost = {
  externalPostId: string;
  originalText: string;
  originalLanguage: string;
  // ISO 8601 timestamp string from the upstream source.
  postedAt: string;
  sourceType: SourceType;
  rawPayload: Record<string, unknown>;
};

export type SourceType = "mock";

export interface SourceAdapter {
  sourceType: SourceType;
  fetchOriginalPosts(input: FetchOriginalPostsInput): Promise<FetchedPost[]>;
}
