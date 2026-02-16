// Cybersecurity quiz questions
export const cybersecurityQuestions = [
  {
    id: 'q1',
    question: 'What is phishing?',
    options: [
      'A type of malware that encrypts your files',
      'A fraudulent attempt to obtain sensitive information by disguising as a trustworthy entity',
      'A method of securing your network',
      'A type of firewall protection'
    ],
    correctAnswer: 1,
    explanation: 'Phishing is a cybercrime where attackers impersonate legitimate organizations to trick victims into providing sensitive information like passwords, credit card numbers, or personal data.'
  },
  {
    id: 'q2',
    question: 'Which of the following is a sign of a phishing email?',
    options: [
      'Personalized greeting with your name',
      'Urgent language and threats of account closure',
      'Official company logo',
      'Proper spelling and grammar'
    ],
    correctAnswer: 1,
    explanation: 'Phishing emails often create a sense of urgency to pressure victims into acting quickly without thinking. Threats of account closure or "immediate action required" are common red flags.'
  },
  {
    id: 'q3',
    question: 'What does HTTPS in a URL indicate?',
    options: [
      'The website is definitely safe',
      'The connection between your browser and the website is encrypted',
      'The website has been verified by the government',
      'The website cannot contain malware'
    ],
    correctAnswer: 1,
    explanation: 'HTTPS (HyperText Transfer Protocol Secure) indicates that the connection is encrypted, protecting data in transit. However, it does NOT guarantee the website is legitimate - phishing sites can also use HTTPS.'
  },
  {
    id: 'q4',
    question: 'What is two-factor authentication (2FA)?',
    options: [
      'Using two different passwords',
      'Logging in twice to verify your identity',
      'A security process requiring two different forms of identification',
      'Having two accounts for the same service'
    ],
    correctAnswer: 2,
    explanation: 'Two-factor authentication adds an extra layer of security by requiring two different forms of verification - typically something you know (password) and something you have (phone, security key).'
  },
  {
    id: 'q5',
    question: 'Which password is the strongest?',
    options: [
      'Password123',
      'MyDogName2024',
      'p@ssw0rd',
      'Tr!98mK#zQ2$pL'
    ],
    correctAnswer: 3,
    explanation: 'A strong password should be long (12+ characters), contain uppercase and lowercase letters, numbers, and special characters, and not be based on dictionary words or personal information.'
  },
  {
    id: 'q6',
    question: 'What is malware?',
    options: [
      'A type of email spam',
      'Malicious software designed to harm or exploit devices',
      'A secure email protocol',
      'A password manager'
    ],
    correctAnswer: 1,
    explanation: 'Malware (malicious software) includes viruses, trojans, ransomware, spyware, and other harmful programs designed to damage systems, steal data, or gain unauthorized access.'
  },
  {
    id: 'q7',
    question: 'What should you do if you receive a suspicious email asking for your password?',
    options: [
      'Reply with your password if it looks official',
      'Click the link to verify if it\'s legitimate',
      'Delete it immediately and report it as phishing',
      'Forward it to your friends to warn them'
    ],
    correctAnswer: 2,
    explanation: 'Never provide passwords via email. Legitimate organizations never ask for passwords through email. Delete suspicious emails and report them to your IT department or email provider.'
  },
  {
    id: 'q8',
    question: 'What is ransomware?',
    options: [
      'Software that blocks access to your data until a ransom is paid',
      'A tool to protect against hackers',
      'A type of antivirus software',
      'A secure file storage system'
    ],
    correctAnswer: 0,
    explanation: 'Ransomware is malicious software that encrypts your files or locks your system, demanding payment (ransom) for restoration. Never pay the ransom - instead, restore from backups and report to authorities.'
  },
  {
    id: 'q9',
    question: 'Which of these is the safest way to access your bank account online?',
    options: [
      'Click a link in an email from your bank',
      'Use public Wi-Fi at a coffee shop',
      'Type the bank\'s URL directly into your browser',
      'Use a search engine link'
    ],
    correctAnswer: 2,
    explanation: 'Always type the official URL directly into your browser or use a trusted bookmark. Avoid clicking email links or search results which could lead to fake lookalike sites.'
  },
  {
    id: 'q10',
    question: 'What is social engineering in cybersecurity?',
    options: [
      'Building secure social media platforms',
      'Manipulating people into divulging confidential information',
      'Engineering better social networks',
      'A type of encryption method'
    ],
    correctAnswer: 1,
    explanation: 'Social engineering is psychological manipulation used to trick people into revealing sensitive information or performing actions that compromise security. It exploits human psychology rather than technical vulnerabilities.'
  },
  {
    id: 'q11',
    question: 'What should you check before clicking a link in an email?',
    options: [
      'The subject line',
      'The sender\'s profile picture',
      'Hover over the link to see the actual URL destination',
      'The email signature'
    ],
    correctAnswer: 2,
    explanation: 'Always hover over links (without clicking) to see the actual URL. Phishing emails often display one URL but link to a different malicious site. Verify the destination matches the expected domain.'
  },
  {
    id: 'q12',
    question: 'What is a VPN?',
    options: [
      'A type of computer virus',
      'Virtual Private Network that encrypts your internet connection',
      'A password storage system',
      'A video calling platform'
    ],
    correctAnswer: 1,
    explanation: 'A VPN (Virtual Private Network) creates an encrypted tunnel for your internet traffic, protecting your data from eavesdropping and masking your IP address, especially useful on public Wi-Fi.'
  },
  {
    id: 'q13',
    question: 'Which action increases your vulnerability to cyberattacks?',
    options: [
      'Using unique passwords for each account',
      'Enabling automatic software updates',
      'Disabling antivirus software to improve performance',
      'Using a password manager'
    ],
    correctAnswer: 2,
    explanation: 'Disabling antivirus software removes a critical defense layer. While it might slightly improve performance, it dramatically increases vulnerability to malware, viruses, and other cyber threats.'
  },
  {
    id: 'q14',
    question: 'What is "spear phishing"?',
    options: [
      'Phishing attacks targeting specific individuals or organizations',
      'A weapon used in cyber warfare',
      'A type of firewall',
      'Generic spam emails sent to millions'
    ],
    correctAnswer: 0,
    explanation: 'Spear phishing is highly targeted phishing that uses personal information to appear more legitimate. Attackers research victims to create convincing, personalized messages, making them more dangerous than generic phishing.'
  },
  {
    id: 'q15',
    question: 'How often should you update your passwords?',
    options: [
      'Never, if they\'re strong enough',
      'Every 90 days, or immediately if a breach is suspected',
      'Only when you forget them',
      'Once a year'
    ],
    correctAnswer: 1,
    explanation: 'Best practice is to change passwords every 90 days and immediately if there\'s any suspicion of compromise or after a known data breach. Use unique passwords for different accounts.'
  },
  {
    id: 'q16',
    question: 'What is a "zero-day" vulnerability?',
    options: [
      'A vulnerability discovered and exploited before developers can create a patch',
      'A security flaw that\'s been known for zero days',
      'A harmless bug in software',
      'A vulnerability that takes zero days to fix'
    ],
    correctAnswer: 0,
    explanation: 'Zero-day vulnerabilities are security flaws unknown to the software vendor. Cybercriminals exploit them before a patch is available, making them particularly dangerous.'
  },
  {
    id: 'q17',
    question: 'What is the purpose of a firewall?',
    options: [
      'To keep your computer cool',
      'To monitor and control incoming and outgoing network traffic',
      'To increase internet speed',
      'To backup your data'
    ],
    correctAnswer: 1,
    explanation: 'A firewall acts as a barrier between trusted internal networks and untrusted external networks, monitoring and controlling traffic based on predetermined security rules to prevent unauthorized access.'
  },
  {
    id: 'q18',
    question: 'What should you do with software updates?',
    options: [
      'Ignore them to avoid bugs',
      'Install them only once a year',
      'Install them promptly as they often contain security patches',
      'Wait until others have tested them first'
    ],
    correctAnswer: 2,
    explanation: 'Software updates frequently include critical security patches. Installing them promptly closes vulnerabilities that could be exploited by attackers. Enable automatic updates when possible.'
  },
  {
    id: 'q19',
    question: 'What is "whaling" in cybersecurity?',
    options: [
      'A type of large-scale DDoS attack',
      'Phishing attacks targeting high-profile executives',
      'A marine biology research method',
      'A technique to encrypt data'
    ],
    correctAnswer: 1,
    explanation: 'Whaling is phishing that targets high-level executives (the "big fish"). These attacks are highly sophisticated and personalized, often aiming to trick executives into authorizing financial transfers or revealing sensitive information.'
  },
  {
    id: 'q20',
    question: 'Which is the most secure method to share sensitive information?',
    options: [
      'Via regular email',
      'Through encrypted channels or secure file-sharing services',
      'Text message',
      'Social media direct message'
    ],
    correctAnswer: 1,
    explanation: 'Sensitive information should only be shared through encrypted communication channels or secure file-sharing services. Regular email, SMS, and social media are not secure for confidential data.'
  }
];

// Function to get random quiz questions
export const getRandomQuestions = (count = 5) => {
  const shuffled = [...cybersecurityQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
