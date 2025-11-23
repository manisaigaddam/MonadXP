import React from 'react';
import styled from 'styled-components';

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 86px;
  padding: 4px;
  cursor: pointer;
  margin-bottom: 16px;
  
  /* Windows 95 selection style: Dotted border + Blue background */
  border: 1px dotted ${props => props.selected ? props.theme.colors.primaryLight : 'transparent'};
  
  &:hover {
    filter: brightness(1.1);
  }
  
  &:active {
    filter: brightness(0.9);
  }
`;

const IconImage = styled.div`
  width: 48px;
  height: 48px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: pixelated;
    /* If selected, maybe darken slightly */
    ${props => props.selected && `
      filter: sepia(100%) hue-rotate(190deg) saturate(500%);
    `}
  }

  svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(2px 2px 0px rgba(0,0,0,0.5));
  }
`;

const IconLabel = styled.span`
  color: ${props => props.selected ? '#fff' : props.theme.colors.textInvert};
  background-color: ${props => props.selected ? props.theme.colors.primary : 'transparent'};
  font-size: 12px;
  text-align: center;
  font-family: ${props => props.theme.fonts.main};
  line-height: 1.3;
  padding: 2px 4px;
  margin-top: 2px;
  
  /* Truncate long names */
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  text-shadow: 1px 1px 0 #000;
`;

// Custom Pixel Art Folder Icon (SVG)
const PixelFolderIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Back of folder */}
    <path d="M2 6H12L14 8H30V26H2V6Z" fill="#E8C766" stroke="black" strokeWidth="1"/>
    {/* Front of folder (lighter) */}
    <path d="M2 10H30V26H2V10Z" fill="#FFD700" stroke="black" strokeWidth="1"/>
    {/* Tab highlight */}
    <path d="M3 11H29V25H3V11Z" fill="#FFE66D" fillOpacity="0.5"/>
  </svg>
);

const PixelArchiveIcon = () => (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="24" height="20" fill="#A0555D" stroke="black" strokeWidth="1"/>
      <rect x="3" y="5" width="26" height="6" fill="#D0757D" stroke="black" strokeWidth="1"/>
      <line x1="4" y1="16" x2="28" y2="16" stroke="black" strokeWidth="1"/>
      <line x1="4" y1="21" x2="28" y2="21" stroke="black" strokeWidth="1"/>
    </svg>
);

const PixelAppIcon = ({ src, fallbackIcon: Fallback }) => {
    if (src) {
        return <img src={src} alt="icon" onError={(e) => {e.target.style.display='none';}} />;
    }
    return <Fallback size={32} color="#ccc" />;
};

export const Icon = ({ label, icon, onClick, selected, color, CustomIcon, isFolder }) => {
  // Decide which icon to render
  let RenderedIcon;
  
  if (CustomIcon) {
      // CustomIcon takes priority, even for folders
      RenderedIcon = <CustomIcon size={32} color={color} />;
  } else if (isFolder) {
      RenderedIcon = label === 'Archive' ? <PixelArchiveIcon /> : <PixelFolderIcon />;
  } else {
      RenderedIcon = <img src={icon} alt={label} />;
  }

  return (
    <IconWrapper onClick={onClick} selected={selected}>
      <IconImage selected={selected}>
        {RenderedIcon}
      </IconImage>
      <IconLabel selected={selected}>{label}</IconLabel>
    </IconWrapper>
  );
};
