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

export interface PlayerStats {
  bannedCount: number;
  quota: number; // The target to reach
  rank: string;
}

export enum GameState {
  IDLE = 'IDLE',
  SPINNING = 'SPINNING',
  PROCESSING = 'PROCESSING', // Calling AI
  RESULT = 'RESULT',
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        setHeaderColor: (color: string) => void;
        HapticFeedback: {
          selectionChanged: () => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
        };
      };
    };
  }
}
