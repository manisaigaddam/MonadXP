import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const flicker = keyframes`
  0% { opacity: 0.8; }
  5% { opacity: 0.5; }
  10% { opacity: 0.9; }
  15% { opacity: 0.1; }
  20% { opacity: 1; }
  100% { opacity: 1; }
`;

const BootContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.fonts.mono};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: ${props => props.theme.zIndices.boot};
  padding: 40px;
`;

const TerminalText = styled.div`
  width: 100%;
  max-width: 600px;
  font-size: 16px;
  line-height: 1.5;
  white-space: pre-wrap;
  
  p {
    margin-bottom: 5px;
    animation: ${flicker} 0.1s infinite;
    animation-iteration-count: 2;
  }
  
  .highlight {
    color: ${props => props.theme.colors.secondary};
  }
`;

const LoadingBar = styled.div`
  width: 300px;
  height: 4px;
  background: #333;
  margin-top: 20px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background: ${props => props.theme.colors.primary};
    transition: width 0.1s linear;
  }
`;

export const BootScreen = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sequence = [
      { text: '> INITIALIZING MONAD EVM...', delay: 500 },
      { text: '> VERIFYING CHAIN ID: 10143', delay: 1200 },
      { text: '> ALLOCATING MEMORY...', delay: 1800 },
      { text: '> LOADING GMONAD KERNEL...', delay: 2400 },
      { text: '> 10,000 TPS DETECTED.', delay: 3200 },
      { text: '> OPTIMIZING PARALLEL EXECUTION...', delay: 3800 },
      { text: '> SYSTEM READY.', delay: 4500 },
    ];

    let timeouts = [];

    sequence.forEach(({ text, delay }) => {
      const timeout = setTimeout(() => {
        setLines(prev => [...prev, text]);
      }, delay);
      timeouts.push(timeout);
    });

    // Progress bar
    const interval = setInterval(() => {
      setProgress(old => {
        if (old >= 100) {
          clearInterval(interval);
          return 100;
        }
        return old + 1.5;
      });
    }, 50);

    const finishTimeout = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(interval);
      clearTimeout(finishTimeout);
    };
  }, [onComplete]);

  return (
    <BootContainer>
      <TerminalText>
        {lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </TerminalText>
      <LoadingBar progress={progress} />
    </BootContainer>
  );
};

