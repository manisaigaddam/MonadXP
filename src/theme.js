export const theme = {
  colors: {
    primary: '#6E54FF',    // Monad Purple
    secondary: '#85E6FF',  // Monad Cyan/Blue
    accent: '#FF8EE4',     // Monad Pink
    background: '#0E091C', // Deep Violet/Black
    surface: '#FFFFFF',
    surfaceTrans: 'rgba(255, 255, 255, 0.95)',
    surfaceDark: '#1A1528',
    text: '#000000',
    textLight: '#FFFFFF',
    grey: '#cccccc',
    border: '#DDD7FE',
    folder: '#FFD700', // Gold-ish for folder icons if we use CSS icons
  },
  fonts: {
    main: "'Inter', sans-serif",
    mono: "'Roboto Mono', monospace",
    header: "'Inter', sans-serif",
  },
  shadows: {
    window: '0 15px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
    icon: '0 4px 4px rgba(0,0,0,0.3)',
  },
  zIndices: {
    desktop: 1,
    window: 10,
    popup: 100,
    taskbar: 1000,
    boot: 9999,
  }
};

