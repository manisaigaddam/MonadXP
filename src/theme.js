export const theme = {
  colors: {
    // Official Monad Palette & Retro Variations
    primary: '#836EF9',    // Monad Purple (Base)
    primaryDark: '#5F4BB6',
    primaryLight: '#A796FF',
    
    secondary: '#200052',  // Monad Blue/Dark Background
    accent: '#A0055D',     // Monad Berry
    
    offWhite: '#FBFAF9',   // Monad Off-White
    black: '#0E100F',      // Monad Black
    
    // Retro UI Colors
    winBorderLight: '#D8D0F2', // Highlight bevel
    winBorderDark: '#4A3880',  // Shadow bevel
    winBackground: '#E6E2F3',  // Window grey-purple
    
    desktopBg: '#200052',
    
    text: '#0E100F',
    textInvert: '#FBFAF9',
    
    folder: '#FFD700',
  },
  fonts: {
    main: "'Pixel', 'Courier New', monospace", // Fallback to mono for retro feel
    header: "'Pixel', 'Courier New', monospace", 
    mono: "'Roboto Mono', monospace",
  },
  shadows: {
    // The classic "3D" bevel look
    outset: 'inset 2px 2px 0px #D8D0F2, inset -2px -2px 0px #4A3880',
    inset: 'inset 2px 2px 0px #4A3880, inset -2px -2px 0px #D8D0F2',
    window: '4px 4px 10px rgba(0,0,0,0.5)',
  },
  zIndices: {
    desktop: 1,
    window: 10,
    taskbar: 1000,
    startMenu: 1001,
    boot: 9999,
    crt: 10000, // Overlay needs to be on top
  }
};
