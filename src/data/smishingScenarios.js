// SMS Phishing (Smishing) Scenarios

export const smishingScenarios = [
  {
    id: 'sms_1',
    from: '+1 (555) 0123',
    fromName: 'USPS',
    content: '🚚 USPS: Your package is awaiting delivery. Confirm your address here: bit.ly/usps-confirm-3x9k',
    timestamp: '2:47 PM',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    indicators: [
      'Shortened URL (bit.ly) instead of official USPS link',
      'Unsolicited message about unordered package',
      'Creates urgency with delivery confirmation'
    ],
    explanation: 'USPS will not send unsolicited texts with shortened URLs. Legitimate delivery notifications come through official tracking systems.',
    educationalTips: [
      'Check tracking numbers on official websites directly',
      'Be suspicious of shortened URLs in texts',
      'Legitimate delivery services provide full tracking details'
    ]
  },
  {
    id: 'sms_2',
    from: '+1 (555) 0456',
    fromName: 'Bank Alert',
    content: '⚠️ ALERT: Suspicious activity detected on your account. Your card has been temporarily locked. Verify here: secure-bank-verify.com',
    timestamp: '10:23 AM',
    difficulty: 'medium',
    correctAnswer: 'phishing',
    indicators: [
      'Suspicious domain name (not official bank domain)',
      'Creates panic with account lock claim',
      'Banks don\'t send links through SMS for security verification'
    ],
    explanation: 'Banks never ask you to verify your account through links in text messages. Contact your bank directly using the number on your card.',
    educationalTips: [
      'Call your bank using the official number on your card',
      'Check the domain name carefully',
      'Banks use official apps and secure channels'
    ]
  },
  {
    id: 'sms_3',
    from: '+1 (555) 0789',
    fromName: 'Amazon',
    content: 'Amazon: Your order #1234-5678 is out for delivery today between 2-6 PM. Track here: amazon.com/tracking',
    timestamp: '1:15 PM',
    difficulty: 'hard',
    correctAnswer: 'legitimate',
    indicators: [
      'Official Amazon domain',
      'Provides specific order number',
      'Reasonable delivery time window',
      'No urgent action required'
    ],
    explanation: 'This appears to be a legitimate delivery notification with an official Amazon link and order details.',
    educationalTips: [
      'Verify order numbers in your Amazon account',
      'Check official domain names (amazon.com)',
      'Legitimate notifications don\'t create urgency'
    ]
  },
  {
    id: 'sms_4',
    from: '+1 (555) 0321',
    fromName: 'IRS',
    content: 'FINAL NOTICE: IRS Action Required. You owe $3,492 in unpaid taxes. Pay immediately to avoid legal action: irs-payment-center.net',
    timestamp: 'Yesterday',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    indicators: [
      'IRS never contacts via text message',
      'Creates fear with legal threats',
      'Fake domain (not irs.gov)',
      'Demands immediate payment'
    ],
    explanation: 'The IRS never initiates contact via SMS or demands immediate payment. They communicate through official mail only.',
    educationalTips: [
      'IRS only contacts through official mail',
      'Never click links claiming to be from IRS',
      'Report scams at irs.gov'
    ]
  },
  {
    id: 'sms_5',
    from: '+1 (555) 0654',
    fromName: 'Verification',
    content: 'Your verification code is: 847293. Do not share this code with anyone. It expires in 10 minutes.',
    timestamp: '3:45 PM',
    difficulty: 'medium',
    correctAnswer: 'legitimate',
    indicators: [
      'Standard verification code format',
      'Includes security warning',
      'States expiration time',
      'No links or requests for information'
    ],
    explanation: 'This appears to be a legitimate verification code. However, only enter it if you requested it.',
    educationalTips: [
      'Only use codes you requested',
      'Never share verification codes',
      'Check if you initiated the verification'
    ]
  },
  {
    id: 'sms_6',
    from: '+1 (555) 0987',
    fromName: 'Netflix',
    content: '🎬 Netflix: Your payment method has failed. Update your billing info to continue watching: netflix-billing-update.com',
    timestamp: '9:12 AM',
    difficulty: 'medium',
    correctAnswer: 'phishing',
    indicators: [
      'Fake domain (not netflix.com)',
      'Payment scare tactic',
      'Emoji to appear friendly',
      'Link instead of directing to app'
    ],
    explanation: 'Netflix would send billing notifications through email and their app, not via SMS with suspicious links.',
    educationalTips: [
      'Check billing through the official Netflix app',
      'Verify domain names carefully',
      'Streaming services communicate through their apps'
    ]
  },
  {
    id: 'sms_7',
    from: '+1 (555) 1234',
    fromName: 'Unknown',
    content: 'Hi! You\'ve been selected to receive a FREE iPhone 15! Claim your prize now before it\'s gone: free-iphone-claim.net/winner',
    timestamp: '11:30 AM',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    indicators: [
      'Too good to be true offer',
      'Creates urgency ("before it\'s gone")',
      'Suspicious domain name',
      'You didn\'t enter any contest'
    ],
    explanation: 'Classic "free prize" scam. These messages try to steal personal information or install malware.',
    educationalTips: [
      'There\'s no such thing as a free iPhone',
      'Delete messages about winning contests you didn\'t enter',
      'Be skeptical of "too good to be true" offers'
    ]
  },
  {
    id: 'sms_8',
    from: '+1 (555) 5678',
    fromName: 'DoorDash',
    content: 'Your DoorDash order from Chipotle is being prepared. Estimated delivery: 35-45 min. Track order: doordash.com/orders/tracking',
    timestamp: '7:30 PM',
    difficulty: 'hard',
    correctAnswer: 'legitimate',
    indicators: [
      'Official domain (doordash.com)',
      'Specific restaurant name',
      'Realistic delivery time',
      'Standard order tracking link'
    ],
    explanation: 'This appears to be a legitimate DoorDash notification if you placed an order. Always verify in the app.',
    educationalTips: [
      'Confirm orders through official apps',
      'Check domain names match official sites',
      'Verify you actually placed the order'
    ]
  },
  {
    id: 'sms_9',
    from: '+1 (555) 9012',
    fromName: 'Support',
    content: 'URGENT: Your computer has been infected with a virus! Click here immediately to remove it: pc-virus-removal.com/fix-now',
    timestamp: '4:20 PM',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    indicators: [
      'SMS can\'t detect computer viruses',
      'Creates panic and urgency',
      'Suspicious domain',
      'Generic "Support" sender name'
    ],
    explanation: 'Text messages cannot detect viruses on your computer. This is a common tech support scam.',
    educationalTips: [
      'Use reputable antivirus software only',
      'SMS messages don\'t detect computer issues',
      'Never click virus warning links from unknown sources'
    ]
  },
  {
    id: 'sms_10',
    from: '+1 (555) 3456',
    fromName: 'Two-Factor',
    content: 'Your two-factor authentication code for Google is: 582947. If you didn\'t request this, secure your account immediately.',
    timestamp: '1:52 PM',
    difficulty: 'medium',
    correctAnswer: 'legitimate',
    indicators: [
      'Standard 2FA code format',
      'Includes security notice',
      'No links or personal information requests',
      'Clear service identification (Google)'
    ],
    explanation: 'This is a legitimate 2FA code IF you requested it. If not, someone may be trying to access your account.',
    educationalTips: [
      'Only use 2FA codes you requested',
      'If unexpected, change your password immediately',
      'Enable 2FA on all important accounts'
    ]
  },
  {
    id: 'sms_11',
    from: '+1 (555) 7890',
    fromName: 'PayPal',
    content: 'Your PayPal account shows unusual activity. We\'ve limited access for your protection. Restore access: paypal-secure-login.com',
    timestamp: '8:45 AM',
    difficulty: 'medium',
    correctAnswer: 'phishing',
    indicators: [
      'Fake domain (not paypal.com)',
      'Account limitation scare tactic',
      'SMS instead of email notification',
      'Link instead of directing to official app'
    ],
    explanation: 'PayPal sends account security notifications via email, not SMS. The domain is fake.',
    educationalTips: [
      'Check PayPal through official app or website',
      'PayPal communicates through email',
      'Verify domains match paypal.com exactly'
    ]
  },
  {
    id: 'sms_12',
    from: '+1 (555) 2468',
    fromName: 'Apple',
    content: 'Your Apple ID will be locked in 24 hours due to suspicious activity. Verify your identity now: apple-id-verify.net',
    timestamp: '6:15 PM',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    indicators: [
      'Fake domain (not apple.com)',
      '24-hour deadline creates urgency',
      'Apple sends email notifications, not SMS',
      'Suspicious domain name'
    ],
    explanation: 'Apple doesn\'t send account security warnings via SMS. This is a phishing attempt to steal your Apple ID.',
    educationalTips: [
      'Check Apple ID status at appleid.apple.com',
      'Apple sends security alerts via email',
      'Be wary of urgent account warnings'
    ]
  }
];

export const getRandomSmishingScenario = () => {
  const randomIndex = Math.floor(Math.random() * smishingScenarios.length);
  return smishingScenarios[randomIndex];
};

export const getSmishingByDifficulty = (difficulty) => {
  return smishingScenarios.filter(s => s.difficulty === difficulty);
};
