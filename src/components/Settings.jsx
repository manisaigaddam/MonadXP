import React from 'react';
import styled from 'styled-components';
import { MessageSquare, Type, Volume2, VolumeX, Disc, Monitor } from 'lucide-react';

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.winBackground};
  height: 100%;
  overflow-y: auto;
`;

const Title = styled.h1`
  font-family: ${props => props.theme.fonts.header};
  color: ${props => props.theme.colors.primary};
  font-size: 28px;
  margin-bottom: 20px;
  text-shadow: 2px 2px 0px #000;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-family: ${props => props.theme.fonts.header};
  color: ${props => props.theme.colors.secondary};
  font-size: 20px;
  margin-bottom: 15px;
  border-bottom: 2px solid ${props => props.theme.colors.winBorderDark};
  padding-bottom: 8px;
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background: rgba(255, 255, 255, 0.3);
  border: 2px solid ${props => props.theme.colors.winBorderDark};
  margin-bottom: 10px;
  gap: 15px;
`;

const SettingInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SettingLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SettingName = styled.span`
  font-family: ${props => props.theme.fonts.header};
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const SettingDescription = styled.span`
  font-family: ${props => props.theme.fonts.main};
  font-size: 12px;
  color: #666;
`;

const ToggleButton = styled.button`
  padding: 8px 20px;
  background: ${props => props.enabled ? props.theme.colors.primary : '#ccc'};
  color: ${props => props.enabled ? 'white' : '#666'};
  font-family: ${props => props.theme.fonts.header};
  font-weight: bold;
  border: 2px solid #000;
  box-shadow: ${props => props.enabled ? '4px 4px 0 #000' : '2px 2px 0 #000'};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.1s;
  min-width: 80px;

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #000;
  }

  &:hover {
    background: ${props => props.enabled ? props.theme.colors.secondary : '#bbb'};
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${props => props.theme.colors.primary};
  border-radius: 4px;
  color: white;
`;

export const Settings = ({ 
  typingBoxesEnabled, 
  onToggleTypingBoxes,
  typingSoundEnabled,
  onToggleTypingSound,
  isMusicPlaying,
  onToggleMusic
}) => {
  return (
    <Container>
      <Title>Settings</Title>

      <Section>
        <SectionTitle>Audio</SectionTitle>
        
        <SettingItem>
          <SettingInfo>
            <IconWrapper>
              <Disc size={18} />
            </IconWrapper>
            <SettingLabel>
              <SettingName>Background Music</SettingName>
              <SettingDescription>Play background music while using Monad XP</SettingDescription>
            </SettingLabel>
          </SettingInfo>
          <ToggleButton 
            enabled={isMusicPlaying} 
            onClick={onToggleMusic}
          >
            {isMusicPlaying ? 'ON' : 'OFF'}
          </ToggleButton>
        </SettingItem>
      </Section>

      <Section>
        <SectionTitle>Hover Effects</SectionTitle>
        
        <SettingItem>
          <SettingInfo>
            <IconWrapper>
              <MessageSquare size={18} />
            </IconWrapper>
            <SettingLabel>
              <SettingName>Typing Boxes</SettingName>
              <SettingDescription>Show typing boxes when hovering over apps and folders</SettingDescription>
            </SettingLabel>
          </SettingInfo>
          <ToggleButton 
            enabled={typingBoxesEnabled} 
            onClick={onToggleTypingBoxes}
          >
            {typingBoxesEnabled ? 'ON' : 'OFF'}
          </ToggleButton>
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <IconWrapper>
              <Type size={18} />
            </IconWrapper>
            <SettingLabel>
              <SettingName>Typing Sound</SettingName>
              <SettingDescription>Play keyboard typing sounds when text appears</SettingDescription>
            </SettingLabel>
          </SettingInfo>
          <ToggleButton 
            enabled={typingSoundEnabled} 
            onClick={onToggleTypingSound}
          >
            {typingSoundEnabled ? 'ON' : 'OFF'}
          </ToggleButton>
        </SettingItem>
      </Section>

      <Section>
        <SectionTitle>About</SectionTitle>
        <SettingItem>
          <SettingInfo>
            <IconWrapper>
              <Monitor size={18} />
            </IconWrapper>
            <SettingLabel>
              <SettingName>Monad XP</SettingName>
              <SettingDescription>Version 1.0.0 - Built for the Monad ecosystem</SettingDescription>
            </SettingLabel>
          </SettingInfo>
        </SettingItem>
      </Section>
    </Container>
  );
};

