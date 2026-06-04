export type AccountGroupInput = {
  name: string;
  description: string;
  defaultFetchInterval: number;
};

export type SourceAccountInput = {
  xHandle: string;
  displayName: string;
  groupId: string;
  enabled: boolean;
};
