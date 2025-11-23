import React, { useState, useEffect } from 'react';
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
  id, title, children, isActive, isMaximized, onClose, onFocus, onMinimize, onMaximize, defaultSize, defaultPosition 
}) => {
  const [position, setPosition] = useState({
    x: defaultPosition?.x || 100,
    y: defaultPosition?.y || 50
  });
  const [size, setSize] = useState({
    width: defaultSize?.width || 600,
    height: defaultSize?.height || 400
  });
  const [savedPosition, setSavedPosition] = useState(null);
  const [savedSize, setSavedSize] = useState(null);

  useEffect(() => {
    if (isMaximized) {
      // Save current position and size before maximizing
      if (!savedPosition) {
        setSavedPosition(position);
        setSavedSize(size);
      }
      // Maximize to full screen (minus taskbar)
      setPosition({ x: 0, y: 0 });
      setSize({ width: window.innerWidth, height: window.innerHeight - 40 });
    } else if (savedPosition && savedSize) {
      // Restore saved position and size
      setPosition(savedPosition);
      setSize(savedSize);
      setSavedPosition(null);
      setSavedSize(null);
    }
  }, [isMaximized]);

  const handleMinimize = (e) => {
    e.stopPropagation();
    if (onMinimize) onMinimize(id);
  };

  const handleMaximize = (e) => {
    e.stopPropagation();
    if (onMaximize) onMaximize(id);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    onClose(id);
  };

  return (
    <Rnd
      position={position}
      size={size}
      onDragStop={(e, d) => {
        if (!isMaximized) {
          setPosition({ x: d.x, y: d.y });
        }
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (!isMaximized) {
          setSize({
            width: ref.offsetWidth,
            height: ref.offsetHeight
          });
          setPosition({ x: position.x, y: position.y });
        }
      }}
      minWidth={isMaximized ? undefined : 300}
      minHeight={isMaximized ? undefined : 200}
      bounds="parent"
      disableDragging={isMaximized}
      disableResizing={isMaximized}
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
            <RetroButton onClick={handleMinimize} title="Minimize">
              <Minus />
            </RetroButton>
            <RetroButton onClick={handleMaximize} title={isMaximized ? "Restore" : "Maximize"}>
              <Square size={10} />
            </RetroButton>
            <RetroButton onClick={handleClose} title="Close">
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
