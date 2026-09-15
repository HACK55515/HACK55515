export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  file: File;
  url: string;
  uploadedAt: Date;
}

export interface PlayerState {
  isPlaying: boolean;
  currentTrack: Track | null;
  currentTime: number;
  volume: number;
  isLoading: boolean;
}