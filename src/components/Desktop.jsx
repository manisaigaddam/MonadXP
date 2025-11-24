import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Icon } from './Icon';
import { Window } from './Window';
import { Taskbar } from './Taskbar';
import { AppDetail } from './AppDetail';
import { AboutMonad } from './AboutMonad';
import { Settings } from './Settings';
import { KeoneHacker } from './KeoneHacker';
import { TrendingUp, Cpu, Gamepad2, Globe, Folder, Box, Heart } from 'lucide-react';
import db from '../data/db.json';

// Pulse animation for watermark
const pulse = keyframes`
  0% { opacity: 0.15; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.25; transform: translate(-50%, -50%) scale(1.02); }
  100% { opacity: 0.15; transform: translate(-50%, -50%) scale(1); }
`;

const DesktopContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${props => props.theme.colors.desktopBg};
  
  /* The Grid Pattern */
  background-image: 
    linear-gradient(${props => props.theme.colors.winBorderDark} 1px, transparent 1px),
    linear-gradient(90deg, ${props => props.theme.colors.winBorderDark} 1px, transparent 1px);
  background-size: 40px 40px;
  background-position: center;
  position: relative;
  overflow: hidden;
  
  /* Centered Logo Watermark - Glowing and more visible */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 800px;
    height: 800px;
    background-image: url('/logo.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    opacity: 0.2; /* Increased visibility */
    filter: drop-shadow(0 0 20px rgba(131, 110, 249, 0.5)); /* Purple Glow */
    pointer-events: none;
    z-index: 0;
    animation: ${pulse} 8s infinite ease-in-out;
  }

  /* Wallpaper Overlay - Cool Boundary Glow Effect */
  &::after {
    content: '';
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 60px; /* Space for Taskbar */
    background-image: url('/wallpaper.png');
    background-size: cover;
    background-position: center;
    opacity: 0.3; /* Increased visibility */
    pointer-events: none;
    z-index: 0;
    
    /* Cool Border Glow */
    border: 1px solid rgba(131, 110, 249, 0.3);
    box-shadow: 
      0 0 30px rgba(131, 110, 249, 0.2),
      inset 0 0 50px rgba(0, 0, 0, 0.8); /* Vignette */
    border-radius: 8px;
  }
