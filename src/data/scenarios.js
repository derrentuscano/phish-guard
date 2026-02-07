// Sample phishing scenarios for training
export const phishingScenarios = [
  {
    id: 'email-1',
    type: 'email',
    difficulty: 'easy',
    from: 'security@paypa1-verify.com',
    subject: 'Urgent: Your Account Has Been Suspended',
    content: `Dear Valued Customer,

We have detected unusual activity on your PayPal account. Your account has been temporarily suspended for your protection.

To restore your account immediately, please verify your identity by clicking the link below:

http://paypa1-verify.com/restore-account

If you do not verify within 24 hours, your account will be permanently closed.

Thank you,
PayPal Security Team`,
    correctAnswer: 'phishing',
    explanation: 'This is a phishing email. Red flags include: misspelled domain (paypa1 instead of paypal), suspicious URL, urgent language creating pressure, and threats of account closure. PayPal never asks you to verify information via email links.',
    indicators: [
      'Misspelled domain (paypa1-verify.com)',
      'Creates urgency and fear',
      'Suspicious link',
      'Threat of account closure'
    ]
  },
  {
    id: 'email-2',
    type: 'email',
    difficulty: 'easy',
    from: 'no-reply@amazon.com',
    subject: 'Your Order #AMZ-12345 Has Shipped',
    content: `Hello,

Your recent order has been shipped and is on its way!

Order Number: AMZ-12345
Tracking Number: 1Z999AA10123456784
Expected Delivery: November 15, 2023

You can track your package at: https://www.amazon.com/tracking

Thank you for shopping with Amazon!

Amazon Shipping Team`,
    correctAnswer: 'safe',
    explanation: 'This appears to be a legitimate shipping notification. The domain is correct (amazon.com), there are no spelling errors, the link goes to the official Amazon website, and it doesn\'t ask for personal information.',
    indicators: [
      'Legitimate amazon.com domain',
      'No urgent requests',
      'Proper formatting',
      'No requests for personal info'
    ]
  },
  {
    id: 'email-3',
    type: 'email',
    difficulty: 'medium',
    from: 'admin@company-internal.com',
    subject: 'IT: Password Reset Required',
    content: `Dear Employee,

Our IT department is upgrading our security systems. All employees must reset their passwords within 2 hours.

Click here to reset: http://192.168.1.100/password-reset

Enter your current password and choose a new one.

Your current password will stop working if you don't complete this process.

IT Department`,
    correctAnswer: 'phishing',
    explanation: 'This is a phishing attempt. Red flags: IP address instead of proper domain, urgent 2-hour deadline, asking you to enter your current password (legitimate services never ask for this), and using fear tactics. IT departments typically provide more notice and use internal systems.',
    indicators: [
      'IP address instead of domain name',
      'Requests current password',
      'Very short deadline (2 hours)',
      'Generic greeting'
    ]
  },
  {
    id: 'email-4',
    type: 'email',
    difficulty: 'medium',
    from: 'notifications@github.com',
    subject: 'New comment on your issue #4521',
    content: `@username commented on issue #4521

"I found a bug in your code. Check out the fix I proposed in the attached file."

View on GitHub: https://github.com/yourrepo/issues/4521

You're receiving this because you're watching this repository.
Unsubscribe from this thread`,
    correctAnswer: 'suspicious',
    explanation: 'This email is suspicious. While it appears to be from GitHub, asking you to download an attached file from someone you don\'t know is risky. Legitimate code fixes would be submitted as pull requests or shown directly on GitHub, not as attachments. Always verify on the actual GitHub website rather than clicking email links.',
    indicators: [
      'Mentions an attachment (unusual for GitHub)',
      'From unknown person',
      'Better to check directly on GitHub',
      'Could contain malware in attachment'
    ]
  },
  {
    id: 'email-5',
    type: 'email',
    difficulty: 'hard',
    from: 'support@microsoft.com',
    subject: 'Microsoft 365 Subscription Renewal',
    content: `Dear Customer,

Your Microsoft 365 subscription will expire in 3 days.

To avoid service interruption, please review and update your payment information.

Manage Subscription: https://account.microsoft.com/services/renewal

If you have questions, reply to this email or call +1-800-MICROSOFT

Best regards,
Microsoft Account Team`,
    correctAnswer: 'safe',
    explanation: 'This appears to be a legitimate Microsoft renewal notice. The domain is correct (microsoft.com), the link goes to the official Microsoft account page, contact information is provided, and there\'s no excessive urgency or threats. However, it\'s always best to verify by going directly to your Microsoft account rather than clicking email links.',
    indicators: [
      'Legitimate microsoft.com domain',
      'Proper Microsoft URL',
      'Professional formatting',
      'Valid contact information',
      'Still best to verify directly on website'
    ]
  },
  {
    id: 'email-6',
    type: 'email',
    difficulty: 'hard',
    from: 'security-alert@apple-security.support.com',
    subject: 'Apple ID: Suspicious Sign-In Attempt Detected',
    content: `We detected a sign-in attempt to your Apple ID from:

Device: Windows PC
Location: Moscow, Russia
IP: 185.220.101.54

If this was you, you can ignore this message.

If this wasn't you, secure your account immediately:
https://apple-security.support.com/verify

Apple Security Team`,
    correctAnswer: 'phishing',
    explanation: 'This is sophisticated phishing. Red flags: The domain "apple-security.support.com" is NOT owned by Apple (Apple uses appleid.apple.com). The subdomain trick makes it look legitimate. Real Apple security alerts come from @id.apple.com or @insideapple.apple.com, and they never use third-party domains.',
    indicators: [
      'Fake subdomain (apple-security.support.com is owned by "support.com")',
      'Creates fear with foreign location',
      'Suspicious URL structure',
      'Apple uses appleid.apple.com, not third-party domains'
    ]
  },
  {
    id: 'email-7',
    type: 'email',
    difficulty: 'easy',
    from: 'prince.nigeria@yahoo.com',
    subject: 'Urgent Business Proposal - $10 Million USD',
    content: `Dear Friend,

I am Prince Abdullah from Nigeria. I have a business proposal worth $10,000,000 USD that requires your assistance.

Due to political situation, I need to transfer funds out of the country. I will give you 30% ($3,000,000) for your help.

Please send your bank account details and phone number so we can proceed.

God Bless,
Prince Abdullah`,
    correctAnswer: 'phishing',
    explanation: 'This is a classic "Nigerian Prince" advance-fee scam. Major red flags: unsolicited offer of large money, requests for bank details, too good to be true promise, poor grammar, and using a free email service (Yahoo) for "business". Never share banking information via email.',
    indicators: [
      'Classic advance-fee scam',
      'Too good to be true',
      'Requests bank account details',
      'Free email service (Yahoo)',
      'Unsolicited offer'
    ]
  },
  {
    id: 'email-8',
    type: 'email',
    difficulty: 'medium',
    from: 'hr@yourcompany.com',
    subject: 'Mandatory: Complete Annual Compliance Training',
    content: `Dear Team Member,

All employees must complete the annual compliance training by Friday, May 15th.

Access the training portal: https://training.yourcompany.com/compliance

Login with your employee credentials. The training takes approximately 45 minutes.

Completion is mandatory and tracked by HR.

Thank you,
Human Resources`,
    correctAnswer: 'suspicious',
    explanation: 'This email requires caution. While it could be legitimate, you should verify it independently. Call your HR department or check your company\'s internal portal directly rather than clicking the link. If it\'s real, HR won\'t mind verification. If it\'s fake, you\'ve avoided a trap. The domain appears correct, but could be spoofed.',
    indicators: [
      'Could be legitimate or spoofed',
      'Verify independently with HR',
      'Don\'t click link - go directly to company portal',
      'Check if other employees received it'
    ]
  }
];

// Function to get a random scenario
export const getRandomScenario = () => {
  const randomIndex = Math.floor(Math.random() * phishingScenarios.length);
  return phishingScenarios[randomIndex];
};

// Function to get scenarios by difficulty
export const getScenariosByDifficulty = (difficulty) => {
  return phishingScenarios.filter(scenario => scenario.difficulty === difficulty);
};
