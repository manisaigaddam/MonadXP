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
                                      
      G M O N A D   O S   v 1 . 0
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
            if (prev >= 16384) {
                clearInterval(memInterval);
                return 16384;
            }
            return prev + 256;
        });
    }, 20);

    const sequence = [
      { text: 'GMONAD BIOS (C) 2025 Monad Labs Inc.', delay: 100 },
      { text: 'BIOS Date 11/23/25 19:43:00 Ver 1.0.0', delay: 200 },
      { text: `CPU: MONAD QUANTUM CORE - 10,000 TPS DETECTED`, delay: 500 },
      { text: '', delay: 1000 }, // Wait for mem
      { text: 'Memory Test: 16384K OK', delay: 1500 },
      { text: 'Detecting Primary Master ... GMONAD_FS (NVMe)', delay: 2000 },
      { text: 'Detecting Primary Slave  ... DEFI_L1 (Hyperlane)', delay: 2200 },
      { text: 'Detecting Parallel Execution Engines... OK', delay: 2500 },
      { text: '', delay: 2800 },
      { text: 'Booting from Hard Disk...', delay: 3200 },
      { text: 'Loading Kernel...', delay: 3800, sound: 100 },
      { text: 'Mounting Volumes...', delay: 4200 },
      { text: 'Initializing Gmonad Desktop Environment...', delay: 5000 },
      { text: 'Ready.', delay: 5500 },
    ];

    let timeouts = [];

    sequence.forEach(({ text, delay, sound }) => {
      timeouts.push(setTimeout(() => {
        setLines(prev => [...prev, text]);
        if (sound) playSound(sound, 'square', 0.1);
        else playSound(800, 'sine', 0.05); // Typwriter click
      }, delay));
    });

    const finishTimeout = setTimeout(onComplete, 6000);

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
        <span>GMONAD BIOS v1.0</span>
        <span>Energy Star Ally</span>
      </HeaderLine>
      <LogoAscii>{MONAD_ASCII}</LogoAscii>
      
      {/* Render existing lines */}
      {lines.map((line, i) => (
        <Line key={i}>{line}</Line>
      ))}

      {/* Render Memory Count only if not yet in lines (hacky visual sync) */}
      {lines.length < 5 && (
          <Line>Memory Test: {mem}K</Line>
      )}

      <Line>_ <Cursor /></Line>
    </Container>
  );
};
