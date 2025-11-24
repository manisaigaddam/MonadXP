import React, { useState, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { Search, Grid3x3, Network, Tag, List, Sparkles, TrendingUp, Star, Target, Heart, Trophy, Gem } from 'lucide-react';
import { Discovery3D } from './Discovery3D';
import { getRecommendations, getTrendingApps, getSimilarApps, trackUserBehavior } from '../utils/recommendationEngine';
import { checkAchievements, getUserStats, trackDiscoveryUsage } from '../utils/gamification';
import db from '../data/db.json';

const Container = styled.div`
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.winBackground};
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const SearchBar = styled.div`
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  background: #fff;
  border: 2px solid;
  border-color: #999 #fff #fff #999;
  padding: 4px 8px;
  gap: 8px;
  
  input {
    flex: 1;
    border: none;
    outline: none;
    font-family: ${props => props.theme.fonts.mono};
    font-size: 14px;
    background: transparent;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 4px;
  background: ${props => props.theme.colors.winBackground};
  border: 2px solid;
  border-color: #999 #fff #fff #999;
  padding: 2px;
`;

const ViewButton = styled.button`
  padding: 4px 8px;
  border: none;
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? '#fff' : '#000'};
  cursor: pointer;
  font-family: ${props => props.theme.fonts.mono};
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.primary : '#e0e0e0'};
  }
`;

const StatsBar = styled.div`
  display: flex;
  gap: 16px;
  padding: 8px;
  background: #f0f0f0;
  border: 1px solid #999;
  margin-bottom: 12px;
  font-size: 12px;
  font-family: ${props => props.theme.fonts.mono};
  align-items: center;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  
  svg {
    width: 14px;
    height: 14px;
    color: #000;
    flex-shrink: 0;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
`;

// 3D View
const View3D = styled.div`
  width: 100%;
  height: 100%;
  min-height: 400px;
`;

// Network Graph View (simplified 2D visualization)
const NetworkView = styled.div`
  width: 100%;
  height: 100%;
  min-height: 400px;
  position: relative;
  background: #000;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NetworkNode = styled.div`
  position: absolute;
  width: ${props => props.size || 40}px;
  height: ${props => props.size || 40}px;
  border-radius: 50%;
  background: ${props => props.color || '#836ef9'};
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  font-size: ${props => Math.max(10, props.size * 0.25)}px;
  color: #fff;
  font-weight: bold;
  transform: translate(-50%, -50%);
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.3);
    z-index: 10;
  }
`;

// Tag Cloud View
const TagCloudView = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px;
`;

const TagButton = styled.button`
  padding: 6px 12px;
  background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.winBackground};
  color: ${props => props.active ? '#fff' : '#000'};
  border: 2px solid;
  border-color: #999 #fff #fff #999;
  cursor: pointer;
  font-family: ${props => props.theme.fonts.mono};
  font-size: 12px;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: #fff;
  }
  
  &:active {
    border-color: #fff #999 #999 #fff;
  }
`;

// List View
const ListView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: #fff;
  border: 2px solid;
  border-color: #999 #fff #fff #999;
  cursor: pointer;
  
  &:hover {
    background: #f0f0f0;
  }
  
  &:active {
    border-color: #fff #999 #999 #fff;
  }
`;

const AppIcon = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
`;

const RecommendationBadge = styled.span`
  background: #836ef9;
  color: #fff;
  padding: 2px 6px;
  font-size: 10px;
  border-radius: 2px;
  margin-left: auto;
`;

