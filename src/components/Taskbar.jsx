import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Volume2, VolumeX, Wifi, Battery, ChevronRight, Power, Disc, Info, Folder } from 'lucide-react';

const TaskbarContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background: ${props => props.theme.colors.winBackground};
  border-top: 2px solid ${props => props.theme.colors.winBorderLight};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px;
  z-index: ${props => props.theme.zIndices.taskbar};
  box-shadow: 0 -2px 5px rgba(0,0,0,0.2);
`;

const StartButton = styled.button`
  background: ${props => props.active ? props.theme.colors.winBackground : props.theme.colors.winBackground};
  border: 2px solid;
  border-color: ${props => props.active ? '#000 #fff #fff #000' : '#fff #000 #000 #fff'};
  color: ${props => props.theme.colors.text};
  padding: 4px 10px;
  font-weight: bold;
  font-family: ${props => props.theme.fonts.header};
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  margin-right: 10px;
  cursor: pointer;
  
  &:active {
    border-color: #000 #fff #fff #000;
  }

  img {
    width: 20px;
    height: 20px;
  }
`;

const StartMenu = styled.div`
  position: absolute;
  bottom: 42px;
  left: 2px;
  width: 240px;
  background: ${props => props.theme.colors.winBackground};
  border: 2px solid;
  border-color: ${props => props.theme.colors.winBorderLight} ${props => props.theme.colors.winBorderDark} ${props => props.theme.colors.winBorderDark} ${props => props.theme.colors.winBorderLight};
  box-shadow: 4px 4px 10px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  z-index: ${props => props.theme.zIndices.startMenu};
  padding: 2px;
`;

const MenuSidebar = styled.div`
  background: linear-gradient(180deg, ${props => props.theme.colors.secondary}, ${props => props.theme.colors.primary});
  width: 36px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 10px;
  
  span {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    color: white;
    font-weight: bold;
    font-size: 18px;
    letter-spacing: 4px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  }
`;

const MenuContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MenuItem = styled.div`
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-family: ${props => props.theme.fonts.main};
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  border: 1px solid transparent;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #999;
  border-bottom: 1px solid #fff;
  margin: 4px 0;
`;

const WindowList = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 4px;
  overflow-x: auto;
`;

const WindowTab = styled.button`
  background: ${props => props.active ? '#eee' : props.theme.colors.winBackground};
  border: 2px solid;
  border-color: ${props => props.active ? '#000 #fff #fff #000' : '#fff #000 #000 #fff'};
  /* Dither pattern for active tab */
  background-image: ${props => props.active ? 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAIklEQVQYV2NkYGD4D8SMQAwCcAAoCnGgBAZYyJGRkQGdCgC4OQ4B7l3xrwAAAABJRU5ErkJggg==)' : 'none'};
  color: ${props => props.theme.colors.text};
  padding: 0 10px;
  height: 30px;
  max-width: 160px;
  text-align: left;
  font-family: ${props => props.theme.fonts.main};
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:active {
    border-color: #000 #fff #fff #000;
  }
`;

const SystemTray = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
  border-left: 2px solid #999;
  border-right: 2px solid #fff;
  height: 32px;
  margin-right: 2px;
  background: #ccc;
  box-shadow: inset 1px 1px 0 #000;
  font-family: ${props => props.theme.fonts.mono};
  font-size: 14px;
`;

const Clock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>;
};

export const Taskbar = ({ windows, activeWindowId, onWindowClick, onToggleMusic, isMusicPlaying, onOpenSpecial }) => {
  const [startOpen, setStartOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setStartOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShutdown = () => {
    window.location.reload();
  };

  const handlePrograms = () => {
      onOpenSpecial('all-projects');
      setStartOpen(false);
  };

  const handleAbout = () => {
      onOpenSpecial('about');
      setStartOpen(false);
  };

  return (
    <TaskbarContainer>
      <div ref={menuRef}>
        <StartButton active={startOpen} onClick={() => setStartOpen(!startOpen)}>
           <img src="/logo.png" alt="XP" onError={(e) => e.target.src='https://monad.xyz/logo.svg'} /> 
           <span>XP</span>
        </StartButton>
        
        {startOpen && (
          <StartMenu>
            <div style={{ display: 'flex' }}>
              <MenuSidebar><span>MONAD XP</span></MenuSidebar>
              <MenuContent>
                <MenuItem onClick={() => { onToggleMusic(); setStartOpen(false); }}>
                    <Disc /> 
                    {isMusicPlaying ? 'Stop Music' : 'Play Music'}
                </MenuItem>
                <MenuItem onClick={handleAbout}>
                    <Info /> About Monad
                </MenuItem>
                <Divider />
                <MenuItem onClick={handlePrograms}>
                    <Folder /> All Programs
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleShutdown} style={{marginTop: 'auto'}}>
                    <Power /> Shut Down...
                </MenuItem>
              </MenuContent>
            </div>
          </StartMenu>
        )}
      </div>

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
        <div onClick={onToggleMusic} style={{cursor: 'pointer'}}>
            {isMusicPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </div>
        <Clock />
      </SystemTray>
    </TaskbarContainer>
  );
};
