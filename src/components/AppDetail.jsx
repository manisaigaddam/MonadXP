import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ExternalLink, Twitter, Globe, Heart } from 'lucide-react';

const DetailContainer = styled.div`
  padding: 4px;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.theme.colors.winBackground};
  color: ${props => props.theme.colors.text};
`;

const BannerFrame = styled.div`
  border: 2px solid;
  border-color: #999 #fff #fff #999; /* Inset look */
  padding: 2px;
  margin-bottom: 10px;
  background: #000;
`;

const Banner = styled.div`
  width: 100%;
  height: 120px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  image-rendering: pixelated; /* Retro filtering */
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid #999;
  padding-bottom: 5px;
`;

const Title = styled.h1`
  font-family: ${props => props.theme.fonts.header};
  font-size: 20px;
  color: ${props => props.theme.colors.primary};
  text-shadow: 1px 1px 0px #fff;
`;

const TypeBadge = styled.span`
  background: ${props => props.theme.colors.primary};
  color: #fff;
  padding: 2px 6px;
  font-size: 12px;
  font-family: ${props => props.theme.fonts.mono};
  border: 1px solid #000;
  box-shadow: 2px 2px 0 #000;
`;

const Description = styled.div`
  font-family: ${props => props.theme.fonts.mono};
  font-size: 14px;
  line-height: 1.4;
  color: #000;
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  padding: 10px;
  background: #fff;
  border: 2px solid;
  border-color: #999 #fff #fff #999;
  white-space: pre-wrap;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  padding-top: 5px;
`;

const RetroButton = styled.button`
  flex: 1;
  padding: 8px;
  background: ${props => props.theme.colors.winBackground};
  border: 2px solid;
  border-color: #fff #000 #000 #fff;
  color: #000;
  font-family: ${props => props.theme.fonts.header};
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  
  &:active {
    border-color: #000 #fff #fff #000;
    transform: translate(1px, 1px);
  }

  &:hover {
    background: #e0e0e0;
  }
`;

const FavoriteButton = styled(RetroButton)`
  flex: 0;
  width: 40px;
  color: ${props => props.isFavorite ? '#ff1744' : '#000'};
  
  svg {
    fill: ${props => props.isFavorite ? '#ff1744' : 'none'};
  }
`;

export const AppDetail = ({ project }) => {
  const [isFavorite, setIsFavorite] = useState(() => {
    // Check if favorite is stored in localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.includes(project.id);
  });

  // Sync favorite state when project changes or when favorites are updated externally
  useEffect(() => {
    const checkFavorite = () => {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.includes(project.id));
    };

    // Check on mount and when project changes
    checkFavorite();

    // Listen for favorites updates
    window.addEventListener('favoritesUpdated', checkFavorite);
    
    return () => {
      window.removeEventListener('favoritesUpdated', checkFavorite);
    };
  }, [project.id]);

  const openLink = (url) => {
    if(url) window.open(url, '_blank');
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const newFavorites = isFavorite
      ? favorites.filter(id => id !== project.id)
      : [...favorites, project.id];
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
    
    // Dispatch custom event to notify Desktop component
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  return (
    <DetailContainer>
      <BannerFrame>
        <Banner src={project.banner} />
      </BannerFrame>
      
      <Header>
        <Title>{project.name}</Title>
        <TypeBadge>{project.type || 'APP'}</TypeBadge>
      </Header>
      
      <Description>
        {project.description || 'No description available.'}
        {'\n\n'}
        {project.tags && `TAGS: [${project.tags.join('] [')}]`}
      </Description>
      
      <ButtonGroup>
        <RetroButton onClick={() => openLink(project.website)}>
          <ExternalLink size={14} />
          <span>CONNECT</span>
        </RetroButton>
        <FavoriteButton 
          isFavorite={isFavorite} 
          onClick={toggleFavorite}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={14} />
        </FavoriteButton>
        {project.twitter && (
          <RetroButton onClick={() => openLink(project.twitter)} style={{ flex: 0, width: '40px' }}>
            <Twitter size={14} />
          </RetroButton>
        )}
      </ButtonGroup>
    </DetailContainer>
  );
};
