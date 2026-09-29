// Content for the README panels. Source of truth: the portfolio (SAQLAINAP/me).
import { C } from './lib.mjs';

export const ABOUT = [
  ['name', 'Saqlain Ahmed P'],
  ['role', 'Forward Deployed Engineer @ Plivo'],
  ['education', 'B.E. AI & ML — DSCE Bangalore (2022–26)'],
  ['cgpa', '9.25 / 10'],
  ['focus', ['voice-ai', 'rag', 'agentic-systems', 'full-stack']],
  ['exploring', ['web3', 'iot', 'cloud-native']],
  ['wins', '8 hackathons · 1st in debate, seminar & extempore'],
  ['off-duty', 'movies · gaming · community meetups'],
  ['ask-me', 'AI · ML · GenAI · DevOps · InfoSec'],
  ['status', 'open to collaborations'],
];

export const ROLES = [
  {
    now: true, company: 'PLIVO', role: 'FORWARD DEPLOYED ENGINEER', period: 'FEB 2026 — NOW',
    points: ['AI IVR platform + agentic query-resolution chatbot', 'Internal RAG knowledge system with n8n automations', 'Benchmarked 8 voice AI vendors on real PSTN calls'],
    chips: ['+25% EDA EFFICIENCY', '8 VENDORS BENCHMARKED'],
  },
  {
    year: '2025', company: 'KROOLO AI', role: 'PRODUCT DEV & ENGINEERING INTERN', period: 'JUL — NOV 2025',
    points: ['Policy analyzer & generator, built from scratch', 'Enterprise Search features on the Kroolo platform'],
    chips: ['40+ POLICIES · 90%+ ACC', '−40% REVIEW TIME', '−30% SEARCH TIME'],
  },
  {
    year: '2025', company: 'GETCREATR AI', role: 'PROMPT ENGINEERING INTERN', period: 'MAY — JUL 2025',
    points: ['Shipped 5 end-to-end AI full-stack apps', 'Portfolio builds + client engagements on Creatr'],
    chips: ['5 APPS SHIPPED', '$3,000+ CLIENT REVENUE'],
  },
];

export const PROJECTS = [
  { id: 'codecity', name: 'CodeCity', shadow: C.cyan, url: 'https://github.com/SAQLAINAP/CodeCity',
    desc: 'A visual trust layer for AI coding agents: every file is a building, every agent action a visible event.',
    stack: ['JAVASCRIPT', 'CANVAS', 'CLAUDE CODE HOOKS'] },
  { id: 'gitclaw-agent', name: 'GitClaw', shadow: C.pink, url: 'https://github.com/SAQLAINAP/GitClaw-Agent',
    desc: 'AI PR reviewer that runs like production software: OTel traces, drift detection, signed audit log, 5-LLM fallback.',
    stack: ['NODE.JS', 'ANTHROPIC SDK', 'OTEL'] },
  { id: 'foundermap', name: 'FounderMap', shadow: C.orange, live: true, url: 'https://github.com/SAQLAINAP/FounderMap',
    desc: 'Free global index of accelerators, grants and fellowships. Scraped every 72h, LLM-classified, zero infra cost.',
    stack: ['NEXT.JS', 'PYTHON', 'GROQ'] },
  { id: 'resume-forge', name: 'Resume-Forge', shadow: C.lime, live: true, url: 'https://github.com/SAQLAINAP/resume-forge',
    desc: 'Offline, ATS-safe résumé builder: 32 formats, PDF / Word / LaTeX export, PWA + Android. No backend at all.',
    stack: ['REACT', 'TYPESCRIPT', 'CAPACITOR'] },
  { id: 'iddc', name: 'IDDC', shadow: C.green, url: 'https://github.com/SAQLAINAP/Intent-Driven-Degradation-Contract',
    desc: 'Write a degradation.yaml, compile it, and the runtime enforces it: replicas, flags and queues shift on signals.',
    stack: ['GO', 'KUBERNETES', 'PROMETHEUS'] },
  { id: 'poligap', name: 'PoliGap', shadow: C.violet, url: 'https://github.com/SAQLAINAP/Poligap',
    desc: 'AI contract and compliance analysis that finds risks, gaps and deviations in minutes, with every clause cited.',
    stack: ['FASTAPI', 'NEXT.JS', 'PORTKEY'] },
];

export const ALSO = ['Pishani', 'SafeClick', 'Architectural AI', 'NewsPod', 'Speech Spam Detector', 'DevGuardian'];

