export interface BanTarget {
  id: string;
  name: string;
  icon: string;
}

export interface BanDecree {
  id: string;
  targetName: string;
  targetIcon: string;
  reason: string;
  article: string; // The fake law article
  timestamp: number;
}

export interface GeminiBanResponse {
  reason: string;
  article: string;
}

export enum GameState {
  IDLE = 'IDLE',
  SPINNING = 'SPINNING',
  PROCESSING = 'PROCESSING', // Calling AI
  RESULT = 'RESULT',
}
