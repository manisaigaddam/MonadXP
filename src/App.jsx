import React, { useState, useRef, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { GlobalStyle } from './styles/GlobalStyle';
import { Desktop } from './components/Desktop';
import { BootScreen } from './components/BootScreen';

// A new, direct-link Synthwave track from a reliable source (or self-hosted if this fails, but Pixabay direct links are usually okay for dev)
// Alternative: https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/KieLoKaz/Free_Ganymed/KieLoKaz_-_01_-_Reunion_of_the_Spaceducks.mp3
const MUSIC_URL = "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/KieLoKaz/Free_Ganymed/KieLoKaz_-_01_-_Reunion_of_the_Spaceducks.mp3";

function App() {
  const [booted, setBooted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(MUSIC_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    
    // Handle potential load errors
    audioRef.current.addEventListener('error', (e) => {
        console.error("Audio load error", e);
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
                console.log("Audio play prevented:", error);
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
