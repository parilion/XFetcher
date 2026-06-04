export type FetchOriginalPostsInput = {
  accountHandle: string;
  proxyUrl?: string;
};

export type FetchedPost = {
  externalPostId: string;
  originalText: string;
  originalLanguage: string;
  postedAt: string;
  sourceType: string;
  rawPayload: Record<string, unknown>;
};

export interface SourceAdapter {
  sourceType: string;
  fetchOriginalPosts(input: FetchOriginalPostsInput): Promise<FetchedPost[]>;
}
