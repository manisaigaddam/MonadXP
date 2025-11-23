import React from 'react';
import styled from 'styled-components';
import { ExternalLink, Twitter, Globe } from 'lucide-react';

const DetailContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  color: #000;
`;

const Banner = styled.div`
  width: 100%;
  height: 140px;
  background-color: #1a1528;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border: 1px solid #eee;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const Title = styled.h1`
  font-family: ${props => props.theme.fonts.header};
  font-size: 24px;
  margin-bottom: 5px;
  color: #000;
`;

const TypeBadge = styled.span`
  background: ${props => props.theme.colors.secondary};
  color: #000;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Description = styled.p`
  font-family: ${props => props.theme.fonts.main};
  font-size: 14px;
  line-height: 1.6;
  color: #444;
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  white-space: pre-wrap;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid #eee;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  background: ${props => props.primary ? props.theme.colors.primary : '#f0f0f0'};
  color: ${props => props.primary ? 'white' : '#333'};
  font-weight: bold;
  font-family: ${props => props.theme.fonts.header};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  font-size: 14px;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const IconButton = styled.a`
  width: 42px;
  height: 42px;
  border-radius: 6px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  text-decoration: none;
  transition: background 0.2s;
  
  &:hover {
    background: #e0e0e0;
  }
`;

export const AppDetail = ({ project }) => {
  const openLink = (url) => {
    if(url) window.open(url, '_blank');
  };

  return (
    <DetailContainer>
      <Banner src={project.banner} />
      <Header>
        <div>
          <Title>{project.name}</Title>
          <TypeBadge>{project.type || 'DApp'}</TypeBadge>
        </div>
      </Header>
      
      <Description>{project.description || 'No description available.'}</Description>
      
      <ButtonGroup>
        <ActionButton primary onClick={() => openLink(project.website)}>
          <ExternalLink size={18} />
          CONNECT
        </ActionButton>
        {project.twitter && (
          <IconButton href={project.twitter} target="_blank" title="Twitter">
            <Twitter size={18} />
          </IconButton>
        )}
        {project.website && (
           <IconButton href={project.website} target="_blank" title="Website">
             <Globe size={18} />
           </IconButton>
        )}
      </ButtonGroup>
    </DetailContainer>
  );
};

