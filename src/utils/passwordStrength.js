// Password strength checker utility

export const checkPasswordStrength = (password) => {
  if (!password) {
    return {
      score: 0,
      strength: 'None',
      color: '#9ca3af',
      feedback: []
    };
  }

  let score = 0;
  const feedback = [];

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Use at least 8 characters');
  }

  if (password.length >= 12) {
    score += 1;
  } else if (password.length >= 8) {
    feedback.push('Consider using 12+ characters for better security');
  }

  // Complexity checks
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include lowercase letters');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include uppercase letters');
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include numbers');
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include special characters (!@#$%^&*)');
  }

  // Common patterns (negative points)
  const commonPatterns = [
    /password/i,
    /12345/,
    /qwerty/i,
    /abc123/i,
    /letmein/i,
    /welcome/i,
    /admin/i,
    /user/i
  ];

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      score = Math.max(0, score - 2);
      feedback.push('Avoid common words and patterns');
      break;
    }
  }

  // Sequential characters (negative)
  if (/(.)\1{2,}/.test(password)) {
    score = Math.max(0, score - 1);
    feedback.push('Avoid repeated characters');
  }

  // Determine strength level
  let strength, color;
  if (score <= 2) {
    strength = 'Weak';
    color = '#ef4444';
  } else if (score <= 4) {
    strength = 'Fair';
    color = '#f59e0b';
  } else if (score <= 5) {
    strength = 'Good';
    color = '#10b981';
  } else {
    strength = 'Strong';
    color = '#059669';
  }

  return {
    score,
    strength,
    color,
    feedback: feedback.slice(0, 3) // Show only top 3 suggestions
  };
};

export const getPasswordTips = () => {
  return [
    '✅ Use at least 12 characters',
    '✅ Mix uppercase and lowercase letters',
    '✅ Include numbers and special characters',
    '✅ Avoid personal information (names, birthdays)',
    '✅ Don\'t use common words or patterns',
    '✅ Use a unique password for each account',
    '✅ Consider using a passphrase (e.g., "Coffee2Morning!Sky")',
    '✅ Use a password manager to store passwords securely'
  ];
};
