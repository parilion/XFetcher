export function buildWindowLabel(hours: number): string {
  if (!Number.isFinite(hours) || hours <= 0) {
    throw new Error("hours must be a positive number");
  }

  return `最近 ${hours} 小时`;
}
