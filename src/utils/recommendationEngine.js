// Recommendation Engine - Tracks user behavior and provides smart recommendations

// User behavior tracking
export const trackUserBehavior = {
  // Track app view
  trackView: (appId) => {
    const views = JSON.parse(localStorage.getItem('appViews') || '{}');
    views[appId] = (views[appId] || 0) + 1;
    localStorage.setItem('appViews', JSON.stringify(views));
    
    // Track timestamp
    const timestamps = JSON.parse(localStorage.getItem('appViewTimestamps') || '{}');
    timestamps[appId] = Date.now();
    localStorage.setItem('appViewTimestamps', JSON.stringify(timestamps));
  },

  // Track app click/open
  trackClick: (appId) => {
    const clicks = JSON.parse(localStorage.getItem('appClicks') || '{}');
    clicks[appId] = (clicks[appId] || 0) + 1;
    localStorage.setItem('appClicks', JSON.stringify(clicks));
  },

  // Track favorite
  trackFavorite: (appId, isFavorite) => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const favoriteHistory = JSON.parse(localStorage.getItem('favoriteHistory') || '[]');
    
    if (isFavorite && !favorites.includes(appId)) {
      favoriteHistory.push({ appId, timestamp: Date.now() });
      localStorage.setItem('favoriteHistory', JSON.stringify(favoriteHistory));
    }
  },

  // Get user preferences (categories, tags)
  getUserPreferences: () => {
    const views = JSON.parse(localStorage.getItem('appViews') || '{}');
    const clicks = JSON.parse(localStorage.getItem('appClicks') || '{}');
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    return { views, clicks, favorites };
  }
};

// Recommendation algorithms
export const getRecommendations = (allProjects, limit = 10) => {
  const { views, clicks, favorites } = trackUserBehavior.getUserPreferences();
  
  // Calculate scores for each project
  const scoredProjects = allProjects.map(project => {
    let score = 0;
    
    // Base score from views (weighted less)
    score += (views[project.id] || 0) * 0.5;
    
    // Higher score from clicks (user actively engaged)
    score += (clicks[project.id] || 0) * 2;
    
    // Boost for favorites
    if (favorites.includes(project.id)) {
      score += 10;
    }
    
    // Boost for Monad-native apps
    if (project.onMonad) {
      score += 3;
    }
    
    // Recency boost (recently viewed apps get slight boost)
    const timestamps = JSON.parse(localStorage.getItem('appViewTimestamps') || '{}');
    const lastView = timestamps[project.id];
    if (lastView) {
      const daysSinceView = (Date.now() - lastView) / (1000 * 60 * 60 * 24);
      if (daysSinceView < 7) {
        score += 2;
      }
    }
    
    return { ...project, recommendationScore: score };
  });
  
  // Sort by score and return top recommendations
  return scoredProjects
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, limit);
};

// Get similar apps based on tags and category
export const getSimilarApps = (targetProject, allProjects, limit = 5) => {
  if (!targetProject) return [];
  
  const scored = allProjects
    .filter(p => p.id !== targetProject.id)
    .map(project => {
      let similarity = 0;
      
      // Category match
      if (project.category === targetProject.category) {
        similarity += 5;
      }
      
      // Tag matches
      const targetTags = targetProject.tags || [];
      const projectTags = project.tags || [];
      const commonTags = targetTags.filter(tag => projectTags.includes(tag));
      similarity += commonTags.length * 3;
      
      // Type match
      if (project.type === targetProject.type) {
        similarity += 2;
      }
      
      // Monad native boost
      if (project.onMonad && targetProject.onMonad) {
        similarity += 1;
      }
      
      return { ...project, similarity };
    })
    .filter(p => p.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
  
  return scored;
};

// Get trending apps (based on recent activity)
export const getTrendingApps = (allProjects, limit = 10) => {
  const views = JSON.parse(localStorage.getItem('appViews') || '{}');
  const clicks = JSON.parse(localStorage.getItem('appClicks') || '{}');
  const timestamps = JSON.parse(localStorage.getItem('appViewTimestamps') || '{}');
  
  const now = Date.now();
  const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
  
  const trending = allProjects
    .map(project => {
      const lastView = timestamps[project.id];
      let trendScore = 0;
      
      // Recent views get higher weight
      if (lastView && lastView > oneWeekAgo) {
        trendScore += (views[project.id] || 0) * 3;
        trendScore += (clicks[project.id] || 0) * 5;
      } else {
        trendScore += (views[project.id] || 0) * 1;
        trendScore += (clicks[project.id] || 0) * 2;
      }
      
      // Boost for Monad native
      if (project.onMonad) {
        trendScore += 2;
      }
      
      return { ...project, trendScore };
    })
    .filter(p => p.trendScore > 0)
    .sort((a, b) => b.trendScore - a.trendScore)
    .slice(0, limit);
  
  return trending;
};

// Get personalized category recommendations
export const getCategoryRecommendations = (allProjects) => {
  const { views, clicks, favorites } = trackUserBehavior.getUserPreferences();
  
  const categoryScores = {};
  
  allProjects.forEach(project => {
    const category = project.category || 'Other';
    if (!categoryScores[category]) {
      categoryScores[category] = 0;
    }
    
    categoryScores[category] += (views[project.id] || 0) * 0.5;
    categoryScores[category] += (clicks[project.id] || 0) * 2;
    if (favorites.includes(project.id)) {
      categoryScores[category] += 5;
    }
  });
  
  return Object.entries(categoryScores)
    .map(([category, score]) => ({ category, score }))
    .sort((a, b) => b.score - a.score);
};

