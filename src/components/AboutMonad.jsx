import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Globe, Twitter, Cpu, Zap, Database, Layers } from 'lucide-react';

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: ${props => props.theme.colors.winBackground};
  height: 100%;
  overflow-y: auto;
`;

const Logo = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-bottom: 20px;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
  image-rendering: pixelated;
`;

const Title = styled.h1`
  font-family: ${props => props.theme.fonts.header};
  color: ${props => props.theme.colors.primary};
  font-size: 32px;
  margin-bottom: 10px;
  text-shadow: 2px 2px 0px #000;
`;

const Version = styled.span`
  font-family: ${props => props.theme.fonts.mono};
  background: #000;
  color: ${props => props.theme.colors.primary};
  padding: 4px 8px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
`;

const Description = styled.p`
  font-family: ${props => props.theme.fonts.main};
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 30px;
  max-width: 500px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  width: 100%;
  max-width: 500px;
  margin-bottom: 30px;
`;

const StatBox = styled.div`
  border: 2px solid ${props => props.theme.colors.winBorderDark};
  background: rgba(255,255,255,0.5);
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  
  span {
    font-weight: bold;
    color: ${props => props.theme.colors.secondary};
  }
  
  small {
    font-size: 12px;
    color: #666;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
`;

const SocialButton = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: ${props => props.theme.colors.primary};
  color: white;
  text-decoration: none;
  font-family: ${props => props.theme.fonts.header};
  font-weight: bold;
  border: 2px solid #000;
  box-shadow: 4px 4px 0 #000;
  transition: transform 0.1s;

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #000;
  }
`;

export const AboutMonad = () => {
  return (
    <Container>
      <Logo src="/logo.png" alt="Monad Logo" />
      <Title>MONAD</Title>
      {/* <Version>v1.0.0-beta</Version> */}
      
      <Description>
        Monad is a high-performance Ethereum-compatible L1 blockchain designed to bring parallel execution and superscalar pipelining to the EVM. 
        <br/><br/>
        Pure. Powerful. Purple.
      </Description>

      <Grid>
        <StatBox>
          <Zap size={24} color="#836EF9" />
          <span>10,000</span>
          <small>TPS</small>
        </StatBox>
        <StatBox>
          <Database size={24} color="#836EF9" />
          <span>MonadDb</span>
          <small>Custom State DB</small>
        </StatBox>
        <StatBox>
          <Layers size={24} color="#836EF9" />
          <span>1s</span>
          <small>Block Time</small>
        </StatBox>
        <StatBox>
          <Cpu size={24} color="#836EF9" />
          <span>Async</span>
          <small>Execution</small>
        </StatBox>
      </Grid>

      <ButtonGroup>
        <SocialButton href="https://monad.xyz" target="_blank">
          <Globe size={18} /> Website
        </SocialButton>
        <SocialButton href="https://twitter.com/monad_xyz" target="_blank">
          <Twitter size={18} /> Twitter
        </SocialButton>
      </ButtonGroup>
    </Container>
  );
};

