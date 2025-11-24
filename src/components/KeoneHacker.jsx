// src/components/KeoneHacker.jsx
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { getSarcasticComment } from '../data/sarcasm';

const glitch = keyframes`
  0% { transform: translate(0); opacity: 0.95; }
  20% { transform: translate(-1px, 1px); opacity: 1; }
  40% { transform: translate(-1px, -1px); opacity: 0.9; }
  60% { transform: translate(1px, 1px); opacity: 1; }
  80% { transform: translate(1px, -1px); opacity: 0.95; }
  100% { transform: translate(0); opacity: 0.95; }
`;

const typingCaret = keyframes`
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
`;

const CursorBubble = styled.div`
  position: fixed;
  min-width: 200px;
  max-width: 350px;
  padding: 14px 18px;
  background: rgba(5, 5, 15, 0.98);
  border: 2px solid #00ff88;
  color: #00ff88;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
  text-shadow: 0 0 8px rgba(0, 255, 136, 0.8);
  box-shadow:
    0 0 20px rgba(0, 255, 136, 0.5),
    inset 0 0 15px rgba(0, 255, 136, 0.1);
  pointer-events: none;
  transform: translate(-50%, -120%);
  animation: ${glitch} 1.5s ease-in-out infinite;
  border-radius: 4px;
  z-index: 10000;

  &::before {
    content: "> ";
    color: #836EF9;
    font-weight: bold;
  }

  &::after {
    content: "";
    position: absolute;
    width: 10px;
    height: 10px;
    border-left: 2px solid #00ff88;
    border-bottom: 2px solid #00ff88;
    bottom: -6px;
    left: 24px;
    transform: rotate(-45deg);
    background: rgba(5, 5, 15, 0.98);
  }
`;

const TypingText = styled.span`
  position: relative;
  display: inline-block;

  &::after {
    content: "_";
    margin-left: 3px;
    color: #00ff88;
    animation: ${typingCaret} 0.8s steps(1, end) infinite;
    text-shadow: 0 0 5px #00ff88;
  }
`;

// Generate hacker-style keyboard typing sound using Web Audio API
let audioContext = null;

const getAudioContext = () => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      return null;
    }
  }
  return audioContext;
};

const playTypingSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    // Create a mechanical keyboard click sound (hacker/terminal vibe)
    const now = ctx.currentTime;
    
    // Main click - high frequency sharp attack
    const click1 = ctx.createOscillator();
    const click1Gain = ctx.createGain();
    
    click1.type = 'square'; // Square wave for sharp, digital sound
    click1.frequency.value = 2000 + Math.random() * 500; // 2000-2500Hz for click
    
    click1Gain.gain.setValueAtTime(0, now);
    click1Gain.gain.linearRampToValueAtTime(0.15, now + 0.001); // Very quick attack
    click1Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.008); // Quick decay
    
    click1.connect(click1Gain);
    click1Gain.connect(ctx.destination);
    
    click1.start(now);
    click1.stop(now + 0.008);
    
    // Subtle low frequency thud for mechanical feel
    const thud = ctx.createOscillator();
    const thudGain = ctx.createGain();
    
    thud.type = 'sine';
    thud.frequency.value = 100 + Math.random() * 50; // 100-150Hz for thud
    
    thudGain.gain.setValueAtTime(0, now);
    thudGain.gain.linearRampToValueAtTime(0.05, now + 0.002);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);
    
    thud.connect(thudGain);
    thudGain.connect(ctx.destination);
    
    thud.start(now);
    thud.stop(now + 0.012);
  } catch (e) {
    // Silently fail if audio context issues
  }
};

export const KeoneHacker = ({ hoveredApp, typingSoundEnabled = true, typingBoxesEnabled = true }) => {
  const typingIntervalRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    const handleMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  useEffect(() => {
    if (!hoveredApp || !typingBoxesEnabled) {
      setDisplayedText('');
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      return;
    }

    const text = getSarcasticComment(hoveredApp);
    startTyping(text);

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    };
  }, [hoveredApp, typingBoxesEnabled]);

  const startTyping = (text) => {
    setDisplayedText('');
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    let idx = 0;
    const typingSpeed = 30; // ms per character
    
    typingIntervalRef.current = setInterval(() => {
      if (idx < text.length) {
        idx += 1;
        setDisplayedText(text.slice(0, idx));
        
        // Play typing sound for each character typed (synced with typing speed)
        // Skip sound for spaces to make it more natural
        // Only play if sound is enabled
        const currentChar = text[idx - 1];
        if (currentChar !== ' ' && typingSoundEnabled) {
          playTypingSound();
        }
      } else {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    }, typingSpeed);
  };

  // Don't render anything if typing boxes are disabled
  if (!typingBoxesEnabled) {
    return null;
  }

  return (
    <>
      {!!displayedText && (
        <CursorBubble style={{ left: cursorPos.x + 20, top: cursorPos.y - 20 }}>
          <TypingText>{displayedText}</TypingText>
        </CursorBubble>
      )}
    </>
  );
};
