// Gamification System - Achievements and Badges

export const ACHIEVEMENTS = {
  FIRST_CLICK: {
    id: 'first_click',
    name: 'First Steps',
    description: 'Opened your first app',
    icon: '🎯',
    points: 10
  },
  EXPLORER: {
    id: 'explorer',
    name: 'Explorer',
    description: 'Opened 10 different apps',
    icon: '🗺️',
    points: 50
  },
  POWER_USER: {
    id: 'power_user',
    name: 'Power User',
    description: 'Opened 50 different apps',
    icon: '⚡',
    points: 200
  },
  COLLECTOR: {
    id: 'collector',
    name: 'Collector',
    description: 'Added 5 apps to favorites',
    icon: '⭐',
    points: 100
  },
  CURATOR: {
    id: 'curator',
    name: 'Curator',
    description: 'Added 20 apps to favorites',
    icon: '👑',
    points: 500
  },
  DEFI_MASTER: {
    id: 'defi_master',
    name: 'DeFi Master',
    description: 'Explored 10 DeFi apps',
    icon: '💰',
    points: 150
  },
  GAMER: {
    id: 'gamer',
    name: 'Gamer',
    description: 'Explored 5 Gaming apps',
    icon: '🎮',
    points: 100
  },
  INFRA_BUILDER: {
    id: 'infra_builder',
    name: 'Infrastructure Builder',
    description: 'Explored 10 Infrastructure apps',
    icon: '🏗️',
    points: 150
  },
  MONAD_NATIVE: {
    id: 'monad_native',
    name: 'Monad Native',
    description: 'Explored 10 Monad-native apps',
    icon: '🚀',
    points: 300
  },
  DISCOVERY_MASTER: {
    id: 'discovery_master',
    name: 'Discovery Master',
    description: 'Used Discovery mode 10 times',
    icon: '🔍',
    points: 200
  }
};

// Check and unlock achievements
export const checkAchievements = () => {
  const clicks = JSON.parse(localStorage.getItem('appClicks') || '{}');
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  const views = JSON.parse(localStorage.getItem('appViews') || '{}');
  const allProjects = JSON.parse(localStorage.getItem('allProjects') || '[]');
  
  const unlocked = JSON.parse(localStorage.getItem('achievements') || '[]');
  const newAchievements = [];
  
  // Count unique apps clicked
  const uniqueAppsClicked = Object.keys(clicks).length;
  
  // Count apps by category
  const clickedAppIds = Object.keys(clicks);
  const clickedApps = allProjects.filter(p => clickedAppIds.includes(p.id));
  const defiCount = clickedApps.filter(a => a.category === 'DeFi').length;
  const gamingCount = clickedApps.filter(a => a.category === 'NFTs & Gaming').length;
  const infraCount = clickedApps.filter(a => a.category === 'Infra').length;
  const monadNativeCount = clickedApps.filter(a => a.onMonad).length;
  
  // Discovery usage
  const discoveryUsage = parseInt(localStorage.getItem('discoveryUsage') || '0');
  
  // Check each achievement
  if (uniqueAppsClicked >= 1 && !unlocked.includes(ACHIEVEMENTS.FIRST_CLICK.id)) {
    newAchievements.push(ACHIEVEMENTS.FIRST_CLICK);
    unlocked.push(ACHIEVEMENTS.FIRST_CLICK.id);
  }
  
  if (uniqueAppsClicked >= 10 && !unlocked.includes(ACHIEVEMENTS.EXPLORER.id)) {
    newAchievements.push(ACHIEVEMENTS.EXPLORER);
    unlocked.push(ACHIEVEMENTS.EXPLORER.id);
  }
  
  if (uniqueAppsClicked >= 50 && !unlocked.includes(ACHIEVEMENTS.POWER_USER.id)) {
    newAchievements.push(ACHIEVEMENTS.POWER_USER);
    unlocked.push(ACHIEVEMENTS.POWER_USER.id);
  }
  
  if (favorites.length >= 5 && !unlocked.includes(ACHIEVEMENTS.COLLECTOR.id)) {
    newAchievements.push(ACHIEVEMENTS.COLLECTOR);
    unlocked.push(ACHIEVEMENTS.COLLECTOR.id);
  }
  
  if (favorites.length >= 20 && !unlocked.includes(ACHIEVEMENTS.CURATOR.id)) {
    newAchievements.push(ACHIEVEMENTS.CURATOR);
    unlocked.push(ACHIEVEMENTS.CURATOR.id);
  }
  
  if (defiCount >= 10 && !unlocked.includes(ACHIEVEMENTS.DEFI_MASTER.id)) {
    newAchievements.push(ACHIEVEMENTS.DEFI_MASTER);
    unlocked.push(ACHIEVEMENTS.DEFI_MASTER.id);
  }
  
  if (gamingCount >= 5 && !unlocked.includes(ACHIEVEMENTS.GAMER.id)) {
    newAchievements.push(ACHIEVEMENTS.GAMER);
    unlocked.push(ACHIEVEMENTS.GAMER.id);
  }
  
  if (infraCount >= 10 && !unlocked.includes(ACHIEVEMENTS.INFRA_BUILDER.id)) {
    newAchievements.push(ACHIEVEMENTS.INFRA_BUILDER);
    unlocked.push(ACHIEVEMENTS.INFRA_BUILDER.id);
  }
  
  if (monadNativeCount >= 10 && !unlocked.includes(ACHIEVEMENTS.MONAD_NATIVE.id)) {
    newAchievements.push(ACHIEVEMENTS.MONAD_NATIVE);
    unlocked.push(ACHIEVEMENTS.MONAD_NATIVE.id);
  }
  
  if (discoveryUsage >= 10 && !unlocked.includes(ACHIEVEMENTS.DISCOVERY_MASTER.id)) {
    newAchievements.push(ACHIEVEMENTS.DISCOVERY_MASTER);
    unlocked.push(ACHIEVEMENTS.DISCOVERY_MASTER.id);
  }
  
  // Save unlocked achievements
  if (newAchievements.length > 0) {
    localStorage.setItem('achievements', JSON.stringify(unlocked));
    
    // Update total points
    const currentPoints = parseInt(localStorage.getItem('totalPoints') || '0');
    const newPoints = newAchievements.reduce((sum, ach) => sum + ach.points, 0);
    localStorage.setItem('totalPoints', (currentPoints + newPoints).toString());
  }
  
  return newAchievements;
};

// Get user stats
export const getUserStats = () => {
  const clicks = JSON.parse(localStorage.getItem('appClicks') || '{}');
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  const unlocked = JSON.parse(localStorage.getItem('achievements') || '[]');
  const totalPoints = parseInt(localStorage.getItem('totalPoints') || '0');
  
  return {
    appsClicked: Object.keys(clicks).length,
    totalClicks: Object.values(clicks).reduce((a, b) => a + b, 0),
    favoritesCount: favorites.length,
    achievementsUnlocked: unlocked.length,
    totalPoints,
    level: Math.floor(totalPoints / 100) + 1
  };
};

// Track discovery usage
export const trackDiscoveryUsage = () => {
  const current = parseInt(localStorage.getItem('discoveryUsage') || '0');
  localStorage.setItem('discoveryUsage', (current + 1).toString());
};

