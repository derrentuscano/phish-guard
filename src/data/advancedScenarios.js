// Advanced and diverse phishing scenarios

export const advancedScenarios = [
  // BANKING SECTOR
  {
    id: 'bank_001',
    type: 'email',
    category: 'Banking',
    difficulty: 'hard',
    from: 'security-alert@chase-verify.com',
    subject: 'URGENT: Unusual Activity Detected on Your Account',
    content: `Dear Valued Customer,

We have detected unusual activity on your Chase account ending in **7284. For your security, we have temporarily limited access to your account.

To restore full access, please verify your identity immediately:
👉 Verify Account Now: https://chase-secure-verify.com/confirm

Recent suspicious transactions:
- $847.99 - Amazon Purchase - Pending
- $1,250.00 - Wire Transfer - Blocked  
- $459.50 - PayPal Payment - Flagged

If you do not recognize these transactions, please act within 24 hours to prevent account closure.

Thank you for banking with Chase.

Chase Security Team
© 2026 JPMorgan Chase Bank, N.A.`,
    correctAnswer: 'phishing',
    explanation: 'This is a sophisticated phishing attempt targeting Chase bank customers. Red flags: suspicious sender domain (chase-verify.com instead of chase.com), urgent language, threatening account closure, and a fake verification link. Legitimate banks never ask customers to verify accounts via email links.',
    indicators: [
      'Suspicious sender domain (chase-verify.com)',
      'Creates urgency with 24-hour deadline',
      'Fake verification link to steal credentials',
      'Generic greeting instead of your name',
      'Threatens account closure to pressure action'
    ],
    realWorldContext: 'Banking phishing attacks cost victims over $58 million in 2025. Always verify suspicious emails by calling your bank directly using the number on your card or official website.',
    tips: [
      'Check the sender\'s email domain carefully',
      'Never click links in suspicious bank emails',
      'Log into your bank account directly through the official website or app',
      'Banks will never ask you to verify your account via email'
    ]
  },
  {
    id: 'bank_002',
    type: 'email',
    category: 'Banking',
    difficulty: 'medium',
    from: 'alerts@wellsfargo.com',
    subject: 'Your Wells Fargo Statement is Ready',
    content: `Hello,

Your monthly statement for account ending in 4829 is now available.

View Statement: https://wellsfargo.com/statements/view?id=202601

Transaction Summary:
• Deposits: $3,240.00
• Withdrawals: $2,876.43
• Current Balance: $8,423.57

Thank you for banking with Wells Fargo.

Wells Fargo Bank, N.A.
FDIC Insured`,
    correctAnswer: 'legitimate',
    explanation: 'This is a legitimate statement notification. The email domain matches Wells Fargo\'s official domain, there\'s no urgent call to action, and the link structure appears legitimate. Banks regularly send statement notifications via email.',
    indicators: [
      'Legitimate wellsfargo.com domain',
      'No urgent or threatening language',
      'Standard monthly statement notification',
      'Professional formatting',
      'No request for personal information'
    ],
    tips: [
      'Even legitimate-looking emails should be verified',
      'You can still access statements by logging in directly',
      'Watch for slight domain misspellings in similar emails'
    ]
  },

  // HEALTHCARE SECTOR
  {
    id: 'health_001',
    type: 'email',
    category: 'Healthcare',
    difficulty: 'hard',
    from: 'patientportal@mychart-health.net',
    subject: 'You Have 1 New Test Result - View Now',
    content: `Dear Patient,

You have a new lab test result available in your MyChart portal.

Test: Complete Blood Count (CBC)
Date: January 15, 2026
Status: Ready for Review

🔔 IMPORTANT: This result requires your immediate attention.

Click here to view your result: https://mychart-health.net/portal/login

Your test results will expire in 48 hours if not viewed.

If you have questions about your results, please contact your healthcare provider.

MyChart Patient Portal
Powered by Epic Systems`,
    correctAnswer: 'phishing',
    explanation: 'This is a healthcare phishing scam. Red flags: the domain is mychart-health.net (fake) instead of the legitimate healthcare provider\'s MyChart portal, creates false urgency about results expiring, and uses scare tactics about "immediate attention." Real patient portals won\'t send direct login links.',
    indicators: [
      'Fake domain (mychart-health.net)',
      'Creates false urgency with expiration threat',
      'Direct login link instead of directing to official portal',
      'Vague "requires immediate attention" without specifics',
      'No specific doctor or facility name'
    ],
    realWorldContext: 'Healthcare phishing is rising with 43% increase in 2025. Attackers exploit patient anxiety about health results. Always access your patient portal by typing the URL directly or using your hospital\'s official app.',
    tips: [
      'Never click email links to access medical results',
      'Type your patient portal URL directly into your browser',
      'Test results don\'t expire in 48 hours',
      'Contact your healthcare provider directly if unsure'
    ]
  },
  {
    id: 'health_002',
    type: 'email',
    category: 'Healthcare',
    difficulty: 'medium',
    from: 'insurance@uhc.com',
    subject: 'Update Your Health Insurance Information',
    content: `Dear Member,

We need you to update your health insurance information to avoid a lapse in coverage.

Your current plan expires: March 31, 2026

ACTION REQUIRED: Update your information now
Link: http://uhc-member-update.com/verify

Failure to update may result in:
❌ Loss of coverage
❌ Increased premiums
❌ Denied claims

Update by January 25th to maintain your benefits.

UnitedHealthcare Member Services`,
    correctAnswer: 'phishing',
    explanation: 'This is a phishing attack impersonating UnitedHealthcare. Red flags: suspicious domain (uhc-member-update.com), creates panic about losing coverage, and uses threatening language. Real insurance companies send update requests through secure member portals, not email links.',
    indicators: [
      'Fake update domain separate from uhc.com',
      'Threatens loss of coverage to create panic',
      'Arbitrary deadline to pressure quick action',
      'Generic "Dear Member" greeting',
      'No policy number or specific member details'
    ],
    tips: [
      'Insurance updates should be done through official portals',
      'Call your insurance company using the number on your card',
      'Be skeptical of coverage threat emails'
    ]
  },

  // EDUCATION SECTOR
  {
    id: 'edu_001',
    type: 'email',
    category: 'Education',
    difficulty: 'medium',
    from: 'registrar@university.edu',
    subject: 'Financial Aid Refund Available',
    content: `Dear Student,

Good news! You have a financial aid refund of $1,847.00 available.

To process your refund, please verify your bank account information:

🔗 Claim Your Refund: https://university-refunds.com/claim

You must complete verification by January 22nd or your refund will be forfeited.

Student Account #: 00428519
Refund Amount: $1,847.00

Questions? Contact the Bursar's Office.

University Financial Aid Office`,
    correctAnswer: 'phishing',
    explanation: 'This is an education sector phishing scam. Red flags: external domain for "refunds" (university-refunds.com), requests bank account information via email, and threatens to forfeit money. Universities process refunds through secure student portals and direct deposit systems already on file.',
    indicators: [
      'Suspicious refund claim domain',
      'Requests bank account verification via link',
      'Threatens to forfeit money to create urgency',
      'Too good to be true unexpected refund',
      'No mention of semester or aid package details'
    ],
    realWorldContext: 'Students lose millions annually to financial aid scams. Universities never request banking information via email. Refunds are processed through pre-registered direct deposit or mailed checks.',
    tips: [
      'Check your official student portal for real refund status',
      'Contact your financial aid office directly',
      'Universities already have your banking information on file',
      'Be skeptical of unexpected money offers'
    ]
  },
  {
    id: 'edu_002',
    type: 'email',
    category: 'Education',
    difficulty: 'hard',
    from: 'noreply@canvas.instructure.com',
    subject: 'Your Grade Has Been Posted - BIOL 201',
    content: `Hello,

Your instructor has posted a new grade for BIOL 201 - Human Anatomy.

Assignment: Midterm Exam
Status: Graded
Posted: January 18, 2026 2:34 PM

Log in to Canvas to view your grade: https://canvas.instructure.com/courses/47382/grades

This is an automated message from Canvas. Please do not reply to this email.

Canvas by Instructure
© 2026 Instructure, Inc.`,
    correctAnswer: 'legitimate',
    explanation: 'This is a legitimate Canvas notification. The email is from Canvas\'s official domain (canvas.instructure.com), uses standard LMS notification format, doesn\'t request any personal information, and simply notifies of a grade posting. The link structure is typical for Canvas.',
    indicators: [
      'Legitimate canvas.instructure.com domain',
      'Standard Canvas notification format',
      'No requests for personal information',
      'Typical LMS automated message style',
      'Professional and consistent with platform notifications'
    ],
    tips: [
      'Even with legitimate emails, you can access Canvas directly',
      'Watch for similar phishing emails with slight domain changes',
      'Canvas will never ask for password reset via email link'
    ]
  },

  // SEASONAL: TAX SEASON
  {
    id: 'tax_001',
    type: 'email',
    category: 'Tax Season',
    difficulty: 'hard',
    from: 'notice@irs.gov.verify-portal.com',
    subject: 'IRS: Action Required - Tax Return Under Review',
    content: `INTERNAL REVENUE SERVICE
Department of the Treasury

Dear Taxpayer,

Your 2025 tax return (Form 1040) is currently under review due to a discrepancy in reported income.

Reference Number: IRS-2026-847392

To avoid penalties and interest charges, you must verify your identity and income information immediately.

⚠️ VERIFY NOW: https://irs.gov.verify-portal.com/taxpayer-id

Failure to respond within 72 hours will result in:
• Automatic audit proceedings
• Penalties up to $5,000
• Possible criminal investigation

Your cooperation is required by law under Title 26 USC §7201.

Internal Revenue Service
Tax Processing Center`,
    correctAnswer: 'phishing',
    explanation: 'This is a sophisticated IRS impersonation scam common during tax season. Red flags: fake domain (irs.gov.verify-portal.com - note the subdomain trick), IRS never sends emails about audits, threatens criminal investigation to create panic, and requests immediate verification. The IRS contacts taxpayers by mail, not email.',
    indicators: [
      'Fake IRS domain with deceptive subdomain structure',
      'IRS never initiates contact via email',
      'Creates panic with criminal investigation threat',
      'Requests immediate online verification',
      '72-hour deadline to pressure quick action',
      'Uses official-looking reference numbers to seem legitimate'
    ],
    realWorldContext: 'Tax season phishing peaks from January-April. The IRS will NEVER initiate contact via email, text, or social media about tax issues. All legitimate IRS communication comes via  U.S. Mail. These scams cost taxpayers over $60 million in 2025.',
    tips: [
      'IRS ALWAYS contacts you by mail first, never email',
      'Report IRS phishing to phishing@irs.gov',
      'Real IRS audits take months with multiple mailings',
      'If concerned, call IRS directly at 1-800-829-1040'
    ]
  },
  {
    id: 'tax_002',
    type: 'email',
    category: 'Tax Season',
    difficulty: 'medium',
    from: 'taxprep@turbotax.intuit.com',
    subject: 'Your TurboTax Account May Be at Risk',
    content: `Hi there,

We've detected a login attempt to your TurboTax account from an unrecognized device:

Device: iPhone 14
Location: Miami, FL
Date: January 18, 2026 11:42 PM

If this wasn't you, secure your account immediately:
https://turbotax.intuit.com/security/verify

Your tax information and refund may be at risk if someone has accessed your account.

Stay secure,
TurboTax Security Team`,
    correctAnswer: 'phishing',
    explanation: 'This is a phishing attempt disguised as a security alert. While the domain looks correct at first glance, legitimate TurboTax security alerts would direct you to verify through the app or by logging in directly, not through an emailed link. The fear tactic about tax refund risk is designed to make you click quickly.',
    indicators: [
      'Requests immediate action via emailed link',
      'Creates fear about tax information and refund',
      'Vague unrecognized device alert',
      'No account-specific details included',
      'Trying to make you panic and click quickly'
    ],
    tips: [
      'Log into TurboTax directly through their website',
      'Enable two-factor authentication on tax software',
      'Real security alerts appear in the app first',
      'Don\'t click email links for account security'
    ]
  },

  // SEASONAL: HOLIDAY SHOPPING
  {
    id: 'holiday_001',
    type: 'email',
    category: 'Holiday Shopping',
    difficulty: 'medium',
    from: 'deals@amazon-holiday-2026.com',
    subject: '🎁 EXCLUSIVE: Prime Member Black Friday Early Access',
    content: `Happy Holidays!

As a valued Prime member, you've been selected for EARLY ACCESS to our Black Friday Deals!

⚡️ FLASH SALE - Next 3 Hours Only:
• 75% OFF Electronics
• 60% OFF Home & Kitchen
• 50% OFF Fashion & Beauty

🎯 Shop Now: https://amazon-holiday-2026.com/prime-early-access

Plus, complete this quick survey to enter our Holiday Giveaway:
🎁 Grand Prize: $2,500 Amazon Gift Card

Exclusive access expires: January 19, 2026 at 11:59 PM

Happy Shopping!
Amazon Prime Team`,
    correctAnswer: 'phishing',
    explanation: 'This is a holiday shopping scam impersonating Amazon. Red flags: fake domain (amazon-holiday-2026.com instead of amazon.com), unrealistic 75% discounts, fake "early access" invitation, and survey giveaway trick. Scammers exploit holiday shopping urgency and big discount expectations.',
    indicators: [
      'Fake Amazon domain with "holiday-2026" added',
      'Too good to be true discount percentages',
      'Fake "selected member" exclusivity tactic',
      'Survey to collect personal information',
      'Short urgency window (3 hours) to prevent thinking',
      'Oddly timed in January, not actual Black Friday'
    ],
    realWorldContext: 'Holiday shopping scams surge 300% during November-December, but also spike post-holidays with "clearance" scams. In 2025, fake Amazon emails cost consumers $89 million. Always shop through official retailer websites and apps.',
    tips: [
      'Amazon deals are posted on amazon.com, not external sites',
      'Be skeptical of exclusive member-only offers via email',
      'Discounts over 70% are almost always scams',
      'Shop directly through official apps and websites'
    ]
  },

  // DEEPFAKE DETECTION
  {
    id: 'deepfake_001',
    type: 'video_email',
    category: 'Deepfake',
    difficulty: 'hard',
    from: 'ceo@company.com',
    subject: 'URGENT: Video Message from CEO - Wire Transfer Needed',
    content: `[VIDEO ATTACHMENT: CEO_Message_Urgent.mp4]

Team,

I'm sending this video message because I'm in meetings all day and can't be reached by phone.

We have an urgent acquisition opportunity that requires immediate wire transfer of $50,000 to secure the deal. This is time-sensitive and confidential - DO NOT discuss with anyone else.

Our CFO is out sick, so I need you to process this transfer today:

Account Holder: Strategic Partners LLC
Routing: 021000021
Account: 847293847

Verbal approval has been granted. Just need you to execute.

Watch my video message for full details and authorization code.

Thanks,
CEO Name`,
    correctAnswer: 'phishing',
    explanation: 'This is a sophisticated deepfake CEO fraud scam. Red flags: unusual communication channel for large financial request, CFO conveniently unavailable, extreme urgency and secrecy requirements, and direct wire transfer request. Even if a video looks real, always verify large financial requests through multiple channels.',
    indicators: [
      'Unusual request for large wire transfer',
      'Key financial approver (CFO) conveniently absent',
      'Secrecy and urgency combined',
      'Direct account details provided in email',
      'Video could be deepfake AI-generated',
      'No standard approval process followed'
    ],
    realWorldContext: 'CEO fraud with deepfake videos cost businesses $430 million in 2025. AI-generated video and audio can now convincingly impersonate executives. Always verify large financial requests through multiple channels and in-person when possible.',
    tips: [
      'Verify ALL large financial requests through phone call to known number',
      'Legitimate urgent requests follow approval processes',
      'Be skeptical of video/audio-only financial authorizations',
      'Implement dual authorization for wire transfers',
      'Deepfake videos may have subtle visual glitches or audio sync issues'
    ]
  },

  // RANSOMWARE AWARENESS
  {
    id: 'ransomware_001',
    type: 'email',
    category: 'Ransomware',
    difficulty: 'hard',
    from: 'support@adobe-cloud.com',
    subject: 'Adobe Creative Cloud - Action Required: License Verification',
    content: `Dear Adobe Creative Cloud User,

Your Adobe Creative Cloud subscription requires immediate license verification to prevent service interruption.

We've detected irregular activity and need you to verify your license:

📄 Download Verification Tool: https://adobe-cloud.com/verify-license.exe

Please run the verification tool to restore full access to:
• Photoshop
• Illustrator  
• Premiere Pro
• After Effects

This tool will:
✅ Verify your subscription status
✅ Repair any corrupted files
✅ Update to the latest version

Failure to verify within 24 hours will result in license suspension.

Adobe Systems Technical Support`,
    correctAnswer: 'phishing',
    explanation: 'This is a ransomware delivery scam disguised as Adobe verification. CRITICAL RED FLAGS: Asks you to download and run an .exe file from email, fake Adobe domain, and creates urgency about license suspension. The .exe file would contain ransomware that encrypts your files and demands payment. NEVER download executable files from emails.',
    indicators: [
      'Requests downloading and running .exe file - MAJOR RED FLAG',
      'Fake Adobe domain (adobe-cloud.com)',
      'License verification is not done through downloadable tools',
      'Creates urgency with 24-hour threat',
      'exe files from emails are almost always malware',
      'Adobe software updates through their app, not email'
    ],
    realWorldContext: 'Ransomware attacks increased 93% in 2025, with average ransom demands of $812,000. Email attachments and download links are the #1 delivery method. Once ransomware encrypts your files, recovery without backups is nearly impossible. Some victims pay and still don\'t get their files back.',
    tips: [
      'NEVER download .exe, .zip, .scr, or .bat files from emails',
      'Software verification happens through the app itself',
      'Adobe Creative Cloud manages licenses through their website',
      'Keep regular offline backups to protect against ransomware',
      'Use antivirus software and keep it updated'
    ]
  },
  {
    id: 'ransomware_002',
    type: 'email',
    category: 'Ransomware',
     difficulty: 'medium',
    from: 'invoices@accounting-dept.biz',
    subject: 'Invoice #847392 - Payment Overdue',
    content: `OVERDUE INVOICE NOTICE

Invoice Number: INV-847392
Amount Due: $2,847.50
Due Date: January 10, 2026
Days Overdue: 8

Please review the attached invoice immediately. Payment is now 8 days past due.

📎 ATTACHMENT: Invoice_847392.pdf.zip

Late fees of $150 will be applied if payment is not received within 48 hours.

For questions, reply to this email or call: 555-0194

Accounts Receivable Department`,
    correctAnswer: 'phishing',
    explanation: 'This is a ransomware delivery attempt disguised as an overdue invoice. Red flags: suspicious domain (accounting-dept.biz), double file extension (.pdf.zip is a common malware disguise), unsolicited invoice from unknown company, and urgency with late fees. The zip file contains ransomware that will encrypt your files if extracted and opened.',
    indicators: [
      'Suspicious generic domain (accounting-dept.biz)',
      'Double file extension .pdf.zip is malware disguise',
      'Unsolicited invoice from unfamiliar sender',
      'Creates urgency with late fees',
      'No company name or legitimate business details',
      'Zip attachments from unknown senders are high risk'
    ],
    tips: [
      'Never open zip or rar attachments from unknown senders',
      'Verify invoices by contacting the company directly',
      'Double file extensions are a common malware trick',
      'Legitimate businesses provide clear company identification',
      'Use email security filters to block suspicious attachments'
    ]
  }
];

export default advancedScenarios;
