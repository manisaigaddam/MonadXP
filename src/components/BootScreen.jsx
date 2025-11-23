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
  font-size: 20px;
  padding: 40px;
  z-index: ${props => props.theme.zIndices.boot};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const LogoAscii = styled.pre`
  color: #836EF9;
  font-size: 12px;
  line-height: 10px;
  margin-bottom: 20px;
  text-shadow: 0 0 5px #836EF9;
`;

const Line = styled.div`
  margin-bottom: 5px;
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

const MONAD_ASCII = `
  __  __  ____  _   _      _    ____  
 |  \\/  |/ __ \\| \\ | |    / \\  |  _ \\ 
 | |\\/| | |  | |  \\| |   / _ \\ | | | |
 | |  | | |__| | |\\  |  / ___ \\| |_| |
 |_|  |_|\\____/|_| \\_| /_/   \\_\\____/ 
                                      
      G M O N A D   O S   v 1 . 0
`;

export const BootScreen = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const audioContextRef = useRef(null);

  const playBeep = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.value = 440;
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.1);
    osc.stop(ctx.currentTime + 0.1);
  };

  useEffect(() => {
    // Try to initialize audio on first click if blocked, but we'll try auto here
    const sequence = [
      { text: 'BIOS DATE 11/23/25 19:43:00 VER 1.0.0', delay: 500 },
      { text: 'CPU: MONAD QUANTUM CORE - 10,000 TPS', delay: 1000 },
      { text: 'Memory Test: 640K OK', delay: 1500 },
      { text: 'Detecting Primary Master ... GMONAD_FS', delay: 2000 },
      { text: 'Detecting Primary Slave  ... DEFI_L1', delay: 2200 },
      { text: '', delay: 2500 },
      { text: 'Booting from Hard Disk...', delay: 3000 },
      { text: 'Loading Kernel...', delay: 3500, action: playBeep },
      { text: 'Mounting Volumes...', delay: 4000 },
      { text: 'Starting Desktop Environment...', delay: 4800 },
      { text: 'Ready.', delay: 5500 },
    ];

    let timeouts = [];

    sequence.forEach(({ text, delay, action }) => {
      timeouts.push(setTimeout(() => {
        setLines(prev => [...prev, text]);
        if (action) action();
      }, delay));
    });

    const finishTimeout = setTimeout(onComplete, 6000);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(finishTimeout);
      if(audioContextRef.current) audioContextRef.current.close();
    };
  }, [onComplete]);

  return (
    <Container onClick={playBeep}>
      <LogoAscii>{MONAD_ASCII}</LogoAscii>
      {lines.map((line, i) => (
        <Line key={i}>{line}</Line>
      ))}
      <Line>_ <Cursor /></Line>
    </Container>
  );
};
