// Everything the portfolio says about Anup lives here. Edit this file, not the pages.
export const SITE = {
  name: 'Anup Narayanam',
  email: 'anupnarayanam@gmail.com',
  phone: '+91 798-933-0892',
  phoneHref: '+917989330892',
  location: 'Visakhapatnam, Andhra Pradesh, India',
  github: 'https://github.com/AnupNarayanam',
  linkedin: 'https://www.linkedin.com/in/anup-narayanam-a154a3319/',
  instagram: 'https://www.instagram.com/anup_narayanam/',
  resume: '/assets/Anup_Narayanam_Resume.pdf',
  formspreeId: 'YOUR_FORM_ID', // see README: replace to enable the contact form
};

export const ROLES = ['secure web apps', 'agentic AI systems', 'offensive security tooling', 'clean, fast interfaces'];

export const STATS: { n: number; suffix: string; label: string }[] = [
  { n: 20, suffix: '+', label: 'Machines and CTF challenges solved' },
  { n: 3, suffix: '', label: 'Web apps security-assessed' },
  { n: 3, suffix: '', label: 'AI systems in active development' },
  { n: 2, suffix: '+', label: 'Hack The Box seasons completed' },
];

export interface Project { name: string; kind: Kind; status: string; featured: boolean; tagline: string; desc: string; stack: string[]; github: string }
export const PROJECTS: Project[] = [
  {
    name: 'ASTRA', kind: 'ai', status: 'Ongoing', featured: true,
    tagline: 'Personal intelligence operating system',
    desc: 'A modular multi-agent AI operating system integrating finance, healthcare, education, cybersecurity, travel and productivity agents into a unified reasoning platform. Built a scalable FastAPI backend with PostgreSQL, Docker and LangGraph to support agent communication, memory management and personalized decision-making.',
    stack: ['Python', 'FastAPI', 'React', 'PostgreSQL', 'Docker', 'LangGraph', 'PyTorch'],
    github: 'https://github.com/AnupNarayanam',
  },
  {
    name: 'RAVEN', kind: 'security', status: 'Ongoing', featured: true,
    tagline: 'Offensive security intelligence platform',
    desc: 'An AI-powered offensive security platform for automated attack surface discovery, vulnerability assessment and enterprise security intelligence. Engineered a Flask and PostgreSQL backend with Docker and AI-driven knowledge graphs to streamline security analysis and reporting workflows.',
    stack: ['Python', 'Flask', 'PostgreSQL', 'Docker', 'NetworkX', 'LLMs'],
    github: 'https://github.com/AnupNarayanam',
  },
  {
    name: 'R3PORT', kind: 'security', status: 'Ongoing', featured: true,
    tagline: 'Penetration testing reporting platform',
    desc: 'A collaborative penetration testing reporting platform for managing findings, evidence and client-ready security reports. Built with FastAPI and React on PostgreSQL and Docker, integrating AI-assisted report drafting and remediation recommendations.',
    stack: ['FastAPI', 'React', 'PostgreSQL', 'Docker', 'Markdown', 'LLMs'],
    github: 'https://github.com/AnupNarayanam',
  },
  {
    name: 'Portfolio and writeups', kind: 'web', status: 'Live', featured: false,
    tagline: 'This site',
    desc: 'A fully responsive personal site built from scratch: a shared design system, a command palette, an accessible layout, and a writeups section that mirrors my Notion pages (collections, nested pages, search) through a sync script.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'Notion API'],
    github: 'https://github.com/AnupNarayanam',
  },
];

export type Kind = 'ai' | 'security' | 'web';
export const KINDS: [string, string][] = [['all', 'All'], ['ai', 'AI Systems'], ['security', 'Security'], ['web', 'Web Development']];

export const SKILLS: [string, string[]][] = [
  ['Programming and frameworks', ['Python', 'Java', 'JavaScript', 'SQL', 'C', 'React.js', 'Node.js', 'Express.js', 'Next.js', 'Vue.js', 'FastAPI', 'Flask']],
  ['Design', ['Figma', 'Adobe XD', 'Adobe Photoshop']],
  ['Cybersecurity and tools', ['Penetration Testing', 'Web Exploitation', 'Vulnerability Assessment', 'OWASP Top 10', 'API Security', 'Burp Suite', 'Nmap', 'Wireshark', 'Metasploit', 'BloodHound', 'Docker', 'Git and GitHub']],
  ['AI and platforms', ['LLMs', 'Agentic AI', 'RAG', 'MCP', 'Hack The Box', 'PortSwigger Academy', 'TryHackMe']],
];

export const TIMELINE: [string, string, string][] = [
  ['Aug 2024', 'Started B.Tech in Computer Science', 'Began undergraduate studies at Amrita Vishwa Vidyapeetham, Amritapuri, currently maintaining a 7.45/10 GPA.'],
  ['Nov 2024', 'Joined team bi0s', 'Came on board as a Core Member and Security Researcher: penetration testing, CTFs, and mentoring junior members ever since.'],
  ['2024 to present', '20+ machines and CTF challenges', 'Worked through 2+ Hack The Box seasons, PortSwigger Web Security Academy labs, and real-world vulnerability assessments across 3+ web applications.'],
  ['Jul 2026', 'Started ASTRA, RAVEN and R3PORT', 'Began building three parallel systems: a personal AI operating system, an offensive security intelligence platform, and a pentest reporting tool.'],
  ['Present', 'Building and mentoring', 'Actively developing ASTRA, RAVEN and R3PORT while continuing security research and mentorship at team bi0s.'],
];
