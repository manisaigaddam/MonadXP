import React from 'react';
import { Rnd } from 'react-rnd';
import styled from 'styled-components';
import { X, Minus, Maximize2 } from 'lucide-react';

const WindowContainer = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.theme.colors.surfaceTrans};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.window};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backdrop-filter: blur(10px);
`;

const TitleBar = styled.div`
  height: 32px;
  background: ${props => props.isActive ? props.theme.colors.primary : '#333'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  cursor: default; /* Handle drag handled by Rnd */
  font-family: ${props => props.theme.fonts.header};
  font-size: 14px;
  font-weight: bold;
  transition: background 0.2s;
`;

const Controls = styled.div`
  display: flex;
  gap: 8px;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: white;
  padding: 2px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255,255,255,0.2);
  }
`;

const Content = styled.div`
  flex: 1;
  overflow: auto;
  position: relative;
  background: ${props => props.isTerminal ? '#000' : 'transparent'};
  color: ${props => props.isTerminal ? '#0f0' : 'inherit'};
`;

export const Window = ({ 
  id, title, children, isActive, onClose, onFocus, defaultSize, defaultPosition, isTerminal 
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
          <span>{title}</span>
          <Controls>
            <ControlButton><Minus size={14} /></ControlButton>
            <ControlButton><Maximize2 size={14} /></ControlButton>
            <ControlButton onClick={(e) => { e.stopPropagation(); onClose(id); }}>
              <X size={14} />
            </ControlButton>
          </Controls>
        </TitleBar>
        <Content isTerminal={isTerminal}>
          {children}
        </Content>
      </WindowContainer>
    </Rnd>
  );
};

