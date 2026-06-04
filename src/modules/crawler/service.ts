export function countInsertedPosts(results: boolean[]): number {
  return results.filter(Boolean).length;
}
