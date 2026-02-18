// Badge definitions and earning logic

export const BADGE_TIERS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum'
};

export const BADGES = {
  // Score-based badges
  FIRST_STEPS: {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Score your first 10 points',
    icon: '🎯',
    tier: BADGE_TIERS.BRONZE,
    requirement: { type: 'score', value: 10 }
  },
  RISING_STAR: {
    id: 'rising_star',
    name: 'Rising Star',
    description: 'Reach 50 points',
    icon: '⭐',
    tier: BADGE_TIERS.BRONZE,
    requirement: { type: 'score', value: 50 }
  },
  SKILLED_DEFENDER: {
    id: 'skilled_defender',
    name: 'Skilled Defender',
    description: 'Reach 150 points',
    icon: '🛡️',
    tier: BADGE_TIERS.SILVER,
    requirement: { type: 'score', value: 150 }
  },
  EXPERT_GUARDIAN: {
    id: 'expert_guardian',
    name: 'Expert Guardian',
    description: 'Reach 300 points',
    icon: '🏆',
    tier: BADGE_TIERS.SILVER,
    requirement: { type: 'score', value: 300 }
  },
  MASTER_PROTECTOR: {
    id: 'master_protector',
    name: 'Master Protector',
    description: 'Reach 500 points',
    icon: '👑',
    tier: BADGE_TIERS.GOLD,
    requirement: { type: 'score', value: 500 }
  },
  
  // Attempt-based badges
  BEGINNER: {
    id: 'beginner',
    name: 'Beginner',
    description: 'Complete 5 scenarios',
    icon: '📧',
    tier: BADGE_TIERS.BRONZE,
    requirement: { type: 'attempts', value: 5 }
  },
  EXPERIENCED: {
    id: 'experienced',
    name: 'Experienced',
    description: 'Complete 20 scenarios',
    icon: '💪',
    tier: BADGE_TIERS.SILVER,
    requirement: { type: 'attempts', value: 20 }
  },
  VETERAN: {
    id: 'veteran',
    name: 'Veteran',
    description: 'Complete 50 scenarios',
    icon: '🎖️',
    tier: BADGE_TIERS.GOLD,
    requirement: { type: 'attempts', value: 50 }
  },
  LEGEND: {
    id: 'legend',
    name: 'Legend',
    description: 'Complete 100 scenarios',
    icon: '🏅',
    tier: BADGE_TIERS.PLATINUM,
    requirement: { type: 'attempts', value: 100 }
  },
  
  // Success rate badges
  SHARP_EYE: {
    id: 'sharp_eye',
    name: 'Sharp Eye',
    description: 'Maintain 70% success rate (min 10 attempts)',
    icon: '👁️',
    tier: BADGE_TIERS.SILVER,
    requirement: { type: 'success_rate', value: 70, minAttempts: 10 }
  },
  EAGLE_VISION: {
    id: 'eagle_vision',
    name: 'Eagle Vision',
    description: 'Maintain 85% success rate (min 20 attempts)',
    icon: '🦅',
    tier: BADGE_TIERS.GOLD,
    requirement: { type: 'success_rate', value: 85, minAttempts: 20 }
  },
  PERFECT_GUARDIAN: {
    id: 'perfect_guardian',
    name: 'Perfect Guardian',
    description: 'Maintain 95% success rate (min 30 attempts)',
    icon: '💎',
    tier: BADGE_TIERS.PLATINUM,
    requirement: { type: 'success_rate', value: 95, minAttempts: 30 }
  },
  
  // Streak badges
  CONSISTENT: {
    id: 'consistent',
    name: 'Consistent',
    description: 'Practice for 3 days in a row',
    icon: '🔥',
    tier: BADGE_TIERS.BRONZE,
    requirement: { type: 'streak', value: 3 }
  },
  DEDICATED: {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Practice for 7 days in a row',
    icon: '🌟',
    tier: BADGE_TIERS.SILVER,
    requirement: { type: 'streak', value: 7 }
  },
  COMMITTED: {
    id: 'committed',
    name: 'Committed',
    description: 'Practice for 14 days in a row',
    icon: '⚡',
    tier: BADGE_TIERS.GOLD,
    requirement: { type: 'streak', value: 14 }
  },
  UNSTOPPABLE: {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Practice for 30 days in a row',
    icon: '🚀',
    tier: BADGE_TIERS.PLATINUM,
    requirement: { type: 'streak', value: 30 }
  },
  
  // Special badges
  QUICK_LEARNER: {
    id: 'quick_learner',
    name: 'Quick Learner',
    description: 'Complete 5 scenarios in one day',
    icon: '⚡',
    tier: BADGE_TIERS.SILVER,
    requirement: { type: 'daily_scenarios', value: 5 }
  },
  QUIZ_MASTER: {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Score 100% on a quiz',
    icon: '🎓',
    tier: BADGE_TIERS.GOLD,
    requirement: { type: 'perfect_quiz', value: 1 }
  },
  ARTICLE_READER: {
    id: 'article_reader',
    name: 'Knowledge Seeker',
    description: 'Read 10 security articles',
    icon: '📚',
    tier: BADGE_TIERS.SILVER,
    requirement: { type: 'articles_read', value: 10 }
  }
};

// Check which badges a user has earned
export const checkBadges = (userData) => {
  const earnedBadges = [];
  
  Object.values(BADGES).forEach(badge => {
    const req = badge.requirement;
    let earned = false;
    
    switch(req.type) {
      case 'score':
        earned = (userData.score || 0) >= req.value;
        break;
        
      case 'attempts':
        earned = (userData.totalAttempts || 0) >= req.value;
        break;
        
      case 'success_rate':
        const totalAttempts = userData.totalAttempts || 0;
        const successfulAttempts = userData.successfulAttempts || 0;
        if (totalAttempts >= req.minAttempts) {
          const rate = (successfulAttempts / totalAttempts) * 100;
          earned = rate >= req.value;
        }
        break;
        
      case 'streak':
        earned = (userData.currentStreak || 0) >= req.value;
        break;
        
      case 'daily_scenarios':
        earned = (userData.dailyScenariosCompleted || 0) >= req.value;
        break;
        
      case 'perfect_quiz':
        earned = (userData.perfectQuizzes || 0) >= req.value;
        break;
        
      case 'articles_read':
        earned = (userData.articlesRead || 0) >= req.value;
        break;
    }
    
    if (earned) {
      earnedBadges.push(badge);
    }
  });
  
  return earnedBadges;
};

// Get newly earned badges
export const getNewBadges = (oldBadges, newBadges) => {
  const oldBadgeIds = new Set(oldBadges.map(b => b.id));
  return newBadges.filter(badge => !oldBadgeIds.has(badge.id));
};

// Get tier color
export const getTierColor = (tier) => {
  switch(tier) {
    case BADGE_TIERS.BRONZE:
      return '#cd7f32';
    case BADGE_TIERS.SILVER:
      return '#c0c0c0';
    case BADGE_TIERS.GOLD:
      return '#ffd700';
    case BADGE_TIERS.PLATINUM:
      return '#e5e4e2';
    default:
      return '#10b981';
  }
};

// Get tier label
export const getTierLabel = (tier) => {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
};
