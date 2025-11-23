import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Icon } from './Icon';
import { Window } from './Window';
import { Taskbar } from './Taskbar';
import { AppDetail } from './AppDetail';
import { AboutMonad } from './AboutMonad';
import { TrendingUp, Cpu, Gamepad2, Globe, Folder, Box } from 'lucide-react';
import db from '../data/db.json';

const DesktopContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${props => props.theme.colors.desktopBg};
  background-image: 
    linear-gradient(${props => props.theme.colors.winBorderDark} 1px, transparent 1px),
    linear-gradient(90deg, ${props => props.theme.colors.winBorderDark} 1px, transparent 1px);
  background-size: 40px 40px;
  background-position: center;
  position: relative;
  overflow: hidden;
  
  /* Centered Logo Watermark - Using local file */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 400px;
    background-image: url('/logo.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    opacity: 0.1; /* Watermark style */
    pointer-events: none;
    z-index: 0;
  }

  /* Wallpaper Overlay */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('/wallpaper.png');
    background-size: cover;
    background-position: center;
    opacity: 0.2; /* Blend wallpaper with grid/color */
    pointer-events: none;
    z-index: 0;
  }
`;

const IconGrid = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: calc(100vh - 40px);
  padding: 20px;
  gap: 10px;
  align-content: flex-start;
  position: relative;
  z-index: 1;
`;

const WindowContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 16px;
  padding: 16px;
`;

const CATEGORIES = [
  { id: 'defi', label: 'DeFi', icon: TrendingUp },
  { id: 'infra', label: 'Infra', icon: Cpu },
  { id: 'nfts', label: 'NFTs & Gaming', icon: Gamepad2 },
  { id: 'community', label: 'Community', icon: Globe },
  { id: 'archive', label: 'Archive', icon: Folder },
];

export const Desktop = ({ isMusicPlaying, onToggleMusic }) => {
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    setProjects(db);
  }, []);

  const openWindow = (id, type, data = {}) => {
    if (windows.find(w => w.id === id)) {
      setActiveWindowId(id);
      return;
    }

    const newWindow = {
      id,
      type,
      title: data.title || id,
      data,
      defaultPosition: { x: 50 + (windows.length * 30), y: 30 + (windows.length * 30) }
    };

    setWindows([...windows, newWindow]);
    setActiveWindowId(id);
  };

  const closeWindow = (id) => {
    setWindows(windows.filter(w => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const focusWindow = (id) => {
    setActiveWindowId(id);
  };

  const getProjectsByCategory = (catId) => {
    if (catId === 'all') {
        return projects;
    }
    if (catId === 'archive') {
       return projects.filter(p => !['DeFi', 'Infra', 'NFTs & Gaming', 'Community'].includes(p.category));
    }
    const map = {
      'defi': 'DeFi',
      'infra': 'Infra',
      'nfts': 'NFTs & Gaming',
      'community': 'Community'
    };
    return projects.filter(p => p.category === map[catId]);
  };

  // Handler for Taskbar/Start Menu actions
  const handleOpenSpecial = (action) => {
      if (action === 'about') {
          openWindow('about-monad', 'about', { title: 'About Monad XP' });
      } else if (action === 'all-projects') {
          openWindow('all-projects', 'folder', { title: 'All Programs', category: 'all' });
      }
  };

  return (
    <DesktopContainer onClick={() => setActiveWindowId(null)}>
      <IconGrid onClick={(e) => e.stopPropagation()}>
        {CATEGORIES.map(cat => (
          <Icon 
            key={cat.id}
            label={cat.label}
            isFolder={true}
            onClick={() => openWindow(cat.id, 'folder', { title: cat.label, category: cat.id })}
          />
        ))}
      </IconGrid>

      {windows.map(win => (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          isActive={activeWindowId === win.id}
          onClose={closeWindow}
          onFocus={() => focusWindow(win.id)}
          defaultPosition={win.defaultPosition}
          defaultSize={
              win.type === 'app' ? { width: 400, height: 500 } : 
              win.type === 'about' ? { width: 550, height: 600 } :
              { width: 640, height: 480 }
          }
        >
          {win.type === 'folder' && (
            <WindowContentGrid>
              {getProjectsByCategory(win.data.category).map(p => (
                <Icon 
                  key={p.id}
                  label={p.name}
                  icon={p.logo}
                  CustomIcon={!p.logo ? Box : undefined}
                  onClick={() => openWindow(`app-${p.id}`, 'app', { title: p.name, project: p })}
                />
              ))}
            </WindowContentGrid>
          )}
          {win.type === 'app' && (
            <AppDetail project={win.data.project} />
          )}
          {win.type === 'about' && (
            <AboutMonad />
          )}
        </Window>
      ))}

      <Taskbar 
        windows={windows} 
        activeWindowId={activeWindowId} 
        onWindowClick={focusWindow}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={onToggleMusic}
        onOpenSpecial={handleOpenSpecial}
      />
    </DesktopContainer>
  );
};
