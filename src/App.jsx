import React, { useState, useRef, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { GlobalStyle } from './styles/GlobalStyle';
import { Desktop } from './components/Desktop';
import { BootScreen } from './components/BootScreen';
import { Taskbar } from './components/Taskbar'; // Import Taskbar here to pass music props if needed, but Desktop handles it usually.
// Actually Desktop renders Taskbar. We need to pass music state down.

// Simple Synthwave Loop (Placeholder URL - Replace with a real one)
const MUSIC_URL = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=synthwave-80s-110045.mp3"; 

function App() {
  const [booted, setBooted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(MUSIC_URL));

  useEffect(() => {
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
  }, []);

  const toggleMusic = () => {
      if (isPlaying) {
          audioRef.current.pause();
      } else {
          audioRef.current.play().catch(e => console.log("Audio play failed", e));
      }
      setIsPlaying(!isPlaying);
  };

  // Auto-play music on boot? Maybe better to let user choose or auto-play if interaction allowed.
  const handleBootComplete = () => {
      setBooted(true);
      // Optional: Try to play music on boot
      // audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {!booted ? (
        <BootScreen onComplete={handleBootComplete} />
      ) : (
        <Desktop 
            isMusicPlaying={isPlaying} 
            onToggleMusic={toggleMusic} 
        />
      )}
    </ThemeProvider>
  );
}

export default App;
