import React, { useState, useRef, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { GlobalStyle } from './styles/GlobalStyle';
import { Desktop } from './components/Desktop';
import { BootScreen } from './components/BootScreen';

// Use local file to avoid CORs/403 issues from external URLs
// Using the public folder path directly which Vite serves at root
const MUSIC_URL = "/KieLoKaz - Reunion of the Spaceducks (Kielokaz ID 365).mp3";

function App() {
  const [booted, setBooted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Initialize audio but don't auto-play to avoid browser policies until user interaction
    audioRef.current = new Audio(MUSIC_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    
    // Handle potential load errors
    audioRef.current.addEventListener('error', (e) => {
        console.error("Audio load error:", e);
        // Fallback if local fails for some reason
        console.log("Audio source:", audioRef.current.src);
    });

    return () => {
        if(audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    };
  }, []);

  const toggleMusic = () => {
      if (!audioRef.current) return;

      if (isPlaying) {
          audioRef.current.pause();
      } else {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Audio play prevented by browser:", error);
                // If auto-play blocked, we update state to match reality
                setIsPlaying(false);
            });
          }
      }
      setIsPlaying(!isPlaying);
  };

  const handleBootComplete = () => {
      setBooted(true);
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
