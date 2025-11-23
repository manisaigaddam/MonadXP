import React from 'react';
import styled from 'styled-components';

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  padding: 5px;
  cursor: pointer;
  margin-bottom: 10px;
  
  /* Dotted border on selection like Windows 95 */
  border: 1px dotted ${props => props.selected ? props.theme.colors.primaryLight : 'transparent'};
  background-color: ${props => props.selected ? props.theme.colors.primary : 'transparent'};
  
  &:hover {
    filter: brightness(1.2);
  }
`;

const IconImage = styled.div`
  width: 32px;
  height: 32px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: pixelated;
  }

  svg {
    width: 100%;
    height: 100%;
    color: ${props => props.color || props.theme.colors.folder};
    filter: drop-shadow(1px 1px 0 #000);
  }
`;

const IconLabel = styled.span`
  color: ${props => props.selected ? '#fff' : props.theme.colors.textInvert};
  background-color: ${props => props.selected ? props.theme.colors.primary : 'transparent'};
  font-size: 12px;
  text-align: center;
  font-family: ${props => props.theme.fonts.main};
  line-height: 1.2;
  padding: 1px 3px;
  text-shadow: 1px 1px 0 #000;
`;

export const Icon = ({ label, icon, onClick, selected, color, CustomIcon }) => {
  return (
    <IconWrapper onClick={onClick} selected={selected}>
      <IconImage color={color}>
        {CustomIcon ? <CustomIcon size={32} /> : <img src={icon} alt={label} onError={(e) => {e.target.style.display='none';}} />}
      </IconImage>
      <IconLabel selected={selected}>{label}</IconLabel>
    </IconWrapper>
  );
};
