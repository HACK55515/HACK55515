import React from 'react';
import { Play, Pause, MoreVertical, Clock } from 'lucide-react';
import { Track, PlayerState } from '../types/music';

interface TrackListProps {
  tracks: Track[];
  playerState: PlayerState;
  onTrackPlay: (track: Track) => void;
}

export const TrackList: React.FC<TrackListProps> = ({ tracks, playerState, onTrackPlay }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-6">
          <Play className="w-12 h-12 text-white ml-1" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No tracks uploaded yet</h3>
        <p className="text-gray-400 max-w-md">
          Upload your first track to start building your music library. Drag and drop files or use the upload button.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-800">
        <div className="col-span-1">#</div>
        <div className="col-span-6">Title</div>
        <div className="col-span-3">Artist</div>
        <div className="col-span-1 flex justify-center">
          <Clock className="w-4 h-4" />
        </div>
        <div className="col-span-1"></div>
      </div>

      {tracks.map((track, index) => {
        const isCurrentTrack = playerState.currentTrack?.id === track.id;
        const isPlaying = isCurrentTrack && playerState.isPlaying;

        return (
          <div
            key={track.id}
            className={`grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-all duration-200 group cursor-pointer ${
              isCurrentTrack ? 'bg-purple-500/10 border border-purple-500/20' : ''
            }`}
            onClick={() => onTrackPlay(track)}
          >
            <div className="col-span-1 flex items-center">
              <div className="w-8 h-8 flex items-center justify-center">
                {isCurrentTrack ? (
                  <button className="text-purple-400 hover:text-purple-300">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                ) : (
                  <span className="text-gray-400 group-hover:hidden text-sm">{index + 1}</span>
                )}
                {!isCurrentTrack && (
                  <button className="hidden group-hover:block text-white hover:text-purple-400">
                    <Play className="w-4 h-4 ml-0.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="col-span-6 flex items-center min-w-0">
              <div className="min-w-0">
                <p className={`font-medium truncate ${isCurrentTrack ? 'text-purple-400' : 'text-white'}`}>
                  {track.title}
                </p>
              </div>
            </div>

            <div className="col-span-3 flex items-center min-w-0">
              <p className="text-gray-400 truncate">{track.artist}</p>
            </div>

            <div className="col-span-1 flex items-center justify-center">
              <span className="text-gray-400 text-sm">{formatTime(track.duration)}</span>
            </div>

            <div className="col-span-1 flex items-center justify-center">
              <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all duration-200">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};