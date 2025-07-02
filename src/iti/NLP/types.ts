export type DetectedIntent = {
  intent: string;
  entities?: string[] | Record<string, string>;
};
