import React, { useEffect, useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  color: #A796FF;
  font-family: 'VT323', monospace;
  font-size: 18px;
  padding: 40px;
  z-index: ${props => props.theme.zIndices.boot};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  cursor: none; /* Hide mouse during boot */
`;

const LogoAscii = styled.pre`
  color: #836EF9;
  font-size: 12px;
  line-height: 10px;
  margin-bottom: 30px;
  text-shadow: 0 0 5px #836EF9;
`;

const Line = styled.div`
  margin-bottom: 5px;
  white-space: pre-wrap;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 10px;
  height: 20px;
  background: #A796FF;
  animation: ${blink} 1s infinite;
  vertical-align: bottom;
  margin-left: 5px;
`;

const HeaderLine = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dashed #A796FF;
  margin-bottom: 10px;
  padding-bottom: 5px;
`;

const MONAD_ASCII = `
  __  __  ____  _   _      _    ____  
 |  \\/  |/ __ \\| \\ | |    / \\  |  _ \\ 
 | |\\/| | |  | |  \\| |   / _ \\ | | | |
 | |  | | |__| | |\\  |  / ___ \\| |_| |
 |_|  |_|\\____/|_| \\_| /_/   \\_\\____/ 
                                      
      G M O N A D   X P   v 1 . 0
`;

export const BootScreen = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const [mem, setMem] = useState(0);
  const audioCtx = useRef(null);

  const playSound = (freq = 440, type = 'square', duration = 0.1) => {
    try {
        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioCtx.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = type;
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
        osc.stop(ctx.currentTime + duration);
    } catch (e) {
        // Ignore audio errors if blocked
    }
  };

  useEffect(() => {
    // Memory Count Effect
    const memInterval = setInterval(() => {
        setMem(prev => {
            if (prev >= 32768) { // 32GB RAM for Monad
                clearInterval(memInterval);
                return 32768;
            }
            return prev + 512;
        });
    }, 15);

    const sequence = [
      { text: 'MONAD XP BIOS (C) 2025 Monad Labs Inc.', delay: 100 },
      { text: 'BIOS Date 11/23/25 19:43:00 Ver 1.0.0', delay: 200 },
      { text: `CPU: MONAD SUPERSCALAR PIPELINE - 10,000 TPS`, delay: 500 },
      { text: '', delay: 1000 }, 
      { text: 'Memory Test: 32768K OK', delay: 1500 },
      { text: 'Initializing MonadBFT Consensus Layer...', delay: 2000 },
      { text: 'Allocating Async IO Ring Buffers...', delay: 2200 },
      { text: 'Optimizing MonadDb Merkle Patricia Trie... OK', delay: 2500 },
      { text: 'Pipeline Stage: DEFERRED EXECUTION... ENABLED', delay: 2800 },
      { text: '', delay: 3000 },
      { text: 'Booting from Hard Disk...', delay: 3400 },
      { text: 'Loading Kernel...', delay: 3800, sound: 100 },
      { text: 'Mounting MonadDb Volumes...', delay: 4200 },
      { text: '> /dev/monad0: clean, 10000/10000 TPS', delay: 4500 },
      { text: '> Starting MonadXP Desktop Environment...', delay: 4800 },
      { text: 'Ready.', delay: 5200 },
    ];

    let timeouts = [];

    sequence.forEach(({ text, delay, sound }) => {
      timeouts.push(setTimeout(() => {
        setLines(prev => [...prev, text]);
        if (sound) playSound(sound, 'square', 0.1);
        else playSound(800, 'sine', 0.05); // Typwriter click
      }, delay));
    });

    const finishTimeout = setTimeout(onComplete, 5800);

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(memInterval);
      clearTimeout(finishTimeout);
      if(audioCtx.current) audioCtx.current.close();
    };
  }, [onComplete]);

  return (
    <Container onClick={() => playSound(440)}>
      <HeaderLine>
        <span>MONAD XP BIOS v1.0</span>
        <span>Energy Star Ally</span>
      </HeaderLine>
      <LogoAscii>{MONAD_ASCII}</LogoAscii>
      
      {lines.map((line, i) => (
        <Line key={i}>{line}</Line>
      ))}

      {lines.length < 5 && (
          <Line>Memory Test: {mem}K</Line>
      )}

      <Line>_ <Cursor /></Line>
    </Container>
  );
};
