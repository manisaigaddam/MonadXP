import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Icon } from './Icon';
import { Window } from './Window';
import { Taskbar } from './Taskbar';
import { AppDetail } from './AppDetail';
import { TrendingUp, Cpu, Gamepad2, Globe, Folder, Box } from 'lucide-react';
import db from '../data/db.json';

const DesktopContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${props => props.theme.colors.desktopBg};
  /* Optional: Add a subtle grid pattern for retro engineering feel */
  background-image: 
    linear-gradient(${props => props.theme.colors.winBorderDark} 1px, transparent 1px),
    linear-gradient(90deg, ${props => props.theme.colors.winBorderDark} 1px, transparent 1px);
  background-size: 40px 40px;
  background-position: center;
  position: relative;
  overflow: hidden;
`;

const IconGrid = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: calc(100vh - 40px);
  padding: 20px;
  gap: 10px;
  align-content: flex-start;
`;

const WindowContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 16px;
  padding: 16px;
`;

// Updated Categories to match new logic
const CATEGORIES = [
  { id: 'defi', label: 'DeFi', icon: TrendingUp },
  { id: 'infra', label: 'Infra', icon: Cpu },
  { id: 'nfts', label: 'NFTs & Gaming', icon: Gamepad2 },
  { id: 'community', label: 'Community', icon: Globe },
  { id: 'archive', label: 'Archive', icon: Folder }, // Changed id to match script 'Archive' or 'Others'
];

export const Desktop = ({ isMusicPlaying, onToggleMusic }) => {
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    setProjects(db);
  }, []);

  const openWindow = (id, type, data = {}) => {
    // If window already exists, focus it
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
    // Map desktop folder IDs to DB categories
    if (catId === 'archive') {
       // Catch-all for things not in the main 4
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

  return (
    <DesktopContainer onClick={() => setActiveWindowId(null)}>
      <IconGrid onClick={(e) => e.stopPropagation()}>
        {CATEGORIES.map(cat => (
          <Icon 
            key={cat.id}
            label={cat.label}
            // We use isFolder prop to trigger the custom pixel folder
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
          defaultSize={win.type === 'app' ? { width: 400, height: 500 } : { width: 640, height: 480 }}
        >
          {win.type === 'folder' && (
            <WindowContentGrid>
              {getProjectsByCategory(win.data.category).map(p => (
                <Icon 
                  key={p.id}
                  label={p.name}
                  icon={p.logo}
                  // Use generic icon if no logo
                  CustomIcon={!p.logo ? Box : undefined}
                  onClick={() => openWindow(`app-${p.id}`, 'app', { title: p.name, project: p })}
                />
              ))}
            </WindowContentGrid>
          )}
          {win.type === 'app' && (
            <AppDetail project={win.data.project} />
          )}
        </Window>
      ))}

      <Taskbar 
        windows={windows} 
        activeWindowId={activeWindowId} 
        onWindowClick={focusWindow}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={onToggleMusic}
      />
    </DesktopContainer>
  );
};
