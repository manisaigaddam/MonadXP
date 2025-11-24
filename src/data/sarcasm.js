// src/data/sarcasm.js
// Cool declarative comments for apps and folders

// Track used comments per app to avoid repeats
const usedComments = new Map();

// Helper to get random unused comment
const getRandomUnused = (comments, appId) => {
  if (!usedComments.has(appId)) {
    usedComments.set(appId, new Set());
  }
  const used = usedComments.get(appId);
  
  // If all comments used, reset
  if (used.size >= comments.length) {
    used.clear();
  }
  
  // Get unused comments
  const unused = comments.filter((_, idx) => !used.has(idx));
  const randomIdx = unused.length > 0 
    ? comments.indexOf(unused[Math.floor(Math.random() * unused.length)])
    : Math.floor(Math.random() * comments.length);
  
  used.add(randomIdx);
  return comments[randomIdx];
};

// Generate comments based on app data
export const getSarcasticComment = (project) => {
  if (!project) return "";
  
  const id = project.id?.toLowerCase() || '';
  const name = project.name || '';
  const description = project.description || '';
  const category = project.category || '';

  // Special Discovery North Star comments
  if (id === 'discovery' || name === 'Discovery' || name === 'Discovery - Your North Star') {
    const comments = [
      "Your North Star to navigate the Monad universe. Find your next dApp.",
      "The compass that guides you through thousands of apps. Discovery awaits.",
      "Navigate the Monad ecosystem with AI-powered recommendations.",
      "Your personal guide to finding the perfect dApp. Let the stars align.",
      "Discover apps you never knew existed. The universe of Monad awaits.",
      "Smart recommendations powered by your behavior. Your journey starts here.",
      "The North Star of Monad. Every great explorer needs a guide.",
      "Unlock achievements, discover trends, and find your next favorite app.",
      "3D visualizations, network graphs, and smart search. All in one place.",
      "Your gateway to the entire Monad ecosystem. Start exploring now."
    ];
    return getRandomUnused(comments, 'discovery');
  }

  // Folder comments
  if (id === 'defi' || name === 'DeFi') {
    const comments = [
      "Money moves faster than your blink of an eye here.",
      "DeFi transactions happen in milliseconds.",
      "This folder processes more value than some countries.",
      "DeFi apps that execute faster than you can think.",
      "Yield farming happens at the speed of light.",
      "DeFi ecosystem that never sleeps. Always working, always moving.",
      "Swaps happen here faster than neurons fire in your brain.",
      "The future of finance, all in one folder."
    ];
    return getRandomUnused(comments, 'defi');
  }

  if (id === 'infra' || name === 'Infra') {
    const comments = [
      "The backbone of web3, running 24/7.",
      "Infrastructure that powers billions in transactions.",
      "APIs and nodes working silently in the background.",
      "The foundation that makes everything else possible.",
      "Infrastructure that scales to infinity.",
      "Building blocks of the decentralized web.",
      "Infrastructure that never goes down. Reliable beyond belief.",
      "The invisible layer that powers everything."
    ];
    return getRandomUnused(comments, 'infra');
  }

  if (id === 'nfts' || name === 'NFTs & Gaming') {
    const comments = [
      "Digital art meets blockchain at light speed.",
      "NFTs and games that run faster than your reflexes.",
      "Digital ownership verified in milliseconds.",
      "Gaming experiences that feel instant.",
      "NFTs that trade faster than you can say 'sold'.",
      "Gaming worlds built on blockchain.",
      "Digital collectibles that move at the speed of thought.",
      "NFTs and games that never lag. Smooth as silk."
    ];
    return getRandomUnused(comments, 'nfts');
  }

  if (id === 'community' || name === 'Community') {
    const comments = [
      "Where millions connect in real-time.",
      "Community that spans the globe instantly.",
      "Social networks that run on blockchain.",
      "Conversations that happen at light speed.",
      "Community that never sleeps, always active.",
      "Connecting builders worldwide in milliseconds.",
      "Social layer of web3, always evolving.",
      "Community that moves faster than traditional social media."
    ];
    return getRandomUnused(comments, 'community');
  }

  if (id === 'favourites' || name === 'Favourites') {
    const comments = [
      "Your handpicked collection of the best. Curated perfection.",
      "The apps you actually use, all in one place.",
      "Your personal best-of-web3 collection.",
      "Favourites that load faster than your thoughts.",
      "The cream of the crop, right at your fingertips.",
      "Your go-to apps, always ready.",
      "Favourites that never disappoint.",
      "The best of the best, all here."
    ];
    return getRandomUnused(comments, 'favourites');
  }

  if (id === 'archive' || name === 'Archive') {
    const comments = [
      "Where history meets the future.",
      "Archive that preserves everything instantly.",
      "Past projects, future lessons.",
      "Archive that never forgets.",
      "Everything else, organized perfectly.",
      "The miscellaneous drawer of web3.",
      "Archive that loads faster than memory.",
      "History preserved at light speed."
    ];
    return getRandomUnused(comments, 'archive');
  }

  // App-specific comments based on descriptions
  const appComments = {
    "0x": [
      "130+ liquidity sources aggregated in real-time.",
      "Swaps that execute faster than your blink.",
      "Embed swaps anywhere, instantly.",
      "Best prices from 130+ sources in milliseconds.",
      "Liquidity aggregation at the speed of light.",
      "Optimal trade execution in the blink of an eye.",
      "Swaps embedded anywhere, working instantly.",
      "130+ sources, one seamless experience."
    ],
    "ausd": [
      "Stablecoin backed by VanEck and State Street. Rock solid.",
      "1:1 cash backing, verified instantly.",
      "Institutional-grade stability at your fingertips.",
      "Stablecoin that moves faster than traditional banks.",
      "Backed by real cash, verified on-chain.",
      "Stability you can trust, instantly.",
      "Professional management meets blockchain speed.",
      "The stablecoin that never wavers."
    ],
    "azex": [
      "100x leverage on any asset, instantly.",
      "AI copytrading that learns faster than you.",
      "Multi-chain DeFi hub in one click.",
      "Trade anything with 100x leverage in milliseconds.",
      "AI that trades faster than human reflexes.",
      "Complete DeFi experience at light speed.",
      "100x leverage, AI-powered, multi-chain.",
      "DeFi hub that works faster than thought."
    ],
    "aarna": [
      "AI meets tokenization at light speed.",
      "Next-gen DeFi management powered by AI.",
      "Structured products that adapt instantly.",
      "AI that manages assets faster than humans.",
      "Tokenization and AI working in perfect sync.",
      "DeFi management that thinks faster than you.",
      "AI-powered asset management at blockchain speed.",
      "The future of DeFi, happening now."
    ],
    "accountable": [
      "Yield data verified cryptographically, instantly.",
      "Trust built into the code, verified in real-time.",
      "Yield marketplace with verifiable data.",
      "Cryptographic verification at light speed.",
      "Transparency you can verify instantly.",
      "Yield data that never lies, always verified.",
      "Trust through cryptography, verified in milliseconds.",
      "The yield marketplace you can actually trust."
    ],
    "across-protocol": [
      "Crosschain bridge that moves $30B+ in volume.",
      "4M+ users bridging assets at light speed.",
      "Fast, cheap, secure bridging in milliseconds.",
      "Intent-based bridging that works instantly.",
      "$30B+ in volume, processed seamlessly.",
      "Crosschain transfers faster than traditional bridges.",
      "4M+ users trust this bridge.",
      "The bridge that moves billions, instantly."
    ],
    "acurast": [
      "Confidential AI running on thousands of phones.",
      "Privacy-focused computation at global scale.",
      "AI agents that respect your privacy, instantly.",
      "Hyper-personalized AI that works in milliseconds.",
      "Privacy and intelligence, perfectly balanced.",
      "AI computation distributed across the globe.",
      "Confidential AI that scales infinitely.",
      "The future of private computation."
    ],
    "aethonswap": [
      "CLAMM V4 DEX with zero slippage.",
      "Low-slippage trading at light speed.",
      "Intelligent design meets cutting-edge tech.",
      "Trades that execute with minimal slippage, instantly.",
      "Efficient liquidity management in real-time.",
      "Next-gen DEX that thinks ahead.",
      "Smart swaps that optimize automatically.",
      "The DEX that trades smarter, faster."
    ],
    "alchemy": [
      "End-to-end platform that scales infinitely.",
      "APIs that respond faster than your thoughts.",
      "Build web3 apps across all chains, instantly.",
      "Developer tools that work at light speed.",
      "Multi-chain support in one platform.",
      "APIs that never fail, always fast.",
      "The infrastructure behind every web3 app.",
      "Developer platform that scales to infinity."
    ],
    "allium": [
      "Blockchain data delivered in real-time.",
      "Analytics that update faster than you can read.",
      "Data streams that never stop flowing.",
      "Dashboards that refresh instantly.",
      "Blockchain insights at the speed of light.",
      "Data APIs that respond in milliseconds.",
      "Analytics that think faster than humans.",
      "The data layer that powers everything."
    ],
    "ambient": [
      "Spot AMM with MEV protection, instantly.",
      "Trades protected from MEV in real-time.",
      "Dynamic fees that adapt instantly.",
      "Modular hooks that execute at light speed.",
      "MEV protection that works seamlessly.",
      "The AMM that protects your trades.",
      "Smart liquidity that adapts automatically.",
      "Trading protection at blockchain speed."
    ]
  };

  // Check for specific app comments
  if (appComments[id]) {
    return getRandomUnused(appComments[id], id);
  }

  // Generate generic comments based on description/category
  const generateGenericComments = () => {
    const speedPhrases = [
      "faster than your blink",
      "faster than your thoughts",
      "at light speed",
      "in milliseconds",
      "instantly",
      "in real-time",
      "at the speed of light",
      "faster than neurons fire",
      "in the blink of an eye",
      "at thought speed"
    ];
    
    const randomSpeed = speedPhrases[Math.floor(Math.random() * speedPhrases.length)];
    
    if (category === 'DeFi') {
      return [
        `${name}. DeFi that moves ${randomSpeed}.`,
        `${name}. Financial innovation ${randomSpeed}.`,
        `${name}. DeFi protocol that works ${randomSpeed}.`,
        `${name}. ${description.substring(0, 40)}... ${randomSpeed}.`,
        `${name}. Making DeFi ${randomSpeed}.`,
        `${name}. DeFi innovation ${randomSpeed}.`,
        `${name}. Protocol that executes ${randomSpeed}.`,
        `${name}. DeFi that never slows down.`
      ];
    }
    
    if (category === 'Infra') {
      return [
        `${name}. Infrastructure ${randomSpeed}.`,
        `${name}. Building blocks that work ${randomSpeed}.`,
        `${name}. Infrastructure that scales ${randomSpeed}.`,
        `${name}. ${description.substring(0, 40)}... ${randomSpeed}.`,
        `${name}. Powering web3 ${randomSpeed}.`,
        `${name}. Infrastructure innovation ${randomSpeed}.`,
        `${name}. Tools that respond ${randomSpeed}.`,
        `${name}. The foundation that never fails.`
      ];
    }
    
    return [
      `${name}. ${description.substring(0, 50)}... ${randomSpeed}.`,
      `${name}. Innovation ${randomSpeed}.`,
      `${name}. ${description.substring(0, 45)}... ${randomSpeed}.`,
      `${name}. Working ${randomSpeed}.`,
      `${name}. ${description.substring(0, 50)}... ${randomSpeed}.`,
      `${name}. Technology ${randomSpeed}.`,
      `${name}. ${description.substring(0, 45)}... ${randomSpeed}.`,
      `${name}. Always moving ${randomSpeed}.`
    ];
  };

  const genericComments = generateGenericComments();
  return getRandomUnused(genericComments, id || name);
};
