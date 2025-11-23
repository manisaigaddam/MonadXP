import React from 'react';
import { Rnd } from 'react-rnd';
import styled from 'styled-components';
import { X, Minus, Square } from 'lucide-react';

const WindowContainer = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.theme.colors.winBackground};
  border: 2px solid;
  /* The Retro Bevel Look */
  border-color: ${props => props.theme.colors.winBorderLight} ${props => props.theme.colors.winBorderDark} ${props => props.theme.colors.winBorderDark} ${props => props.theme.colors.winBorderLight};
  box-shadow: ${props => props.theme.shadows.window};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TitleBar = styled.div`
  height: 32px;
  /* Gradient Title Bar */
  background: linear-gradient(90deg, ${props => props.isActive ? props.theme.colors.primary : '#666'}, ${props => props.isActive ? props.theme.colors.secondary : '#333'});
  color: ${props => props.theme.colors.textInvert};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
  cursor: default;
  font-family: ${props => props.theme.fonts.header};
  font-size: 16px;
  letter-spacing: 1px;
  user-select: none;
`;

const TitleText = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
  padding-left: 4px;
`;

const Controls = styled.div`
  display: flex;
  gap: 2px;
`;

const RetroButton = styled.button`
  width: 20px;
  height: 20px;
  background: ${props => props.theme.colors.winBackground};
  border: 1px solid;
  border-color: #fff #000 #000 #fff; /* Outset */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  
  &:active {
    border-color: #000 #fff #fff #000; /* Inset */
    transform: translate(1px, 1px);
  }

  svg {
    color: #000;
    width: 12px;
    height: 12px;
  }
`;

const Content = styled.div`
  flex: 1;
  overflow: auto;
  position: relative;
  padding: 2px;
`;

export const Window = ({ 
  id, title, children, isActive, onClose, onFocus, defaultSize, defaultPosition 
}) => {
  return (
    <Rnd
      default={{
        x: defaultPosition?.x || 100,
        y: defaultPosition?.y || 50,
        width: defaultSize?.width || 600,
        height: defaultSize?.height || 400,
      }}
      minWidth={300}
      minHeight={200}
      bounds="parent"
      onDragStart={onFocus}
      onClick={onFocus}
      dragHandleClassName="window-handle"
      style={{ zIndex: isActive ? 100 : 10 }}
    >
      <WindowContainer onClick={(e) => e.stopPropagation()}>
        <TitleBar isActive={isActive} className="window-handle">
          <TitleText>
             {/* Tiny Monad Logo if needed, or just text */}
             {title}
          </TitleText>
          <Controls>
            <RetroButton><Minus /></RetroButton>
            <RetroButton><Square size={10} /></RetroButton>
            <RetroButton onClick={(e) => { e.stopPropagation(); onClose(id); }}>
              <X />
            </RetroButton>
          </Controls>
        </TitleBar>
        <Content>
          {children}
        </Content>
      </WindowContainer>
    </Rnd>
  );
};
