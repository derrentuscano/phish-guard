// Streak tracking utility

// Check if two dates are on the same day
const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

// Check if two dates are consecutive days
const isConsecutiveDay = (date1, date2) => {
  const oneDayMs = 24 * 60 * 60 * 1000;
  const diff = Math.abs(date2.getTime() - date1.getTime());
  return diff <= oneDayMs * 1.5; // Allow some tolerance
};

// Calculate current streak
export const calculateStreak = (lastActiveDate) => {
  if (!lastActiveDate) {
    return { currentStreak: 0, shouldIncrement: true };
  }

  const today = new Date();
  const lastActive = new Date(lastActiveDate);

  // Same day - no change
  if (isSameDay(today, lastActive)) {
    return { currentStreak: null, shouldIncrement: false };
  }

  // Consecutive day - increment
  if (isConsecutiveDay(lastActive, today)) {
    return { currentStreak: null, shouldIncrement: true };
  }

  // Streak broken - reset to 1
  return { currentStreak: 1, shouldIncrement: false };
};

// Update user streak
export const updateStreak = (userData) => {
  const result = calculateStreak(userData.lastActiveDate);
  
  if (result.currentStreak !== null) {
    // Streak broken or new user
    return {
      currentStreak: result.currentStreak,
      longestStreak: Math.max(userData.longestStreak || 0, userData.currentStreak || 0),
      lastActiveDate: new Date().toISOString()
    };
  }
  
  if (result.shouldIncrement) {
    // Increment streak for consecutive day
    const newStreak = (userData.currentStreak || 0) + 1;
    return {
      currentStreak: newStreak,
      longestStreak: Math.max(userData.longestStreak || 0, newStreak),
      lastActiveDate: new Date().toISOString()
    };
  }
  
  // Same day - no update needed
  return null;
};

// Get streak status message
export const getStreakMessage = (streak) => {
  if (streak === 0) return 'Start your streak today!';
  if (streak === 1) return 'Great start! Come back tomorrow!';
  if (streak < 7) return `${streak} day streak! Keep going!`;
  if (streak < 14) return `${streak} days! You're on fire! 🔥`;
  if (streak < 30) return `${streak} days! Incredible dedication! ⚡`;
  return `${streak} days! You're unstoppable! 🚀`;
};

// Get streak emoji
export const getStreakEmoji = (streak) => {
  if (streak === 0) return '💤';
  if (streak < 3) return '🔥';
  if (streak < 7) return '🌟';
  if (streak < 14) return '⚡';
  if (streak < 30) return '🚀';
  return '👑';
};

// Count scenarios completed today
export const getScenariosCompletedToday = (attemptHistory) => {
  if (!attemptHistory || attemptHistory.length === 0) return 0;
  
  const today = new Date();
  return attemptHistory.filter(attempt => {
    const attemptDate = new Date(attempt.timestamp);
    return isSameDay(today, attemptDate);
  }).length;
};
