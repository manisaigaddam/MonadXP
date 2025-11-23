import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  /* Import a Pixel Font if possible, otherwise use fallback */
  @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

  * {
    box-sizing: border-box;
    cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewport='0 0 24 24' fill='black' stroke='white' stroke-width='1'><path d='M0,0 L0,16 L4,12 L8,20 L12,18 L8,10 L16,10 L0,0 z'/></svg>"), auto;
  }

  body {
    font-family: 'VT323', monospace; /* Retro Font */
    background-color: ${props => props.theme.colors.desktopBg};
    color: ${props => props.theme.colors.text};
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    user-select: none;
    -webkit-font-smoothing: none; /* Pixel crispness */
  }

  /* CRT Scanline Animation */
  @keyframes scanline {
    0% { background-position: 0 0; }
    100% { background-position: 0 100%; }
  }

  /* The CRT Overlay */
  body::after {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
    z-index: ${props => props.theme.zIndices.crt};
    background-size: 100% 2px, 3px 100%;
    pointer-events: none; /* Let clicks pass through */
  }

  /* Scrollbar - Retro Style */
  ::-webkit-scrollbar {
    width: 16px;
    height: 16px;
    background: ${props => props.theme.colors.winBackground};
  }
  ::-webkit-scrollbar-track {
    box-shadow: ${props => props.theme.shadows.inset};
  }
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.outset};
  }
  ::-webkit-scrollbar-button {
    background: ${props => props.theme.colors.winBackground};
    box-shadow: ${props => props.theme.shadows.outset};
    height: 16px;
    width: 16px;
  }
`;