export const TOOLBOX = [
  ['LANGUAGES', ['py', 'ts', 'js', 'go', 'java', 'cpp', 'c', 'bash']],
  ['AI / ML', ['pytorch', 'tensorflow', 'sklearn'], ['OPENAI', 'ANTHROPIC', 'GEMINI', 'GROQ', 'N8N', 'CHROMADB']],
  ['FRONTEND', ['react', 'nextjs', 'vue', 'tailwind', 'html', 'css']],
  ['BACKEND', ['nodejs', 'express', 'fastapi', 'flask', 'graphql', 'postman']],
  ['CLOUD & DEVOPS', ['aws', 'docker', 'kubernetes', 'githubactions', 'jenkins', 'grafana', 'prometheus', 'linux', 'git', 'vercel']],
  ['DATA', ['postgres', 'mongodb', 'redis', 'supabase', 'firebase', 'sqlite', 'mysql']],
  ['DESIGN & IOT', ['figma', 'ps', 'arduino']],
];

export const HACKATHONS = [
  ['AI AGENTS QUIZ · BTW', 'AUG 2026'],
  ['NANO HACKATHON × GITHUB COPILOT', 'DEC 2025'],
  ['KASPERSKY × MAHE HACKATHON', 'NOV 2025'],
  ['CODERUSH · GENESIS (DSCE)', 'SEP 2025'],
  ['FUTURE OF WORK × KROOLO', 'JUN 2025'],
  ['CASE-STUDY CONTEST · WESRIJAN', 'APR 2025'],
  ['GETCREATR VIBE-CODING SHOWDOWN', 'MAR 2025'],
  ['AUGUST AI AGENTS HACKATHON', 'NOV 2024'],
];

// [top line, main line, fill, rotation]
export const SCHOLAR = [
  ['LINUX FOUNDATION · 2023 + 2026', 'SHUBHRA KAR SCHOLAR', C.yellow, -2],
  ['GOOGLE × IBM × QUBITXQUBIT', 'QUANTUM SCHOLAR', C.cream, 1.5],
  ['DSCE · 2023', 'AI-ML SCHOLARSHIP', C.cyan, -1],
  ['FINALIST', 'ALGORAND · CONQUEST · XARTUP', C.ink, 2],
];

export const CERTS = [
  { id: 'kcna', issuer: 'CNCF · 2025', title: 'KCNA', sub: 'Kubernetes & Cloud Native Assoc.', shadow: C.cyan,
    url: 'https://ti-user-certificates.s3.amazonaws.com/e0df7fbf-a057-42af-8a1f-590912be5460/9e333afe-60bd-474e-8ff5-6f90d19d5f48-saqlain-ahmed-p-8deae288-6dea-448e-854e-93c09134aae3-certificate.pdf' },
  { id: 'cs50x', issuer: 'HARVARD · 2023', title: 'CS50X', sub: 'Introduction to Computer Science', shadow: C.pink,
    url: 'https://certificates.cs50.io/0c311c90-1745-4eeb-977b-a966d5431687.pdf?size=letter' },
  { id: 'cs50p', issuer: 'HARVARD', title: 'CS50P', sub: 'Programming with Python', shadow: C.yellow,
    url: 'https://certificates.cs50.io/5230fd17-8fad-41e2-bb32-5b8711c051f0.pdf?size=letter' },
  { id: 'csharp', issuer: 'FREECODECAMP', title: 'C# FOUNDATIONS', sub: 'Foundational C# with Microsoft', shadow: C.lime,
    url: 'https://www.freecodecamp.org/certification/Saqlainap/foundational-c-sharp-with-microsoft' },
];

export const LINKS = [
  { id: 'portfolio', label: 'PORTFOLIO', icon: 'globe', fill: C.lime, url: 'https://saqlainap.github.io/me/' },
  { id: 'linkedin', label: 'LINKEDIN', icon: 'linkedin', url: 'https://www.linkedin.com/in/saqlain-ahmed-p-sap' },
  { id: 'x', label: 'X', icon: 'x', url: 'https://x.com/saqlainahmed302' },
  { id: 'email', label: 'EMAIL', icon: 'gmail', url: 'mailto:302saqlainahmed@gmail.com' },
  { id: 'resume', label: 'RESUME', icon: 'resume', fill: C.yellow, shadow: C.lime, url: 'https://saqlainap.github.io/me/Saqlain-resume-25.pdf' },
];

export const SOCIALS = [
  { id: 'hackerrank', label: 'HACKERRANK', icon: 'hackerrank', url: 'https://www.hackerrank.com/profile/saqlainahmed3021' },
  { id: 'discord', label: 'DISCORD', icon: 'discord', url: 'https://www.discord.com/users/806500962386051103' },
  { id: 'instagram', label: 'INSTAGRAM', icon: 'instagram', url: 'https://instagram.com/saqlain_x_ahmed' },
  { id: 'facebook', label: 'FACEBOOK', icon: 'facebook', url: 'https://www.facebook.com/saqlain.ahmed.9026040' },
  { id: 'twitch', label: 'TWITCH', icon: 'twitch', url: 'https://twitch.tv/saqlainap' },
  { id: 'linktree', label: 'LINKTREE', icon: 'linktree', url: 'https://linktr.ee/saqlainap' },
];
