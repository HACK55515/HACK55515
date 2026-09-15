import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadModal } from './components/UploadModal';
import { TrackList } from './components/TrackList';
import { Player } from './components/Player';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { Track } from './types/music';

function App() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { audioRef, playerState, playTrack, pauseTrack, seekTo, setVolume } = useAudioPlayer();

  const handleUpload = (newTracks: Track[]) => {
    setTracks(prev => [...prev, ...newTracks]);
  };

  const handleTrackPlay = (track: Track) => {
    playTrack(track);
  };

  const handlePlayPause = () => {
    if (playerState.isPlaying) {
      pauseTrack();
    } else if (playerState.currentTrack) {
      playTrack(playerState.currentTrack);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white">
      <audio ref={audioRef} />
      
      <Header onUploadClick={() => setIsUploadOpen(true)} />
      
      <main className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Your Library</h2>
            <p className="text-gray-400">
              {tracks.length === 0 ? 'No tracks uploaded yet' : `${tracks.length} track${tracks.length !== 1 ? 's' : ''} available`}
            </p>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
            <TrackList
              tracks={tracks}
              playerState={playerState}
              onTrackPlay={handleTrackPlay}
            />
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0">
        <Player
          playerState={playerState}
          onPlayPause={handlePlayPause}
          onSeek={seekTo}
          onVolumeChange={setVolume}
        />
      </div>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}

export default App;