`;

const IconGrid = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: calc(100vh - 40px);
  padding: 40px; /* Moved slightly to avoid border */
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
  { id: 'favourites', label: 'Favourites', icon: Heart },
  { id: 'archive', label: 'Archive', icon: Folder },
];

export const Desktop = ({ isMusicPlaying, onToggleMusic }) => {
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  });
  const [hoveredApp, setHoveredApp] = useState(null); // NEW STATE
  const [typingSoundEnabled, setTypingSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('typingSoundEnabled');
    return saved !== null ? JSON.parse(saved) : true; // Default to enabled
  });
  const [typingBoxesEnabled, setTypingBoxesEnabled] = useState(() => {
    const saved = localStorage.getItem('typingBoxesEnabled');
    return saved !== null ? JSON.parse(saved) : true; // Default to enabled
  });

  useEffect(() => {
    setProjects(db);
  }, []);

  // Listen for storage changes to update favorites
  useEffect(() => {
    const handleStorageChange = () => {
      const newFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(newFavorites);
      
      // Force re-render of open favourites window if it exists
      setWindows(prevWindows => {
        return prevWindows.map(win => {
          if (win.data.category === 'favourites') {
            // Update the window to trigger re-render
            return { ...win, updated: Date.now() };
          }
          return win;
        });
      });
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom event from AppDetail when favorites change
    window.addEventListener('favoritesUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', handleStorageChange);
    };
  }, []);

  const openWindow = (id, type, data = {}) => {
    const existingWindow = windows.find(w => w.id === id);
    if (existingWindow) {
      // If window is minimized, restore it
      if (existingWindow.minimized) {
        setWindows(windows.map(w => 
          w.id === id ? { ...w, minimized: false } : w
        ));
      }
      setActiveWindowId(id);
      return;
    }

    const newWindow = {
      id,
      type,
      title: data.title || id,
      data,
      defaultPosition: { x: 50 + (windows.length * 30), y: 30 + (windows.length * 30) },
      minimized: false,
      maximized: false,
      savedPosition: null,
      savedSize: null
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
    // If window is minimized, restore it first
    const window = windows.find(w => w.id === id);
    if (window && window.minimized) {
      setWindows(windows.map(w => 
        w.id === id ? { ...w, minimized: false } : w
      ));
    }
    setActiveWindowId(id);
  };

  const minimizeWindow = (id) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, minimized: true } : w
    ));
    // If minimized window was active, focus another window or clear focus
    if (activeWindowId === id) {
      const otherWindows = windows.filter(w => w.id !== id && !w.minimized);
      setActiveWindowId(otherWindows.length > 0 ? otherWindows[otherWindows.length - 1].id : null);
    }
  };

  const maximizeWindow = (id) => {
    setWindows(windows.map(w => {
      if (w.id === id) {
        return { ...w, maximized: !w.maximized };
      }
      return w;
    }));
    setActiveWindowId(id);
  };

  const getProjectsByCategory = (catId) => {
    if (catId === 'all') {
        return projects;
    }
    if (catId === 'archive') {
       return projects.filter(p => !['DeFi', 'Infra', 'NFTs & Gaming', 'Community'].includes(p.category));
    }
    if (catId === 'favourites') {
      const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
      return projects.filter(p => favoriteIds.includes(p.id));
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
      } else if (action === 'settings') {
          openWindow('settings', 'settings', { title: 'Settings' });
      } else if (action === 'all-projects') {
          openWindow('all-projects', 'folder', { title: 'All Programs', category: 'all' });
      }
  };

  // New Handler for app hover
  const handleAppHover = (project) => {
    setHoveredApp(project);
  };

  // Handlers for typing settings
  const handleToggleTypingSound = () => {
    const newValue = !typingSoundEnabled;
    setTypingSoundEnabled(newValue);
    localStorage.setItem('typingSoundEnabled', JSON.stringify(newValue));
  };

  const handleToggleTypingBoxes = () => {
    const newValue = !typingBoxesEnabled;
    setTypingBoxesEnabled(newValue);
    localStorage.setItem('typingBoxesEnabled', JSON.stringify(newValue));
  };

  return (
    <DesktopContainer onClick={() => setActiveWindowId(null)}>
      {/* Add Keone Background Component */}
      <KeoneHacker 
        hoveredApp={hoveredApp} 
        typingSoundEnabled={typingSoundEnabled}
        typingBoxesEnabled={typingBoxesEnabled}
      />
      <IconGrid onClick={(e) => e.stopPropagation()}>
        {CATEGORIES.map(cat => (
          <Icon 
            key={cat.id}
            label={cat.label}
            isFolder={true}
            onClick={() => openWindow(cat.id, 'folder', { title: cat.label, category: cat.id })}
            onMouseEnter={() => handleAppHover({ id: cat.id, name: cat.label })}
            onMouseLeave={() => handleAppHover(null)}
          />
        ))}
      </IconGrid>

      {windows.filter(win => !win.minimized).map(win => (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          isActive={activeWindowId === win.id}
          isMaximized={win.maximized}
          onClose={closeWindow}
          onFocus={() => focusWindow(win.id)}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          defaultPosition={win.defaultPosition}
          defaultSize={
            win.type === 'app' ? { width: 400, height: 500 } : 
            win.type === 'about' ? { width: 550, height: 600 } :
            win.type === 'settings' ? { width: 600, height: 500 } :
            { width: 640, height: 480 }
          }
        >
          {win.type === 'folder' && (
            <WindowContentGrid key={`${win.data.category}-${favorites.length}`}>
              {getProjectsByCategory(win.data.category).map(p => (
                <Icon 
                  key={p.id}
                  label={p.name}
                  icon={p.logo}
                  CustomIcon={!p.logo ? Box : undefined}
                  onClick={() => openWindow(`app-${p.id}`, 'app', { title: p.name, project: p })}
                  onMouseEnter={() => handleAppHover(p)}
                  onMouseLeave={() => handleAppHover(null)}
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
          {win.type === 'settings' && (
            <Settings 
              typingBoxesEnabled={typingBoxesEnabled}
              onToggleTypingBoxes={handleToggleTypingBoxes}
              typingSoundEnabled={typingSoundEnabled}
              onToggleTypingSound={handleToggleTypingSound}
              isMusicPlaying={isMusicPlaying}
              onToggleMusic={onToggleMusic}
            />
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
        typingSoundEnabled={typingSoundEnabled}
        onToggleTypingSound={handleToggleTypingSound}
      />
    </DesktopContainer>
  );
};