export const DiscoveryWindow = ({ onAppClick }) => {
  const [viewMode, setViewMode] = useState('3d'); // '3d', 'network', 'tags', 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [stats, setStats] = useState(getUserStats());
  const [newAchievements, setNewAchievements] = useState([]);
  
  // Track discovery usage
  useEffect(() => {
    trackDiscoveryUsage();
    const achievements = checkAchievements();
    if (achievements.length > 0) {
      setNewAchievements(achievements);
      setTimeout(() => setNewAchievements([]), 5000);
    }
    setStats(getUserStats());
  }, []);
  
  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set();
    db.forEach(app => {
      (app.tags || []).forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, []);
  
  // Get recommendations
  const recommendations = useMemo(() => {
    return getRecommendations(db, 10);
  }, []);
  
  const recommendedIds = useMemo(() => {
    return recommendations.map(r => r.id);
  }, [recommendations]);
  
  // Filter apps based on search and tag
  const filteredApps = useMemo(() => {
    let filtered = db;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.name.toLowerCase().includes(query) ||
        (app.description || '').toLowerCase().includes(query) ||
        (app.tags || []).some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Tag filter
    if (selectedTag) {
      filtered = filtered.filter(app => 
        (app.tags || []).includes(selectedTag)
      );
    }
    
    return filtered;
  }, [searchQuery, selectedTag]);
  
  // Network graph layout (simple force-directed-like)
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const networkViewRef = useRef(null);

  useEffect(() => {
    const updateSize = () => {
      if (networkViewRef.current && viewMode === 'network') {
        const rect = networkViewRef.current.getBoundingClientRect();
        const newSize = { width: rect.width, height: rect.height };
        // Force update even if dimensions are similar (handles maximize)
        setContainerSize(newSize);
      }
    };

    // Initial size update with delay to ensure DOM is ready
    const initialTimeout = setTimeout(updateSize, 50);
    
    // Use ResizeObserver for better performance and to catch all size changes
    let resizeObserver;
    if (networkViewRef.current && viewMode === 'network') {
      resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          setContainerSize({ width, height });
        }
      });
      resizeObserver.observe(networkViewRef.current);
    }

    // Also listen to window resize for when window is maximized
    window.addEventListener('resize', updateSize);
    
    // Listen for window focus to catch maximize events
    const handleFocus = () => {
      setTimeout(updateSize, 100);
    };
    window.addEventListener('focus', handleFocus);
    
    // Periodic check to catch maximize (fallback)
    const intervalId = setInterval(updateSize, 500);
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('focus', handleFocus);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [viewMode]);

  // Network graph layout (simple force-directed-like)
  const networkNodes = useMemo(() => {
    if (viewMode !== 'network') return [];
    
    const apps = filteredApps.slice(0, 50); // Limit for performance
    const { width, height } = containerSize;
    
    // Calculate base size based on container dimensions (scale with window size)
    // Minimum size of 40px, scales up with larger windows
    const minSize = 40;
    const maxSize = 120;
    const baseSize = Math.max(minSize, Math.min(maxSize, Math.min(width, height) * 0.1));
    const recommendedSize = baseSize * 1.3; // Recommended nodes are 30% larger
    const normalSize = baseSize;
    
    // Scale radius based on container size (bigger window = bigger circle)
    // Use more of the available space for larger windows
    const radiusMultiplier = width > 1200 ? 0.4 : 0.35;
    const radius = Math.min(width, height) * radiusMultiplier;
    
    return apps.map((app, i) => {
      const angle = (i / apps.length) * Math.PI * 2;
      const x = width / 2 + Math.cos(angle) * radius;
      const y = height / 2 + Math.sin(angle) * radius;
      
      return {
        app,
        x,
        y,
        size: recommendedIds.includes(app.id) ? recommendedSize : normalSize,
        color: recommendedIds.includes(app.id) ? '#836ef9' : '#666'
      };
    });
  }, [filteredApps, viewMode, recommendedIds, containerSize]);
  
  const handleAppClick = (app) => {
    trackUserBehavior.trackClick(app.id);
    trackUserBehavior.trackView(app.id);
    if (onAppClick) onAppClick(app);
    
    // Check for new achievements
    const achievements = checkAchievements();
    if (achievements.length > 0) {
      setNewAchievements(achievements);
      setTimeout(() => setNewAchievements([]), 5000);
    }
    setStats(getUserStats());
  };
  
  return (
    <Container>
      {newAchievements.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: '#836ef9',
          color: '#fff',
          padding: '12px',
          borderRadius: '4px',
          zIndex: 1000,
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>🎉 Achievement Unlocked!</div>
          {newAchievements.map(ach => (
            <div key={ach.id} style={{ fontSize: '12px' }}>
              {ach.icon} {ach.name} - {ach.points} points
            </div>
          ))}
        </div>
      )}
      
      <Header>
        <SearchBar>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search apps, tags, descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBar>
        
        <ViewToggle>
          <ViewButton active={viewMode === '3d'} onClick={() => setViewMode('3d')}>
            <Grid3x3 size={14} /> 3D
          </ViewButton>
          <ViewButton active={viewMode === 'network'} onClick={() => setViewMode('network')}>
            <Network size={14} /> Network
          </ViewButton>
          <ViewButton active={viewMode === 'tags'} onClick={() => setViewMode('tags')}>
            <Tag size={14} /> Tags
          </ViewButton>
          <ViewButton active={viewMode === 'list'} onClick={() => setViewMode('list')}>
            <List size={14} /> List
          </ViewButton>
        </ViewToggle>
      </Header>
      
      <StatsBar>
        <StatItem>
          <Star size={14} color="#000" />
          <span>Level {stats.level}</span>
        </StatItem>
        <StatItem>
          <Target size={14} color="#000" />
          <span>{stats.appsClicked} Apps</span>
        </StatItem>
        <StatItem>
          <Heart size={14} color="#000" />
          <span>{stats.favoritesCount} Favorites</span>
        </StatItem>
        <StatItem>
          <Trophy size={14} color="#000" />
          <span>{stats.achievementsUnlocked} Achievements</span>
        </StatItem>
        <StatItem>
          <Gem size={14} color="#000" />
          <span>{stats.totalPoints} Points</span>
        </StatItem>
      </StatsBar>
      
      {viewMode === '3d' && (
        <View3D>
          <Discovery3D
            apps={filteredApps.slice(0, 100)}
            recommendedIds={recommendedIds}
            onAppClick={handleAppClick}
          />
        </View3D>
      )}
      
      {viewMode === 'network' && (
        <NetworkView ref={networkViewRef}>
          {networkNodes.map((node, i) => (
            <NetworkNode
              key={node.app.id}
              style={{ left: `${node.x}px`, top: `${node.y}px` }}
              size={node.size}
              color={node.color}
              onClick={() => handleAppClick(node.app)}
              title={node.app.name}
            >
              {node.app.name.substring(0, 2).toUpperCase()}
            </NetworkNode>
          ))}
        </NetworkView>
      )}
      
      {viewMode === 'tags' && (
        <ContentArea>
          <div style={{ padding: '8px', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
            Filter by Tag: applies for(3D,Network & List )
          </div>
          <TagCloudView>
            <TagButton
              active={!selectedTag}
              onClick={() => setSelectedTag(null)}
            >
              All
            </TagButton>
            {allTags.map(tag => (
              <TagButton
                key={tag}
                active={selectedTag === tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              >
                {tag}
              </TagButton>
            ))}
          </TagCloudView>
          
          <div style={{ padding: '8px', fontSize: '14px', fontWeight: 'bold', marginTop: '16px' }}>
            Recommended for You:
          </div>
          <ListView>
            {recommendations.slice(0, 5).map(app => (
              <ListItem key={app.id} onClick={() => handleAppClick(app)}>
                <AppIcon src={app.logo} alt={app.name} onError={(e) => e.target.style.display = 'none'} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>{app.name}</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    {app.description?.substring(0, 60)}...
                  </div>
                </div>
                <RecommendationBadge>
                  <Sparkles size={10} style={{ display: 'inline', marginRight: '4px' }} />
                  Recommended
                </RecommendationBadge>
              </ListItem>
            ))}
          </ListView>
          
          <div style={{ padding: '8px', fontSize: '14px', fontWeight: 'bold', marginTop: '16px' }}>
            Trending:
          </div>
          <ListView>
            {getTrendingApps(db, 5).map(app => (
              <ListItem key={app.id} onClick={() => handleAppClick(app)}>
                <AppIcon src={app.logo} alt={app.name} onError={(e) => e.target.style.display = 'none'} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>{app.name}</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    {app.description?.substring(0, 60)}...
                  </div>
                </div>
                <RecommendationBadge style={{ background: '#ff6b00' }}>
                  <TrendingUp size={10} style={{ display: 'inline', marginRight: '4px' }} />
                  Trending
                </RecommendationBadge>
              </ListItem>
            ))}
          </ListView>
        </ContentArea>
      )}
      
      {viewMode === 'list' && (
        <ContentArea>
          <ListView>
            {filteredApps.map(app => (
              <ListItem key={app.id} onClick={() => handleAppClick(app)}>
                <AppIcon src={app.logo} alt={app.name} onError={(e) => e.target.style.display = 'none'} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {app.name}
                    {recommendedIds.includes(app.id) && (
                      <RecommendationBadge>
                        <Sparkles size={10} style={{ display: 'inline', marginRight: '4px' }} />
                        Recommended
                      </RecommendationBadge>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    {app.description || 'No description'}
                  </div>
                  <div style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>
                    {app.category} • {(app.tags || []).join(', ')}
                  </div>
                </div>
              </ListItem>
            ))}
          </ListView>
        </ContentArea>
      )}
    </Container>
  );
};

