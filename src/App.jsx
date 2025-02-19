import React, { useState, useRef, useEffect } from 'react';

const App = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [tracks, setTracks] = useState([]);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);

  const audioRef = useRef(null);


  useEffect(() => {
    const availableTracks = [
      // { name: 'Werenoi - Skyrock Mauvaise', src: './music/werenoi_mauvaise_skyrock.mp3' },
      { name: 'Werenoi - Faf ', src: './music/Werenoi-Faf(Visualizer).mp3' },
      { name: 'Stony Stone - MILILI', src: './music/MILILI.mp3' },
      { name: 'Niro - qui sait', src: './music/Niro-quisait.mp3' },
    ];
    setTracks(availableTracks);
  }, []);

  const handleMouseEnter = () => setIsExpanded(true);
  const handleMouseLeave = () => setIsExpanded(false);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    setProgress((audio.currentTime / audio.duration) * 100 || 0);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const newTime = (e.nativeEvent.offsetX / e.target.clientWidth) * audio.duration;
    audio.currentTime = newTime;
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const playNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(false);
    setTimeout(() => {
      setIsPlaying(true);
      audioRef.current.play();
    }, 0);
  };

  const playPreviousTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(false);
    setTimeout(() => {
      setIsPlaying(true);
      audioRef.current.play();
    }, 0);
  };

  return (
    <div>
      <div
        className={`spotify-button ${isExpanded ? 'expanded' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {!isExpanded && (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg"
            alt="Spotify Logo"
            className="spotify-logo"
          />
        )}
        {isExpanded && (
          <div className="player-container">
            <h3 className="song-title">{tracks[currentTrackIndex]?.name || 'No Name'}</h3>

            {/* Progress Bar */}
            <div className="progress-container" onClick={handleSeek}>
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
              <div className="progress-handle" style={{ left: `${progress}%` }}></div>
            </div>
            <div className="time-info">
              <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
              <span>{formatTime(audioRef.current?.duration || 0)}</span>
            </div>

            {/* Controls */}
            <div className="controls">
              <button onClick={playPreviousTrack}>⏮</button>
              <button onClick={togglePlayPause}>
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button onClick={playNextTrack}>⏭</button>
            </div>


          </div>
        )}
      </div>


      {tracks[currentTrackIndex] && (
        <audio
          ref={audioRef}
          src={tracks[currentTrackIndex].src}
          onTimeUpdate={handleTimeUpdate}
          onEnded={playNextTrack}
        />
      )}
    </div>
  );
};

// Utility to format time
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

export default App;
