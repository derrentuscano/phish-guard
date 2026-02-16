// Cybersecurity Awareness Articles
export const articles = [
  {
    id: 1,
    title: 'Understanding Phishing: The Most Common Cyber Threat',
    category: 'Phishing',
    readTime: '5 min read',
    date: 'February 10, 2026',
    author: 'PhishGuard Team',
    image: '🎣',
    excerpt: 'Learn how to identify and protect yourself from phishing attacks that steal personal information.',
    content: String.raw`
Phishing is one of the most prevalent cyber threats today, affecting millions of people worldwide. Understanding how these attacks work is your first line of defense.

## What is Phishing?

Phishing is a cybercrime where attackers impersonate legitimate organizations to trick victims into revealing sensitive information such as passwords, credit card numbers, or social security numbers.

## Common Types of Phishing

### 1. Email Phishing
The most common form, where attackers send fraudulent emails appearing to be from trusted sources like banks, social media platforms, or government agencies.

### 2. Spear Phishing
Highly targeted attacks aimed at specific individuals or organizations. Attackers research their victims to make emails more convincing.

### 3. Whaling
Phishing attacks targeting high-profile executives or important decision-makers in organizations.

### 4. Smishing (SMS Phishing)
Phishing attacks conducted via text messages, often containing malicious links or phone numbers.

### 5. Vishing (Voice Phishing)
Attackers use phone calls to manipulate victims into revealing personal information.

## Warning Signs

- Urgent language: "Act now or your account will be closed!"
- Generic greetings: "Dear Customer" instead of your name
- Suspicious sender addresses: Look carefully at the email domain
- Spelling and grammar errors: Professional companies proofread their communications
- Mismatched URLs: Hover over links to see the actual destination
- Unexpected attachments: Legitimate companies rarely send unsolicited attachments

## How to Protect Yourself

1. Verify the source: Contact the organization directly using official contact information
2. Don't click suspicious links: Type URLs directly into your browser
3. Use multi-factor authentication: Adds an extra layer of security
4. Keep software updated: Install security patches promptly
5. Use security software: Keep antivirus and anti-malware tools active
6. Report phishing: Forward suspicious emails to your IT department or email provider

## What to Do If You Fall Victim

1. Change your passwords immediately
2. Contact your bank if financial information was compromised
3. Report the incident to relevant authorities
4. Monitor your accounts for suspicious activity
5. Consider placing a fraud alert on your credit report

Remember: Legitimate organizations never ask for sensitive information via email or text message. When in doubt, always verify through official channels.
    `
  },
  {
    id: 2,
    title: 'Creating Strong Passwords: Your First Defense',
    category: 'Security Best Practices',
    readTime: '4 min read',
    date: 'February 12, 2026',
    author: 'PhishGuard Team',
    image: '🔐',
    excerpt: 'Master the art of creating unbreakable passwords and learn why password managers are essential.',
    content: String.raw`
Your password is the key to your digital life. A weak password is like leaving your front door unlocked with a welcome mat for hackers.

## What Makes a Strong Password?

### The Golden Rules

1. Length matters: Minimum 12 characters, preferably 16+
2. Complexity is key: Mix uppercase, lowercase, numbers, and symbols
3. Unpredictability: Avoid dictionary words, personal information, or common patterns
4. Uniqueness: Never reuse passwords across different accounts

### Weak Password Examples (Never Use These!)

- password123
- 12345678
- qwerty
- yourname2026
- letmein

### Strong Password Examples

- Tr!98mK#zQ2$pL&v9
- c0Rr3ct-H0rs3-B@tt3ry-St@pl3
- M7y#D0g&L0v3s$Tr3@ts!2026

## Password Creation Methods

### 1. Random Character Method
Use a password generator to create completely random passwords with mixed characters.

### 2. Passphrase Method
String together random words with special characters:
- "Coffee!Mountain@Purple$Dragon"
- "Pizza#Elephant$Rocket@Moon"

### 3. Modified Sentence Method
Take a memorable sentence and use first letters with substitutions:
- "I love eating 3 tacos every Friday at 5pm!"
- Password: "Ile3te@5p!"

## Password Managers: Your Best Friend

### Why Use a Password Manager?

- Generates complex, unique passwords
- Stores passwords securely with encryption
- Auto-fills login credentials
- Syncs across devices
- Only need to remember one master password

### Popular Password Managers

1. 1Password: User-friendly, family plans available
2. Bitwarden: Open-source, affordable
3. LastPass: Free tier available
4. Dashlane: Includes VPN and dark web monitoring
5. KeePass: Completely free, offline storage

## Two-Factor Authentication (2FA)

Even the strongest password can be compromised. Add 2FA as a second layer:

### Types of 2FA

1. SMS codes: Sent to your phone (least secure)
2. Authenticator apps: Google Authenticator, Authy (more secure)
3. Hardware keys: YubiKey, Titan Key (most secure)
4. Biometrics: Fingerprint, face recognition

## Password Security Checklist

✓ Use unique passwords for each account
✓ Enable 2FA wherever possible
✓ Use a reputable password manager
✓ Check if your passwords have been compromised (haveibeenpwned.com)
✓ Update passwords regularly
✓ Never share passwords
✓ Use biometric authentication when available

Remember: A few extra minutes creating a strong password can save you hours of headaches from a hacked account.
    `
  },
  {
    id: 3,
    title: 'Recognizing Social Engineering Attacks',
    category: 'Security Awareness',
    readTime: '6 min read',
    date: 'February 13, 2026',
    author: 'PhishGuard Team',
    image: '🎭',
    excerpt: 'Social engineering exploits human psychology. Learn how attackers manipulate people and how to resist.',
    content: String.raw`
Social engineering is the art of manipulating people into divulging confidential information or performing actions that compromise security. Unlike technical hacks, these attacks target human psychology.

## What is Social Engineering?

Social engineering attacks exploit human emotions and trust rather than technical vulnerabilities. Attackers manipulate victims into breaking security procedures, revealing sensitive information, or granting unauthorized access.

## Common Social Engineering Tactics

### 1. Pretexting
Attackers create a fabricated scenario to gain trust and extract information.

Example: Someone calls claiming to be from IT support, requesting your password to "fix a problem."

### 2. Baiting
Offering something enticing to trick victims into taking a compromised action.

Example: A USB drive labeled "Employee Salaries 2026" left in a parking lot. Curious victims plug it in, infecting their computer with malware.

### 3. Quid Pro Quo
Promising a service or benefit in exchange for information or access.

Example: "Complete this survey to win a free iPhone! Just provide your email and password."

### 4. Tailgating
Physically following authorized personnel into restricted areas.

Example: Someone carrying boxes asks you to hold the secure door open for them.

### 5. CEO Fraud (Business Email Compromise)
Impersonating executives to authorize fraudulent transactions.

Example: An email appearing to be from the CEO urgently requesting a wire transfer.

## Psychological Triggers

Social engineers exploit these human emotions:

### Authority
People tend to obey authority figures without question.
- Attack: "This is the IRS. Pay immediately or face arrest."
- Defense: Verify identities through official channels.

### Urgency
Creating time pressure prevents rational thinking.
- Attack: "Your account will be closed in 24 hours!"
- Defense: Legitimate organizations give reasonable time frames.

### Fear
Scaring victims into hasty decisions.
- Attack: "Your computer is infected! Call this number now!"
- Defense: Stay calm and verify through trusted sources.

### Trust
Building rapport to lower defenses.
- Attack: "I'm your friend's colleague. Can you help me with...?"
- Defense: Verify relationships independently.

### Greed
Offering too-good-to-be-true rewards.
- Attack: "You've won $1,000,000! Just pay $500 in processing fees."
- Defense: If it seems too good to be true, it probably is.

## How to Protect Yourself

### Verify, Verify, Verify
1. Contact organizations through official channels
2. Call back using publicly listed phone numbers
3. Check email addresses carefully
4. Verify unusual requests with colleagues/supervisors

### Practice Skepticism
- Question unexpected communications
- Don't rush decisions due to pressure
- Trust your instincts
- Think before clicking or responding

### Secure Your Information
- Never share passwords or PINs
- Be cautious with personal information on social media
- Use privacy settings
- Shred sensitive documents

## Red Flags Checklist

🚩 Requests for passwords or sensitive information
🚩 Unusual urgency or pressure
🚩 Threats or aggressive language
🚩 Offers that seem too good to be true
🚩 Requests to bypass security procedures
🚩 Suspicious email addresses or phone numbers
🚩 Poor grammar or spelling
🚩 Unexpected attachments or links

## Remember

- Trust but verify: Always confirm identities
- Slow down: Don't let urgency cloud judgment
- When in doubt, check it out: Verify through official channels
- Report suspicious activity: Help protect others

Social engineering works because it exploits natural human tendencies. Awareness is your best defense. Stay vigilant, trust your instincts, and never feel pressured to act immediately on unexpected requests.
    `
  },
  {
    id: 4,
    title: 'Securing Your Home Network',
    category: 'Network Security',
    readTime: '7 min read',
    date: 'February 14, 2026',
    author: 'PhishGuard Team',
    image: '🌐',
    excerpt: 'Your home network is the gateway to all your devices. Learn how to lock it down properly.',
    content: String.raw`
Your home network is the foundation of your digital security. A compromised network puts all your connected devices at risk. Here's how to fortress your home network.

## Router Security: Your First Line of Defense

### Change Default Credentials
Why it matters: Default router passwords are publicly available online. Hackers can easily find and exploit them.

What to do:
1. Access router admin panel (usually 192.168.1.1 or 192.168.0.1)
2. Change both username and password
3. Use a strong, unique password
4. Write it down and store securely

### Update Router Firmware
Why it matters: Firmware updates patch security vulnerabilities that hackers exploit.

What to do:
1. Check manufacturer's website for updates
2. Enable automatic updates if available
3. Check for updates monthly
4. Read release notes for security fixes

### Disable WPS (Wi-Fi Protected Setup)
Why it matters: WPS has known security vulnerabilities that allow brute-force attacks.

What to do:
1. Access router settings
2. Find WPS settings
3. Disable WPS completely
4. Use WPA3 password entry instead

## Wi-Fi Security

### Choose the Right Encryption

Encryption Standards (worst to best):
- Open/None: Never use - completely unencrypted
- WEP: Obsolete, crackable in minutes
- WPA: Better but still vulnerable
- WPA2: Minimum acceptable standard
- WPA3: Most secure, use if available

Recommendation: Use WPA3 if your router supports it, otherwise WPA2-AES.

### Create a Strong Wi-Fi Password

Requirements:
- Minimum 16 characters
- Mix of letters, numbers, symbols
- Not a dictionary word
- Unique to your network

Example: Blu3M00n$C0ff33@H0m3!Netw0rk

## Network Segmentation

### Guest Network
Create a separate network for visitors:

Benefits:
- Isolates guest devices from your main network
- Protects your personal devices and data
- Easy to disable when not needed

Setup:
1. Enable guest network in router settings
2. Use different SSID (e.g., "YourName-Guest")
3. Set strong password
4. Enable client isolation
5. Set bandwidth limits if desired

### IoT Network
Separate smart home devices from computers and phones:

Why it matters:
- IoT devices often have weak security
- Limits damage if a device is compromised
- Prevents smart devices from accessing personal files

## DNS Security

### Use Encrypted DNS

Why it matters: Default DNS queries are unencrypted and can be intercepted.

Recommended DNS Providers:
- Cloudflare: 1.1.1.1
- Google Public DNS: 8.8.8.8
- Quad9: 9.9.9.9
- OpenDNS: 208.67.222.222

Benefits of Custom DNS:
- Faster browsing
- Block malicious websites
- Filter adult content
- Prevent tracking
- Enhanced security

## VPN for Home Network

### When to Use a VPN

A VPN encrypts all internet traffic from your home:

Best for:
- Public Wi-Fi (coffee shops, hotels)
- Accessing region-locked content
- Enhanced privacy
- Working remotely
- Bypassing ISP throttling

Reputable VPN Services:
- NordVPN
- ExpressVPN
- ProtonVPN
- Mullvad
- IVPN

## Network Security Checklist

✓ Strong, unique router admin password
✓ Latest firmware installed
✓ WPA3 or WPA2 encryption enabled
✓ WPS disabled
✓ Guest network configured
✓ Firewall enabled
✓ DNS configured (Cloudflare or similar)
✓ Unknown devices removed
✓ Regular security updates
✓ Device inventory maintained

Remember: Network security is an ongoing process, not a one-time setup. Regular maintenance and vigilance keep your home network secure.
    `
  },
  {
    id: 5,
    title: 'Mobile Security: Protecting Your Smartphone',
    category: 'Mobile Security',
    readTime: '5 min read',
    date: 'February 15, 2026',
    author: 'PhishGuard Team',
    image: '📱',
    excerpt: 'Smartphones contain our entire digital lives. Essential tips to keep your mobile device secure.',
    content: String.raw`
Your smartphone holds your entire digital life - contacts, photos, banking apps, emails, and more. Securing it is critical. Here's your complete mobile security guide.

## Lock Screen Security

### Choose Strong Authentication

From Weakest to Strongest:
1. None: Never leave your phone unlocked
2. Swipe: Offers zero security
3. Pattern: Can be guessed by watching or screen smudges
4. PIN: Strong if 6+ digits
5. Password: Most secure alphanumeric option
6. Biometrics: Fingerprint or Face ID (with PIN backup)

Best Practice: Use biometrics with a strong 6+ digit PIN as backup.

### Auto-Lock Settings
Set your phone to lock automatically:
- Recommended: 30 seconds to 1 minute
- Maximum: 2 minutes
- Never set to "Never"

## App Security

### Download from Official Stores Only
- iOS: Only from Apple App Store
- Android: Only from Google Play Store
- Avoid third-party app stores
- Never install APK files from unknown sources

### Check App Permissions

Red Flags:
- Flashlight app requesting contacts
- Game requesting location
- Calculator needing camera access
- Wallpaper app wanting call logs

How to Review:
- iOS: Settings > Privacy
- Android: Settings > Apps > Permissions

Rule: If permission doesn't match app function, deny or uninstall.

### Keep Apps Updated
- Enable automatic updates
- Review update descriptions
- Delete unused apps
- Check for updates weekly

## Operating System Updates

### Why Updates Matter
Security patches fix vulnerabilities that hackers exploit.

Best Practices:
- Install updates within 24-48 hours
- Enable automatic downloads
- Connect to Wi-Fi for large updates
- Backup before major OS updates

## Public Wi-Fi Safety

### Dangers of Public Wi-Fi
- Unencrypted networks
- Man-in-the-middle attacks
- Fake hotspots
- Data interception

### Protection Strategies

1. Use VPN: Always enable VPN on public Wi-Fi
2. Avoid Sensitive Activities: No banking or shopping on public Wi-Fi
3. Forget Networks: Remove public Wi-Fi networks after use
4. Disable Auto-Connect: Prevent automatic connection to open networks

## Backup Your Data

### Backup Methods

Cloud Backup:
- iPhone: iCloud
- Android: Google Drive
- Third-party: Dropbox, OneDrive

Local Backup:
- iTunes/Finder (iOS)
- Android File Transfer
- Computer backup software

Best Practice: Use both cloud and local backups.

## Two-Factor Authentication

### SMS vs. Authenticator Apps

SMS (Least Secure):
- Can be intercepted
- SIM swapping attacks
- Better than nothing

Authenticator Apps (More Secure):
- Google Authenticator
- Microsoft Authenticator
- Authy
- Not dependent on cellular service

Hardware Keys (Most Secure):
- YubiKey
- Google Titan
- Physical device required

## Phishing Protection on Mobile

### Be Cautious of:
- Text messages with links
- Unexpected emails
- Social media messages from strangers
- Pop-ups in browsers
- Fake app stores
- QR codes from unknown sources

## Privacy Settings

### iOS Privacy Checklist
✓ Location Services: App-by-app permissions
✓ Contacts: Review app access
✓ Photos: Limited vs. full access
✓ Camera/Microphone: Only needed apps
✓ Tracking: Ask App Not to Track
✓ Analytics: Disable sharing

### Android Privacy Checklist
✓ Location: Precise vs. approximate
✓ App permissions: Regular review
✓ Google activity: Manage tracking
✓ Advertising ID: Opt out
✓ Nearby device permissions
✓ Developer options: Keep disabled

## Mobile Banking Security

### Best Practices
- Use official bank apps only
- Enable app-specific passwords  
- Set up transaction alerts
- Review activity regularly
- Never save passwords in banking apps
- Use biometric login
- Log out after each session

## Physical Security

### Protect Your Device
- Use a protective case
- Install screen protector
- Keep phone in sight
- Don't lend to strangers
- Be aware in public
- Use wrist strap for photos

## Mobile Security Checklist

✓ Strong lock screen (biometrics + PIN)
✓ Auto-lock enabled (30-60 seconds)
✓ OS updated to latest version
✓ All apps updated
✓ App permissions reviewed
✓ VPN installed and configured
✓ Find My Device enabled
✓ Backup configured
✓ Password manager installed
✓ 2FA enabled on accounts
✓ Public Wi-Fi precautions understood
✓ No jailbreak/root
✓ Auto-updates enabled

Your phone is as secure as you make it. Follow these practices to protect your digital life on the go.
    `
  }
];

// Function to get article by ID
export const getArticleById = (id) => {
  return articles.find(article => article.id === parseInt(id));
};

// Function to get articles by category
export const getArticlesByCategory = (category) => {
  return articles.filter(article => article.category === category);
};

// Function to get all categories
export const getCategories = () => {
  return [...new Set(articles.map(article => article.category))];
};
