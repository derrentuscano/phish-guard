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
  },
  {
    id: 'email-9',
    type: 'email',
    difficulty: 'easy',
    from: 'support@bankofamerica-secure.net',
    subject: 'Security Alert: Unusual Activity Detected',
    content: `Dear Customer,

We have detected unusual activity on your Bank of America account.

Please verify your identity immediately to prevent account suspension:
Click here: http://bankofamerica-secure.net/verify

This is an automated message. Do not reply to this email.

Bank of America Security Team`,
    correctAnswer: 'phishing',
    explanation: 'Classic phishing attempt. Bank of America uses "bankofamerica.com", not ".net" domains. Banks never ask you to verify identity via email links. Always go directly to the official website or call the number on your card.',
    indicators: [
      'Wrong domain (.net instead of .com)',
      'Generic greeting (no name)',
      'Urgent security threat',
      'Suspicious verification link'
    ]
  },
  {
    id: 'email-10',
    type: 'email',
    difficulty: 'easy',
    from: 'claims@irs-refund.org',
    subject: 'IRS Tax Refund Notification - $2,847.00',
    content: `Taxpayer Notification,

You are eligible for a tax refund of $2,847.00.

To claim your refund, complete the form here: http://irs-refund.org/claim

You must claim within 72 hours or the refund will be forfeited.

Internal Revenue Service`,
    correctAnswer: 'phishing',
    explanation: 'The IRS never contacts taxpayers via email about refunds. They use official mail. The domain "irs-refund.org" is fake - the IRS uses irs.gov. The urgent 72-hour deadline is a pressure tactic used by scammers.',
    indicators: [
      'IRS never emails about refunds',
      'Fake domain (.org instead of .gov)',
      'Urgent deadline pressure',
      'Too good to be true amount'
    ]
  },
  {
    id: 'email-11',
    type: 'email',
    difficulty: 'medium',
    from: 'no-reply@netflix.com',
    subject: 'Your Netflix subscription will end soon',
    content: `Hi there,

Your Netflix subscription is about to expire. To continue enjoying unlimited streaming, please update your payment information.

Update Payment: https://netflix.com/update-billing

If you don't update within 48 hours, your account will be cancelled.

The Netflix Team`,
    correctAnswer: 'suspicious',
    explanation: 'This could be legitimate or phishing. Netflix does send billing reminders, but scammers also impersonate them. Don\'t click the link - instead, log into Netflix directly through your browser or app. If there\'s a real billing issue, you\'ll see it there.',
    indicators: [
      'Could be real or fake',
      'Verify by logging into Netflix directly',
      'Check URL carefully before clicking',
      'Netflix emails come from @netflix.com (verify in email header)'
    ]
  },
  {
    id: 'email-12',
    type: 'email',
    difficulty: 'hard',
    from: 'security@linkedin.com',
    subject: 'LinkedIn: Someone tried to sign in to your account',
    content: `Hi [Your Name],

We noticed a sign-in attempt from a new device:

Location: São Paulo, Brazil
Device: Chrome on Windows
Time: February 9, 2026, 3:42 AM

If this was you, you can ignore this message.

If this wasn't you, please secure your account:
https://www.linkedin.com/checkpoint/challenge

Best,
The LinkedIn Team`,
    correctAnswer: 'safe',
    explanation: 'This appears to be a legitimate LinkedIn security alert. The email uses the correct domain (linkedin.com), provides specific details about the sign-in attempt, offers the option to ignore if it was you, and links to the official LinkedIn checkpoint page. However, always verify by going to LinkedIn directly.',
    indicators: [
      'Correct linkedin.com domain',
      'Specific location and time details',
      'Professional formatting',
      'Official LinkedIn checkpoint URL',
      'Still best to verify directly on LinkedIn'
    ]
  },
  {
    id: 'email-13',
    type: 'email',
    difficulty: 'medium',
    from: 'team@dropbox.com',
    subject: 'Your Dropbox storage is almost full',
    content: `Hi there,

You're using 14.8 GB of your 15 GB Dropbox storage.

Upgrade to Dropbox Plus for 2TB of storage:
https://www.dropbox.com/upgrade

Or free up space by deleting old files.

The Dropbox Team`,
    correctAnswer: 'safe',
    explanation: 'This looks like a legitimate Dropbox notification. It uses the correct domain, doesn\'t create urgency beyond what\'s reasonable, provides an upgrade option, and offers an alternative (delete old files). However, verify your actual storage by logging into Dropbox directly.',
    indicators: [
      'Correct dropbox.com domain',
      'Reasonable notification',
      'No aggressive pressure tactics',
      'Provides alternatives',
      'Verify by checking Dropbox directly'
    ]
  },
  {
    id: 'email-14',
    type: 'email',
    difficulty: 'hard',
    from: 'billing@adobe-services.com',
    subject: 'Adobe Creative Cloud - Payment Failed',
    content: `Dear Customer,

Your recent payment for Adobe Creative Cloud has failed.

Update your payment method to avoid service interruption:
http://adobe-services.com/billing/update

Your subscription will be cancelled if payment is not received within 5 days.

Adobe Billing Team`,
    correctAnswer: 'phishing',
    explanation: 'Sophisticated phishing. Adobe uses "adobe.com" not "adobe-services.com". The hyphen adds credibility but it\'s still a fake domain. Real Adobe emails come from @adobe.com or @mail.adobe.com. Always verify billing issues by logging into your Adobe account directly.',
    indicators: [
      'Fake domain (adobe-services.com)',
      'Adobe uses adobe.com for official communication',
      'Generic greeting',
      'Pressure with 5-day deadline',
      'Verify billing directly on Adobe website'
    ]
  },
  {
    id: 'email-15',
    type: 'email',
    difficulty: 'easy',
    from: 'ceo@yourcompany.com',
    subject: 'URGENT: Need iTunes Gift Cards',
    content: `Hello,

I'm in an important meeting and need you to purchase $500 in iTunes gift cards immediately.

Buy them from the nearest store and send me the codes via email.

This is urgent for a client gift. I'll reimburse you today.

Thanks,
CEO Name`,
    correctAnswer: 'phishing',
    explanation: 'Classic CEO fraud/impersonation scam. No legitimate CEO asks employees to buy gift cards via email. The email may be spoofed to look like it\'s from your CEO. Gift cards are untraceable and favored by scammers. Always verify unusual requests by calling the person directly.',
    indicators: [
      'CEO fraud/whaling attack',
      'Request for gift cards (major red flag)',
      'Creates urgency',
      'Unusual request via email',
      'Verify by calling CEO directly'
    ]
  },
  {
    id: 'email-16',
    type: 'email',
    difficulty: 'medium',
    from: 'updates@facebook.com',
    subject: 'Someone logged into your Facebook account',
    content: `Hi,

We noticed a login to your Facebook account from a device we don't recognize:

Device: iPhone 13
Location: Lagos, Nigeria  
Time: February 9, 2026 at 2:15 AM

Secure your account: https://facebook.com/checkpoint

Didn't make this login? Change your password immediately.

The Facebook Security Team`,
    correctAnswer: 'suspicious',
    explanation: 'This could be legitimate or a sophisticated phishing attempt. Facebook does send security alerts, but the domain can be spoofed. Don\'t click the link - instead, open Facebook in a new browser tab and check your security settings. Real alerts will show there too.',
    indicators: [
      'Facebook does send these alerts',
      'Domain could be spoofed',
      'Verify by going to facebook.com directly',
      'Check Security Settings in your Facebook account',
      'Look for this alert in Facebook notifications'
    ]
  },
  {
    id: 'email-17',
    type: 'email',
    difficulty: 'easy',
    from: 'delivery@dhl-shipping.net',
    subject: 'DHL Delivery Failed - Action Required',
    content: `Dear Customer,

We attempted to deliver package #DHL749382 but no one was home.

Download shipping label to reschedule:
http://dhl-shipping.net/redelivery.exe

Package will return to sender in 24 hours if not claimed.

DHL Express`,
    correctAnswer: 'phishing',
    explanation: 'Dangerous phishing with malware. Major red flags: DHL uses dhl.com, not .net. The link ends in ".exe" which is an executable file - clicking this would download malware. DHL never sends executable files. They use their official tracking system on dhl.com.',
    indicators: [
      'Fake domain (.net instead of .com)',
      'Executable file (.exe) - MALWARE!',
      'Generic greeting',
      'Creates urgency (24 hours)',
      'Real DHL uses official tracking system'
    ]
  },
  {
    id: 'email-18',
    type: 'email',
    difficulty: 'medium',
    from: 'support@zoom.us',
    subject: 'Zoom: Your meeting recording is ready',
    content: `Hello,

Your Zoom meeting "Team Sync" from February 8, 2026 has been recorded.

View Recording: https://zoom.us/rec/share/xY9kM2p3

Recording details:
- Duration: 45 minutes
- Participants: 8
- Meeting ID: 123-456-7890

This link will expire in 30 days.

Zoom Video Communications`,
    correctAnswer: 'safe',
    explanation: 'This appears to be a legitimate Zoom recording notification. It uses the correct domain (zoom.us), provides specific meeting details, has a reasonable expiration period, and the rec/share URL format is correct for Zoom recordings. However, if you didn\'t record a meeting, be suspicious.',
    indicators: [
      'Correct zoom.us domain',
      'Specific meeting details',
      'Standard Zoom recording URL format',
      'Reasonable 30-day expiration',
      'If you didn\'t record a meeting, verify directly'
    ]
  },
  {
    id: 'email-19',
    type: 'email',
    difficulty: 'hard',
    from: 'billing@spotify.com',
    subject: 'Spotify Premium - Update Payment Method',
    content: `Hey there,

We couldn't process your payment for Spotify Premium.

Your subscription will be cancelled on February 12, 2026 unless you update your payment method.

Update Payment: https://accounts.spotify.com/payment

You can also update in the mobile app under Settings > Subscription.

Love,
Spotify Team`,
    correctAnswer: 'safe',
    explanation: 'This looks like a legitimate Spotify billing email. It uses the correct domain (spotify.com), uses proper Spotify branding ("Hey there", "Love"), provides the official payment URL (accounts.spotify.com), gives an alternative method (mobile app), and doesn\'t use aggressive pressure tactics.',
    indicators: [
      'Correct spotify.com domain',
      'Authentic Spotify tone and style',
      'Official accounts.spotify.com URL',
      'Provides alternative (mobile app)',
      'No excessive urgency'
    ]
  },
  {
    id: 'email-20',
    type: 'email',
    difficulty: 'medium',
    from: 'security@wellsfargo.com',
    subject: 'Wells Fargo: Confirm Your Recent Transaction',
    content: `Dear Customer,

We noticed a large transaction on your Wells Fargo account:

Amount: $1,247.83
Merchant: Best Buy - Los Angeles, CA
Date: February 9, 2026

If you did not make this purchase, please call us immediately at:
1-800-WELLS-FARGO (1-800-935-5736)

Do not respond to this email. Please call the number above.

Wells Fargo Fraud Prevention`,
    correctAnswer: 'safe',
    explanation: 'This appears legitimate. Wells Fargo does send transaction alerts, uses the correct domain, provides their official phone number (which you can verify on your card), tells you NOT to respond to the email, and asks you to call instead. The transaction details are specific. Still, verify the phone number independently.',
    indicators: [
      'Correct wellsfargo.com domain',
      'Specific transaction details',
      'Tells you NOT to reply to email',
      'Official Wells Fargo phone number',
      'Always verify phone number on your card'
    ]
  },
  {
    id: 'email-21',
    type: 'email',
    difficulty: 'easy',
    from: 'winner@lottery-international.com',
    subject: 'CONGRATULATIONS! You Won $5,000,000 USD',
    content: `WINNER NOTIFICATION!

Your email address won the International Email Lottery!

Prize: $5,000,000.00 USD

To claim your prize, send us:
- Full Name
- Address  
- Phone Number
- Bank Account Details
- Processing Fee: $500 USD

Contact: winner@lottery-international.com

Congratulations!
International Lottery Committee`,
    correctAnswer: 'phishing',
    explanation: 'Classic lottery scam. You cannot win a lottery you never entered. Major red flags: requests personal information and bank details, asks for a "processing fee" (real lotteries never charge winners), too good to be true, poor grammar and formatting. This is 100% a scam.',
    indicators: [
      'Cannot win lottery you didn\'t enter',
      'Requests bank account details',
      'Asks for processing fee (scam!)',
      'Too good to be true',
      'Poor grammar and formatting'
    ]
  },
  {
    id: 'email-22',
    type: 'email',
    difficulty: 'hard',
    from: 'noreply@accounts.google.com',
    subject: 'Google: Critical Security Alert',
    content: `Hi there,

We prevented a sign-in attempt to your Google Account:

Email: youremail@gmail.com
Location: Beijing, China
Device: Unknown device
Time: February 9, 2026, 4:23 AM UTC

We blocked this attempt because we don't recognize the device.

Review Account Activity: https://myaccount.google.com/security

If this was you trying to sign in, you may need to complete additional verification steps.

Google Account Team`,
    correctAnswer: 'safe',
    explanation: 'This appears to be a legitimate Google security alert. It uses the correct noreply@accounts.google.com address, links to the official myaccount.google.com domain, provides specific details, and doesn\'t demand immediate action. However, always verify by going to myaccount.google.com directly in a new browser tab.',
    indicators: [
      'Correct accounts.google.com sender',
      'Official myaccount.google.com URL',
      'Specific details provided',
      'No excessive pressure',
      'Still verify by visiting Google directly'
    ]
  },
  {
    id: 'email-23',
    type: 'email',
    difficulty: 'medium',
    from: 'update@microsoft-teams.info',
    subject: 'Microsoft Teams: You missed a message',
    content: `You have a new message in Microsoft Teams:

From: Your Manager
Message: "Can you review this document urgently?"

View Message: http://microsoft-teams.info/messages

Download Teams App | Help Center

Microsoft Corporation`,
    correctAnswer: 'phishing',
    explanation: 'Phishing attempt. Microsoft Teams uses "teams.microsoft.com" not "microsoft-teams.info". The .info domain is a red flag. Real Teams notifications come from @email.teams.microsoft.com. The urgent message from "Your Manager" is a social engineering tactic to make you click quickly without thinking.',
    indicators: [
      'Fake domain (microsoft-teams.info)',
      'Real Teams uses teams.microsoft.com',
      'Creates urgency with manager mention',
      'Generic "Your Manager" instead of actual name',
      'Verify in the actual Teams app'
    ]
  },
  {
    id: 'email-24',
    type: 'email',
    difficulty: 'easy',
    from: 'customer-service@amaz0n.com',
    subject: 'Refund Approved: $349.99',
    content: `Dear Amazon Customer,

Good news! Your refund request has been approved.

Refund Amount: $349.99
Order #: 112-7859343-8471002

To receive your refund, verify your account:
Click here: http://amaz0n-refunds.tk/verify

Enter your Amazon login and payment details to process refund.

Amazon Customer Service`,
    correctAnswer: 'phishing',
    explanation: 'Obvious phishing. Uses "0" instead of "o" in amazon (amaz0n.com). The real domain is amazon.com. The ".tk" domain in the link is a free domain often used by scammers. Amazon never asks you to verify account details to receive a refund. Refunds are processed automatically to your original payment method.',
    indicators: [
      'Number "0" instead of letter "o"',
      'Fake .tk domain in link',
      'Requests login credentials',
      'Amazon never asks for verification for refunds',
      'Real refunds are automatic'
    ]
  },
  {
    id: 'email-25',
    type: 'email',
    difficulty: 'medium',
    from: 'notifications@slack.com',
    subject: 'Slack: New login from Windows',
    content: `Hi there,

Someone just logged into your Slack account:

Device: Chrome on Windows 10
Location: London, United Kingdom
Time: February 9, 2026 at 11:34 AM

If this was you, you're all set!

If not, secure your account: https://slack.com/account/settings

Questions? Contact your workspace admin.

Slack`,
    correctAnswer: 'safe',
    explanation: 'This appears to be a legitimate Slack security notification. It uses the correct slack.com domain, provides specific login details, allows you to ignore if it was you, links to the official slack.com settings page, and suggests contacting your admin. The casual tone ("you\'re all set!") matches Slack\'s style.',
    indicators: [
      'Correct slack.com domain',
      'Specific login details',
      'Casual Slack writing style',
      'Official slack.com URL',
      'Still verify by checking Slack directly'
    ]
  },
  {
    id: 'email-26',
    type: 'email',
    difficulty: 'hard',
    from: 'service@intuit.com',
    subject: 'QuickBooks: Your subscription needs attention',
    content: `Hello,

Your QuickBooks Online subscription payment failed.

Update payment method to avoid service disruption: 
https://accounts.intuit.com/app/billing

Current subscription: QuickBooks Online Plus
Amount due: $65.00
Due date: February 12, 2026

Need help? Visit our Help Center or call 1-800-446-8848

Thank you,
The QuickBooks Team`,
    correctAnswer: 'safe',
    explanation: 'This looks legitimate. Intuit (QuickBooks parent company) uses intuit.com, the link goes to the official accounts.intuit.com domain, provides specific subscription details, gives official support phone number, and uses professional language without excessive urgency. However, always verify by logging into QuickBooks directly.',
    indicators: [
      'Correct intuit.com domain',
      'Official accounts.intuit.com URL',
      'Specific subscription details',
      'Real Intuit support phone number',
      'Verify by logging into QuickBooks directly'
    ]
  },
  {
    id: 'email-27',
    type: 'email',
    difficulty: 'easy',
    from: 'support@cryptowallet-secure.com',
    subject: 'URGENT: Your Crypto Wallet Will Be Deleted',
    content: `SECURITY ALERT!

Your cryptocurrency wallet will be permanently deleted in 6 hours due to new regulations.

Current Balance: 2.5 BTC ($95,000 USD)

Transfer your funds immediately:
http://cryptowallet-secure.com/emergency-transfer

Enter your wallet private key to save your funds.

This is your FINAL WARNING!

Crypto Security Team`,
    correctAnswer: 'phishing',
    explanation: 'Extremely dangerous phishing/scam. NEVER share your private key - anyone with it can steal all your cryptocurrency. Major red flags: creates extreme urgency, threatens deletion, shows your "balance" to create fear, requests private key. No legitimate crypto service ever asks for your private key via email. This is a scam to steal your crypto.',
    indicators: [
      'NEVER share private keys!',
      'Extreme urgency (6 hours)',
      'Threats of deletion',
      'Requests private key (instant theft)',
      'Crypto companies never email for private keys'
    ]
  },
  {
    id: 'email-28',
    type: 'email',
    difficulty: 'medium',
    from: 'receipts@uber.com',
    subject: 'Your trip receipt',
    content: `Thanks for riding with Uber!

Trip details:
From: 123 Main Street
To: 456 Oak Avenue
Date: February 9, 2026
Fare: $18.50

View full receipt: https://www.uber.com/receipts

Rate your driver: https://www.uber.com/rate

Questions? Visit Help Center

Uber Technologies Inc.`,
    correctAnswer: 'safe',
    explanation: 'This appears to be a legitimate Uber receipt. It uses the correct uber.com domain, provides specific trip details, links to official uber.com pages, and has professional formatting typical of Uber receipts. If you recently took an Uber ride, this is likely legitimate. If not, verify in your Uber app.',
    indicators: [
      'Correct uber.com domain',
      'Specific trip details',
      'Official Uber URLs',
      'Professional formatting',
      'Verify in Uber app if unexpected'
    ]
  },
  {
    id: 'email-29',
    type: 'email',
    difficulty: 'hard',
    from: 'verification@paypal-resolution.com',
    subject: 'PayPal: Dispute Resolution Required',
    content: `Dear PayPal User,

A dispute has been filed against your account:

Dispute Amount: $487.32
Filed by: buyer_2847@gmail.com
Case ID: PP-7394-2847-3921

To avoid account limitation, please respond to this dispute within 48 hours:

https://www.paypal-resolution.com/resolve-case/PP-7394-2847-3921

Provide documentation to support your case.

PayPal Dispute Resolution Team`,
    correctAnswer: 'phishing',
    explanation: 'Sophisticated phishing. "paypal-resolution.com" is NOT a PayPal domain - PayPal uses "paypal.com". The hyphenated domain trick makes it look official but it\'s fake. Real PayPal dispute notices appear in your PayPal account under Resolution Center. Never handle disputes via email links.',
    indicators: [
      'Fake domain (paypal-resolution.com)',
      'PayPal only uses paypal.com',
      'Creates urgency (48 hours)',
      'Real disputes show in PayPal Resolution Center',
      'Always check disputes in actual PayPal account'
    ]
  },
  {
    id: 'email-30',
    type: 'email',
    difficulty: 'medium',
    from: 'notifications@github.com',
    subject: 'GitHub: Security vulnerability detected',
    content: `Security Alert

We found a security vulnerability in your repository:

Repository: username/project-name
Severity: High
Package: lodash
Vulnerability: Prototype Pollution

View Details: https://github.com/username/project-name/security

Fix: Update lodash to version 4.17.21 or later

GitHub Security`,
    correctAnswer: 'safe',
    explanation: 'This appears to be a legitimate GitHub security alert (Dependabot). It uses the correct github.com domain, provides specific details (repository name, package, vulnerability type), links to the official GitHub security tab, and suggests a specific fix. GitHub does send these automated security alerts. Verify by checking your repository directly.',
    indicators: [
      'Correct github.com domain',
      'Specific vulnerability details',
      'Official GitHub security URL',
      'Provides specific fix version',
      'Verify in your GitHub repository'
    ]
  },
  {
    id: 'email-31',
    type: 'email',
    difficulty: 'easy',
    from: 'covid-relief@gov-assistance.org',
    subject: 'COVID-19 Government Relief Payment',
    content: `Dear Citizen,

You are eligible for a $1,200 COVID-19 relief payment from the government.

To claim your payment, fill out this form:
http://gov-assistance.org/covid-relief

Required information:
- Social Security Number
- Bank Account Number
- Date of Birth

Claim expires in 48 hours!

U.S. Department of Treasury`,
    correctAnswer: 'phishing',
    explanation: 'Government impersonation scam. The U.S. government uses .gov domains, not .org. They never request personal information like SSN or bank account via email. Government relief payments are distributed through official IRS channels, not email forms. This scam exploits crises to steal personal information.',
    indicators: [
      'Wrong domain (.org not .gov)',
      'Requests SSN and bank account',
      'Government never emails for this info',
      'Creates urgency (48 hours)',
      'Real government uses official .gov sites'
    ]
  },
  {
    id: 'email-32',
    type: 'email',
    difficulty: 'medium',
    from: 'team@trello.com',
    subject: 'You were added to a Trello board',
    content: `Hi!

John Smith added you to the board "Q1 Marketing Campaign"

View Board: https://trello.com/b/xY7mK9pL

Board description: Planning and execution for Q1 2026 marketing initiatives

Download Trello App | Help & Support

Happy organizing!
The Trello Team`,
    correctAnswer: 'safe',
    explanation: 'This looks like a legitimate Trello notification. It uses the correct trello.com domain, provides specific details (who added you, board name), links to the official trello.com board URL, and uses Trello\'s friendly tone ("Happy organizing!"). However, if you don\'t know John Smith or weren\'t expecting this, verify directly in Trello.',
    indicators: [
      'Correct trello.com domain',
      'Specific board and person details',
      'Official Trello URL format',
      'Authentic Trello tone',
      'If unexpected, verify in Trello app'
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

// Legitimate emails for training
export const emailScenarios = [
  // EASY - Obvious phishing (10 scenarios)
  {
    id: 1,
    type: 'email',
    difficulty: 'easy',
    sender: 'security@paypa1-support.com',
    subject: 'Urgent: Verify Your Account Now!',
    content: 'Your PayPal account has been limited. Click here immediately to verify your information or your account will be permanently suspended within 24 hours.',
    correctAnswer: 'phishing',
    explanation: 'Red flags: Misspelled domain (paypa1 instead of paypal), urgency tactics, threatening language, suspicious link.',
    indicators: ['Misspelled domain', 'Urgency tactics', 'Threats', 'Generic greeting']
  },
  {
    id: 2,
    type: 'email',
    difficulty: 'easy',
    sender: 'no-reply@amaz0n-security.com',
    subject: 'Your order has been cancelled - Action Required',
    content: 'Dear customer, your recent order #98765 has been cancelled due to payment issues. Click here to update your payment method immediately.',
    correctAnswer: 'phishing',
    explanation: 'Red flags: Number "0" replacing letter "o" in amazon, generic greeting, fake order number, urgency.',
    indicators: ['Character substitution', 'Fake order number', 'Generic greeting', 'Urgency']
  },
  {
    id: 3,
    type: 'email',
    difficulty: 'easy',
    sender: 'admin@bank-of-america-secure.tk',
    subject: 'IMMEDIATE ACTION REQUIRED - Account Suspended',
    content: 'Your account has been suspended due to suspicious activity. Download the attached form and send us your SSN, account number, and password to restore access.',
    correctAnswer: 'phishing',
    explanation: 'Red flags: Suspicious TLD (.tk), asking for sensitive information, ALL CAPS urgency, requesting password.',
    indicators: ['Suspicious TLD (.tk)', 'Requests sensitive info', 'All caps', 'Asks for password']
  },
  {
    id: 4,
    type: 'email',
    difficulty: 'easy',
    sender: 'prizes@winner-notification.com',
    subject: 'Congratulations! You won $1,000,000',
    content: 'You have been selected as the winner of our international lottery! Click here and provide your bank details to claim your prize of ONE MILLION DOLLARS!',
    correctAnswer: 'phishing',
    explanation: 'Red flags: Unsolicited prize notification, asking for bank details, too-good-to-be-true offer, excessive punctuation.',
    indicators: ['Unsolicited prize', 'Requests bank details', 'Too good to be true', 'Excessive caps']
  },
  {
    id: 5,
    type: 'email',
    difficulty: 'easy',
    sender: 'support@micros0ft-team.com',
    subject: 'Your Windows License Has Expired',
    content: 'Your Windows license has expired. Click this link to renew or your computer will be locked in 48 hours. Pay $99.99 now!',
    correctAnswer: 'phishing',
    explanation: 'Red flags: Number "0" replacing "o", fake urgency, Windows doesn\'t expire like this, suspicious payment request.',
    indicators: ['Character substitution', 'False urgency', 'Fake expiration', 'Payment scam']
  },
  {
    id: 6,
    type: 'email',
    difficulty: 'easy',
    sender: 'itdepartment@company-internal.net',
    subject: 'Password Reset Required',
    content: 'IT Department: All employees must reset passwords today. Click here and enter your current password and a new one. Failure to comply will result in account termination.',
    correctAnswer: 'phishing',
    explanation: 'Red flags: IT would never ask for current password, external domain pretending to be internal, threats.',
    indicators: ['Requests current password', 'External domain', 'Threats', 'Fake IT department']
  },
  {
    id: 7,
    type: 'email',
    difficulty: 'easy',
    sender: 'ceo@company.co.uk.secure-login.com',
    subject: 'CEO: Urgent Task - Confidential',
    content: 'This is the CEO. I need you to purchase gift cards worth $5000 immediately for client gifts. Reply with the codes. This is confidential, do not discuss with anyone.',
    correctAnswer: 'phishing',
    explanation: 'Red flags: CEO impersonation, suspicious domain, gift card scam, secrecy request, urgent demands.',
    indicators: ['CEO fraud', 'Gift card scam', 'Secrecy tactics', 'Urgency']
  },
  {
    id: 8,
    type: 'email',
    difficulty: 'easy',
    sender: 'security@apple-id-verify.com',
    subject: 'Your Apple ID is locked',
    content: 'Your Apple ID has been locked due to suspicious login attempts from Nigeria. Verify your identity by clicking here and providing your Apple ID, password, and credit card.',
    correctAnswer: 'phishing',
    explanation: 'Red flags: Wrong domain, asks for password and credit card, fear tactics mentioning specific country.',
    indicators: ['Wrong domain', 'Requests credentials', 'Fear tactics', 'Asks for credit card']
  },
  {
    id: 9,
    type: 'email',
    difficulty: 'easy',
    sender: 'support@netflix-billing.ml',
    subject: 'Payment Failed - Update Required',
    content: 'Your Netflix payment has failed. Update your billing information within 24 hours or your account will be deleted permanently.',
    correctAnswer: 'phishing',
    explanation: 'Red flags: Suspicious TLD (.ml), Netflix uses different domains, threatening account deletion, urgency.',
    indicators: ['Suspicious TLD (.ml)', 'Wrong domain', 'Threats', 'Urgency']
  },
  {
    id: 10,
    type: 'email',
    difficulty: 'easy',
    sender: 'refund@irs-tax-refund.com',
    subject: 'IRS Tax Refund Pending - $2,847.00',
    content: 'You are eligible for a tax refund of $2,847.00. Click here and provide your SSN, bank account, and routing number to receive your refund immediately.',
    correctAnswer: 'phishing',
    explanation: 'Red flags: IRS doesn\'t email about refunds, requests SSN and bank details, too specific amount to seem real.',
    indicators: ['IRS impersonation', 'Requests SSN', 'Requests bank info', 'Unsolicited refund']
  },

  // MEDIUM - More sophisticated (10 scenarios)
  {
    id: 11,
    type: 'email',
    difficulty: 'medium',
    sender: 'noreply@dropbox.com',
    subject: 'Shared Document: Q4_Financial_Report.pdf',
    content: 'John Smith shared a document with you. Click here to view: Q4_Financial_Report.pdf. This link expires in 24 hours.',
    correctAnswer: 'suspicious',
    explanation: 'Suspicious signs: Unexpected document from unknown person, expiring link creates urgency, could be legitimate but verify sender first.',
    indicators: ['Unexpected attachment', 'Unknown sender', 'Expiring link', 'Generic file name']
  },
  {
    id: 12,
    type: 'email',
    difficulty: 'medium',
    sender: 'admin@company.com',
    subject: 'IT Security: Browser Update Required',
    content: 'Dear Employee, Our security team has detected outdated browser versions. Please download and install the latest update from the attached file to maintain compliance.',
    correctAnswer: 'suspicious',
    explanation: 'Suspicious: Even from company domain, IT wouldn\'t send browser updates via email attachment. Verify through official IT channels.',
    indicators: ['Attachment risk', 'Impersonates IT', 'Software download request', 'Verify before acting']
  },
  {
    id: 13,
    type: 'email',
    difficulty: 'medium',
    sender: 'hr@company.com',
    subject: 'Employee Benefits Update - Review Required',
    content: 'Dear Team Member, Please review the updated benefits package for 2024. Click the link below to access your personalized benefits portal and confirm your selections by Friday.',
    correctAnswer: 'suspicious',
    explanation: 'Could be legitimate but suspicious: Unexpected benefits update, link to external portal, deadline pressure. Verify with HR directly.',
    indicators: ['Unexpected benefits email', 'External link', 'Deadline pressure', 'Verify with HR']
  },
  {
    id: 14,
    type: 'email',
    difficulty: 'medium',
    sender: 'notifications@linkedin.com',
    subject: 'You appeared in 12 searches this week',
    content: 'Hi! Professionals are looking at your profile. See who viewed you and upgrade to Premium to unlock full insights. Special offer: 50% off for 30 days.',
    correctAnswer: 'suspicious',
    explanation: 'Mimics LinkedIn but check carefully: Verify sender email exactly matches linkedin.com, hover over links, these emails can be spoofed.',
    indicators: ['Social engineering', 'Premium upsell', 'Verify exact domain', 'Check all links']
  },
  {
    id: 15,
    type: 'email',
    difficulty: 'medium',
    sender: 'team@slack.com',
    subject: 'Your workspace security settings have changed',
    content: 'A new device signed into your workspace from San Francisco, CA. If this wasn\'t you, click here to review your security settings and change your password.',
    correctAnswer: 'suspicious',
    explanation: 'Could be legitimate security alert, but verify: Check if you actually use Slack, verify sender, go directly to Slack website instead of clicking link.',
    indicators: ['Security alert', 'Unknown location', 'Verify independently', 'Don\'t click link']
  },
  {
    id: 16,
    type: 'email',
    difficulty: 'medium',
    sender: 'billing@adobe.com',
    subject: 'Your subscription will renew in 3 days',
    content: 'Your Adobe Creative Cloud subscription ($54.99/month) will automatically renew on March 15, 2024. To cancel or modify, visit your account settings.',
    correctAnswer: 'suspicious',
    explanation: 'Seems legitimate but verify: Scammers use subscription renewals to steal info. Log into Adobe directly rather than clicking email links.',
    indicators: ['Subscription renewal', 'Payment mention', 'Verify account directly', 'Don\'t use email links']
  },
  {
    id: 17,
    type: 'email',
    difficulty: 'medium',
    sender: 'shipping@fedex.com',
    subject: 'Package delivery exception - Action needed',
    content: 'Package #FX8825739 has a delivery exception. Additional customs information required. Click here to provide details and reschedule delivery.',
    correctAnswer: 'suspicious',
    explanation: 'Common scam mimicking FedEx: If you\'re not expecting a package, it\'s suspicious. Verify tracking number on FedEx website directly.',
    indicators: ['Unexpected package', 'Customs request', 'Verify tracking independently', 'Delivery scam']
  },
  {
    id: 18,
    type: 'email',
    difficulty: 'medium',
    sender: 'security@wellsfargo.com',
    subject: 'Unusual activity detected on your account',
    content: 'We detected unusual activity on account ending in 4582. A charge of $1,247.89 was attempted. If this wasn\'t you, please verify your identity immediately.',
    correctAnswer: 'suspicious',
    explanation: 'Banks do send these but scammers copy them: Never click links in these emails. Call the number on your card or visit bank website directly.',
    indicators: ['Security alert', 'Unusual activity', 'Call bank directly', 'Don\'t click links']
  },
  {
    id: 19,
    type: 'email',
    difficulty: 'medium',
    sender: 'donotreply@youtube.com',
    subject: 'Copyright claim on your video',
    content: 'A copyright claim has been filed against your video "Summer Vacation 2023". Your channel may receive a strike. Click here to review the claim and file a counter-notice.',
    correctAnswer: 'suspicious',
    explanation: 'YouTube does send these, but verify: Scammers use copyright fears. Log into YouTube directly to check for actual claims.',
    indicators: ['Copyright scare', 'Channel strike threat', 'Verify on platform', 'Emotional manipulation']
  },
  {
    id: 20,
    type: 'email',
    difficulty: 'medium',
    sender: 'support@zoom.us',
    subject: 'Your Zoom meeting recording is ready',
    content: 'Your recording from "Team Standup - Feb 7" is ready to download. Click here to access the recording. This link expires in 30 days.',
    correctAnswer: 'suspicious',
    explanation: 'Zoom recordings are common attack vectors: Verify you actually had a meeting with that name. Access recordings through Zoom app, not email.',
    indicators: ['Unexpected recording', 'Meeting name generic', 'Verify in Zoom app', 'Expiring link pressure']
  },

  // HARD - Very sophisticated (5 scenarios)
  {
    id: 21,
    type: 'email',
    difficulty: 'hard',
    sender: 'sarah.johnson@company.com',
    subject: 'Re: Project deadline update',
    content: 'Hi, Following up on our conversation yesterday about the project timeline. I\'ve updated the shared Google Doc with the new milestones. Can you review and add your comments by EOD?',
    correctAnswer: 'suspicious',
    explanation: 'Sophisticated spear phishing: Uses coworker\'s name, references past conversation, legitimate-looking task. Verify: Did you actually talk yesterday? Hover over links carefully.',
    indicators: ['Spear phishing', 'Context fabrication', 'Impersonates colleague', 'Verify conversation occurred']
  },
  {
    id: 22,
    type: 'email',
    difficulty: 'hard',
    sender: 'it.support@company.com',
    subject: 'Scheduled system maintenance - Jan 15, 2AM-6AM',
    content: 'IT will perform server maintenance on January 15 from 2AM-6AM EST. Email and file services will be unavailable. Please save your work before 2AM. No action required from users.',
    correctAnswer: 'safe',
    explanation: 'Legitimate IT notice: Professional tone, specific timeframe, no links or attachments, no action required, informational only.',
    indicators: ['Professional communication', 'Specific details', 'No suspicious requests', 'Informational only']
  },
  {
    id: 23,
    type: 'email',
    difficulty: 'hard',
    sender: 'legal@company.com',
    subject: 'NDA Required: Project Phoenix',
    content: 'You\'ve been added to Project Phoenix. Please sign the attached NDA within 48 hours to maintain access. Contact legal@company.com with questions.',
    correctAnswer: 'suspicious',
    explanation: 'Sophisticated attack: Uses internal project name, legal pressure, attachment risk. Verify: Contact legal department through known phone number, not email reply.',
    indicators: ['Legal pressure', 'Attachment risk', 'Verify with legal directly', 'Internal info used']
  },
  {
    id: 24,
    type: 'email',
    difficulty: 'hard',
    sender: 'cfo@company.com',
    subject: 'Wire Transfer Authorization - URGENT',
    content: 'Need you to process a wire transfer to our new vendor. $45,000 to account details below. This is time-sensitive for a contract deadline. Please handle asap and confirm.',
    correctAnswer: 'phishing',
    explanation: 'Business Email Compromise (BEC): Even from executive email, wire transfers should follow strict protocols. Call CFO directly to verify, never reply to email.',
    indicators: ['CEO/CFO fraud', 'Wire transfer request', 'Urgency tactics', 'Call to verify']
  },
  {
    id: 25,
    type: 'email',
    difficulty: 'hard',
    sender: 'accounts-payable@vendor-company.com',
    subject: 'Updated banking information for invoice payments',
    content: 'Our bank account has changed. Please update your records for future payments. New routing: 021000021, Account: 9876543210. Effective immediately for all invoices.',
    correctAnswer: 'suspicious',
    explanation: 'Vendor impersonation: Scammers intercept payments by changing bank details. Always verify banking changes through phone call to known contact, not email.',
    indicators: ['Banking change request', 'Payment redirection', 'Verify via phone call', 'Common BEC tactic']
  },

  // SAFE EMAILS - Legitimate examples (5 scenarios)
  {
    id: 26,
    type: 'email',
    difficulty: 'easy',
    sender: 'newsletters@github.com',
    subject: 'GitHub Daily Digest - Your activity',
    content: 'Hi derrentuscano, Here\'s your GitHub activity from Feb 7: 3 commits, 1 pull request merged, 2 stars received. Manage notification preferences.',
    correctAnswer: 'safe',
    explanation: 'Legitimate automated email: Personalized with your username, summary of your actual activity, standard GitHub format, opt-out link.',
    indicators: ['Legitimate service', 'Personalized content', 'Expected communication', 'Unsubscribe option']
  },
  {
    id: 27,
    type: 'email',
    difficulty: 'easy',
    sender: 'no-reply@stackoverflow.email',
    subject: 'Your question received 5 new answers',
    content: 'Your question "How to implement Firebase authentication in React?" has 5 new answers. Visit Stack Overflow to review and accept an answer.',
    correctAnswer: 'safe',
    explanation: 'Legitimate notification: References your actual question, from verified Stack Overflow domain, expected notification type.',
    indicators: ['Legitimate platform', 'Expected notification', 'Your actual content', 'Professional format']
  },
  {
    id: 28,
    type: 'email',
    difficulty: 'medium',
    sender: 'receipts@amazon.com',
    subject: 'Your Amazon.com order #112-8547621-9845236',
    content: 'Hello, Your order has been shipped! Dell Monitor will arrive: Feb 10-12. Track package. Order total: $289.99. Thank you for shopping with us.',
    correctAnswer: 'safe',
    explanation: 'Legitimate order confirmation: You actually placed this order, specific order number, expected delivery date, matches your purchase.',
    indicators: ['Expected communication', 'Actual order', 'Specific details', 'Professional format']
  },
  {
    id: 29,
    type: 'email',
    difficulty: 'medium',
    sender: 'calendar-notification@google.com',
    subject: 'Event reminder: Team Meeting - Tomorrow at 2PM',
    content: 'Reminder: Team Meeting, Tomorrow Feb 8, 2PM-3PM PST. Join with Google Meet: meet.google.com/abc-defg-hij. Organized by manager@company.com.',
    correctAnswer: 'safe',
    explanation: 'Legitimate calendar reminder: Event you created or accepted, actual Google Meet link format, expected reminder timing.',
    indicators: ['Expected reminder', 'Legitimate Google domain', 'Event you know about', 'Standard format']
  },
  {
    id: 30,
    type: 'email',
    difficulty: 'hard',
    sender: 'security@apple.com',
    subject: 'Your Apple ID was used to sign in to iCloud on a new device',
    content: 'Your Apple ID (your@email.com) was used to sign in to iCloud on iPhone 14 Pro near San Francisco, CA. Feb 7, 2024 at 3:15 PM PST. If this was you, ignore. If not, go to appleid.apple.com.',
    correctAnswer: 'safe',
    explanation: 'Legitimate security alert: You actually signed in on your new iPhone, correct location, tells you to go to website directly not click link.',
    indicators: ['Legitimate security alert', 'Your actual action', 'No suspicious links', 'Professional communication']
  }
];
