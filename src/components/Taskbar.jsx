import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Volume2, Wifi, Battery } from 'lucide-react';

const TaskbarContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background: rgba(14, 9, 28, 0.85);
  backdrop-filter: blur(10px);
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  z-index: ${props => props.theme.zIndices.taskbar};
`;

const StartButton = styled.button`
  background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  border: none;
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: bold;
  font-family: ${props => props.theme.fonts.header};
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 0 10px ${props => props.theme.colors.primary}80;
  margin-right: 10px;
  
  &:hover {
    filter: brightness(1.1);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const WindowList = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 5px;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const WindowTab = styled.button`
  background: ${props => props.active ? 'rgba(255,255,255,0.1)' : 'transparent'};
  border: none;
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.theme.colors.textLight};
  padding: 0 12px;
  height: 38px;
  max-width: 200px;
  text-align: left;
  font-family: ${props => props.theme.fonts.main};
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  transition: background 0.2s;

  &:hover {
    background: rgba(255,255,255,0.05);
  }
`;

const SystemTray = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  color: ${props => props.theme.colors.textLight};
  font-size: 12px;
  font-family: ${props => props.theme.fonts.mono};
  padding-right: 10px;
  padding-left: 10px;
  border-left: 1px solid rgba(255,255,255,0.1);

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span>
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  );
};

export const Taskbar = ({ windows, activeWindowId, onWindowClick }) => {
  return (
    <TaskbarContainer>
      <StartButton>
        <span>MONAD</span>
      </StartButton>
      <WindowList>
        {windows.map(win => (
          <WindowTab 
            key={win.id} 
            active={win.id === activeWindowId}
            onClick={() => onWindowClick(win.id)}
          >
            {win.title}
          </WindowTab>
        ))}
      </WindowList>
      <SystemTray>
        <Wifi />
        <Volume2 />
        <Battery size={16} />
        <Clock />
      </SystemTray>
    </TaskbarContainer>
  );
};

