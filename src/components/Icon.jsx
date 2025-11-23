import React from 'react';
import styled from 'styled-components';

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90px;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  background-color: ${props => props.selected ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.selected ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const IconImage = styled.div`
  width: 48px;
  height: 48px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(${props => props.theme.shadows.icon});
  }

  svg {
    width: 100%;
    height: 100%;
    color: ${props => props.color || props.theme.colors.folder};
    filter: drop-shadow(${props => props.theme.shadows.icon});
  }
`;

const IconLabel = styled.span`
  color: ${props => props.theme.colors.textLight};
  font-size: 14px;
  text-align: center;
  text-shadow: 0 1px 3px rgba(0,0,0,0.8);
  font-family: ${props => props.theme.fonts.main};
  word-break: break-word;
  line-height: 1.2;
`;

export const Icon = ({ label, icon, onClick, selected, color, CustomIcon }) => {
  return (
    <IconWrapper onClick={onClick} selected={selected}>
      <IconImage color={color}>
        {CustomIcon ? <CustomIcon size={48} /> : <img src={icon} alt={label} />}
      </IconImage>
      <IconLabel>{label}</IconLabel>
    </IconWrapper>
  );
};

