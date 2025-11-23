import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { GlobalStyle } from './styles/GlobalStyle';
import { Desktop } from './components/Desktop';
import { BootScreen } from './components/BootScreen';

function App() {
  const [booted, setBooted] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {!booted ? (
        <BootScreen onComplete={() => setBooted(true)} />
      ) : (
        <Desktop />
      )}
    </ThemeProvider>
  );
}

export default App;

