
export interface GenerationState {
  isGenerating: boolean;
  error: string | null;
  resultUrl: string | null;
  statusMessage: string;
}

export enum PixarStyle {
  CLASSIC = 'classic',
  MODERN = 'modern',
  CHIBI = 'chibi'
}
