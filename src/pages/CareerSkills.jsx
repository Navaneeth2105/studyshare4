import React, { useState } from 'react'; // CareerSkills v2
import { Navbar } from '../components/layout/Navbar';
import {
    Code2, Palette, TrendingUp, Video, Shield, Smartphone,
    BarChart3, Pen, Globe, ExternalLink,
    BookOpen, Clock, ChevronDown, ChevronUp, Search, X, Zap, Trophy, Rocket
} from 'lucide-react';

// ─── SKILLS DATA ───────────────────────────────────────────────────────────────

const skills = [
    {
        id: 'web-dev', title: 'Web Development', emoji: '💻', icon: Code2, category: 'Tech',
        tagline: 'Build websites & web apps', color: 'from-blue-500 to-indigo-600',
        bg: 'bg-blue-500/10', border: 'border-blue-500/20', accent: 'text-blue-400',
        duration: '6–12 months', difficulty: 'Beginner Friendly',
        roadmap: [
            { phase: 'Phase 1 — Foundations', icon: '🏗️', steps: ['HTML5 — Structure of the web', 'CSS3 — Flexbox & Grid layouts', 'JavaScript Basics — Variables, DOM, Functions'] },
            { phase: 'Phase 2 — Frontend', icon: '🎨', steps: ['Responsive Design & Media Queries', 'React.js — Components, Hooks, State', 'Git & GitHub version control'] },
            { phase: 'Phase 3 — Backend', icon: '⚙️', steps: ['Node.js & Express.js', 'Databases: PostgreSQL or MongoDB', 'REST APIs & JWT Authentication'] },
            { phase: 'Phase 4 — Deploy & Grow', icon: '🚀', steps: ['Deploy on Vercel / Netlify / Railway', 'Learn TypeScript', 'Build 3+ real portfolio projects'] },
        ],
        resources: [
            { name: 'The Odin Project', desc: 'Full-stack curriculum, 100% free', url: 'https://www.theodinproject.com', type: 'Course', icon: '🏆' },
            { name: 'freeCodeCamp', desc: 'Structured certifications with projects', url: 'https://www.freecodecamp.org', type: 'Course', icon: '🎓' },
            { name: 'MDN Web Docs', desc: 'Official HTML/CSS/JS reference', url: 'https://developer.mozilla.org', type: 'Docs', icon: '📖' },
            { name: 'JavaScript.info', desc: 'Modern JS deep dive, completely free', url: 'https://javascript.info', type: 'Docs', icon: '📖' },
            { name: 'roadmap.sh/frontend', desc: 'Visual roadmap for frontend devs', url: 'https://roadmap.sh/frontend', type: 'Roadmap', icon: '🗺️' },
            { name: 'Traversy Media', desc: 'Best crash courses for web tech', url: 'https://youtube.com/@TraversyMedia', type: 'YouTube', icon: '▶️' },
            { name: 'Fireship', desc: 'Fast-paced concepts in 100 seconds', url: 'https://youtube.com/@Fireship', type: 'YouTube', icon: '▶️' },
            { name: 'Kevin Powell', desc: 'CSS master — every CSS trick explained', url: 'https://youtube.com/@KevinPowell', type: 'YouTube', icon: '▶️' },
            { name: 'Web Dev Simplified', desc: 'React, JS & CSS simplified clearly', url: 'https://youtube.com/@WebDevSimplified', type: 'YouTube', icon: '▶️' },
        ],
    },
    {
        id: 'data-science', title: 'Data Science & ML', emoji: '📊', icon: BarChart3, category: 'Tech',
        tagline: 'Turn data into insights & build AI', color: 'from-violet-500 to-purple-600',
        bg: 'bg-violet-500/10', border: 'border-violet-500/20', accent: 'text-violet-400',
        duration: '8–14 months', difficulty: 'Intermediate',
        roadmap: [
            { phase: 'Phase 1 — Math & Python', icon: '🧮', steps: ['Python Basics — Syntax, Lists, Functions', 'NumPy & Pandas for data manipulation', 'Statistics & Probability fundamentals'] },
            { phase: 'Phase 2 — Data Analysis', icon: '🔍', steps: ['Data Cleaning & EDA', 'Matplotlib & Seaborn for visualization', 'SQL for querying databases'] },
            { phase: 'Phase 3 — Machine Learning', icon: '🤖', steps: ['Supervised Learning (Regression, Classification)', 'Unsupervised Learning (Clustering, PCA)', 'Scikit-learn library'] },
            { phase: 'Phase 4 — Deep Learning & Deploy', icon: '🧠', steps: ['Neural Networks with TensorFlow/PyTorch', 'NLP Basics & Computer Vision intro', 'Deploy models with Flask/FastAPI'] },
        ],
        resources: [
            { name: 'Kaggle Learn', desc: 'Hands-on ML/DS micro-courses', url: 'https://www.kaggle.com/learn', type: 'Course', icon: '🏆' },
            { name: 'Google ML Crash Course', desc: 'Free ML crash course by Google', url: 'https://developers.google.com/machine-learning/crash-course', type: 'Free Course', icon: '🎓' },
            { name: 'fast.ai', desc: 'Practical Deep Learning — top-down approach', url: 'https://www.fast.ai', type: 'Course', icon: '🚀' },
            { name: 'roadmap.sh/data-scientist', desc: 'Visual data science roadmap', url: 'https://roadmap.sh/data-scientist', type: 'Roadmap', icon: '🗺️' },
            { name: 'StatQuest with Josh Starmer', desc: 'Stats & ML explained visually — must watch', url: 'https://youtube.com/@statquest', type: 'YouTube', icon: '▶️' },
            { name: 'Sentdex', desc: 'Python, ML, Pandas & data tutorials', url: 'https://youtube.com/@sentdex', type: 'YouTube', icon: '▶️' },
            { name: '3Blue1Brown', desc: 'Math & neural network visuals (Essence of LA)', url: 'https://youtube.com/@3blue1brown', type: 'YouTube', icon: '▶️' },
            { name: 'Tech With Tim', desc: 'Python ML projects from scratch', url: 'https://youtube.com/@TechWithTim', type: 'YouTube', icon: '▶️' },
        ],
    },
    {
        id: 'ui-ux', title: 'UI/UX Design', emoji: '🎨', icon: Palette, category: 'Creative',
        tagline: 'Design apps & experiences people love', color: 'from-pink-500 to-rose-600',
        bg: 'bg-pink-500/10', border: 'border-pink-500/20', accent: 'text-pink-400',
        duration: '4–8 months', difficulty: 'Beginner Friendly',
        roadmap: [
            { phase: 'Phase 1 — Design Basics', icon: '🔷', steps: ['Color Theory, Typography, Spacing', 'Design Principles (Hierarchy, Contrast)', 'Learn Figma — the industry-standard tool'] },
            { phase: 'Phase 2 — UX Research', icon: '🔬', steps: ['User Research methods (interviews, surveys)', 'User Personas & User Journeys', 'Wireframing & low-fidelity prototypes'] },
            { phase: 'Phase 3 — UI Design', icon: '✨', steps: ['High-fidelity mockups in Figma', 'Design Systems & Component Libraries', 'Micro-animations & interactive prototypes'] },
            { phase: 'Phase 4 — Portfolio & Jobs', icon: '💼', steps: ['Build 3–5 case study projects', 'Showcase on Behance & Dribbble', 'Learn Framer or Webflow for no-code'] },
        ],
        resources: [
            { name: 'Google UX Design (Coursera)', desc: 'Free to audit — Google certified', url: 'https://www.coursera.org/professional-certificates/google-ux-design', type: 'Free Course', icon: '🎓' },
            { name: 'Figma Learn', desc: 'Official Figma tutorials from scratch', url: 'https://www.figma.com/resource-library/', type: 'Docs', icon: '📖' },
            { name: 'NN/g Articles', desc: 'Nielsen Norman Group — UX research', url: 'https://www.nngroup.com/articles/', type: 'Docs', icon: '📖' },
            { name: 'Refactoring UI', desc: 'Visual design tips for developers', url: 'https://www.refactoringui.com', type: 'Docs', icon: '📖' },
            { name: 'DesignCourse', desc: 'UI/UX & Figma tutorials — free', url: 'https://youtube.com/@DesignCourse', type: 'YouTube', icon: '▶️' },
            { name: 'AJ&Smart', desc: 'Design thinking, sprints, career advice', url: 'https://youtube.com/@AJSmart', type: 'YouTube', icon: '▶️' },
            { name: 'The Futur', desc: 'Design business, branding & freelancing', url: 'https://youtube.com/@thefutur', type: 'YouTube', icon: '▶️' },
            { name: 'Flux Academy', desc: 'Web design, Figma & layout principles', url: 'https://youtube.com/@FluxAcademy', type: 'YouTube', icon: '▶️' },
        ],
    },
    {
        id: 'digital-marketing', title: 'Digital Marketing', emoji: '📈', icon: TrendingUp, category: 'Business',
        tagline: 'Grow brands online & run campaigns', color: 'from-emerald-500 to-teal-600',
        bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', accent: 'text-emerald-400',
        duration: '3–6 months', difficulty: 'Beginner Friendly',
        roadmap: [
            { phase: 'Phase 1 — Core Concepts', icon: '📚', steps: ['Digital Marketing Fundamentals', 'Target Audiences & Buyer Personas', 'Content Marketing Strategy'] },
            { phase: 'Phase 2 — Channels', icon: '📡', steps: ['SEO — On-page, Off-page, Technical', 'Social Media Marketing (Instagram, LinkedIn)', 'Email Marketing & Automation'] },
            { phase: 'Phase 3 — Paid & Analytics', icon: '💰', steps: ['Google Ads & Meta Ads basics', 'Google Analytics 4 & conversion tracking', 'A/B Testing & CRO'] },
            { phase: 'Phase 4 — Strategy & Growth', icon: '🏆', steps: ['Build a personal brand or portfolio', 'Funnel building & automation', 'Certifications: Google, HubSpot, Meta'] },
        ],
        resources: [
            { name: 'Google Digital Garage', desc: 'Free Google-certified digital marketing course', url: 'https://learndigital.withgoogle.com/digitalgarage', type: 'Free Course', icon: '🎓' },
            { name: 'HubSpot Academy', desc: 'All free certifications in marketing', url: 'https://academy.hubspot.com', type: 'Free Course', icon: '🎓' },
            { name: 'Semrush Academy', desc: 'SEO & content marketing certifications', url: 'https://www.semrush.com/academy/', type: 'Free Course', icon: '🏆' },
            { name: 'Neil Patel Blog', desc: 'Best SEO & content marketing guides', url: 'https://neilpatel.com/blog/', type: 'Docs', icon: '📖' },
            { name: 'ahrefs Blog', desc: 'In-depth SEO tutorials & case studies', url: 'https://ahrefs.com/blog', type: 'Docs', icon: '📖' },
            { name: 'Neil Patel YouTube', desc: 'SEO strategy & growth tips weekly', url: 'https://youtube.com/@neilpatel', type: 'YouTube', icon: '▶️' },
            { name: 'GaryVee', desc: 'Social media & entrepreneurship mindset', url: 'https://youtube.com/@garyvee', type: 'YouTube', icon: '▶️' },
            { name: 'HubSpot Marketing', desc: 'Marketing, sales & CRM tutorials', url: 'https://youtube.com/@HubSpot', type: 'YouTube', icon: '▶️' },
        ],
    },
    {
        id: 'video-editing', title: 'Video Editing', emoji: '🎬', icon: Video, category: 'Creative',
        tagline: 'Edit videos like a pro creator', color: 'from-amber-500 to-orange-600',
        bg: 'bg-amber-500/10', border: 'border-amber-500/20', accent: 'text-amber-400',
        duration: '2–5 months', difficulty: 'Beginner Friendly',
        roadmap: [
            { phase: 'Phase 1 — Tools & Basics', icon: '🛠️', steps: ['Choose editor: DaVinci Resolve (free) or CapCut', 'Learn the interface — timeline, layers, cuts', 'Basic editing: Trim, Cut, Splice, Transitions'] },
            { phase: 'Phase 2 — Storytelling', icon: '🎭', steps: ['Pacing & Rhythm — when to cut', 'Audio — music, SFX, voiceover mixing', 'Color grading — LUTs & basic correction'] },
            { phase: 'Phase 3 — Motion Graphics', icon: '✨', steps: ['Text animations & lower thirds', 'Intro/Outro designs, logo reveals', 'Adobe After Effects basics'] },
            { phase: 'Phase 4 — Freelance & Monetize', icon: '💸', steps: ['Build a portfolio on YouTube or Vimeo', 'Find clients on Fiverr / Upwork', 'Learn YouTube SEO & thumbnail design'] },
        ],
        resources: [
            { name: 'DaVinci Resolve (Free)', desc: 'Professional-grade editor, completely free', url: 'https://www.blackmagicdesign.com/products/davinciresolve', type: 'Tool', icon: '🛠️' },
            { name: 'CapCut', desc: 'Free mobile & desktop editor for short-form', url: 'https://www.capcut.com', type: 'Tool', icon: '🛠️' },
            { name: 'Pexels Videos', desc: 'Free stock footage for practice projects', url: 'https://www.pexels.com/videos/', type: 'Tool', icon: '🛠️' },
            { name: 'Casey Faris', desc: 'Best DaVinci Resolve tutorials on YouTube', url: 'https://youtube.com/@CaseyFaris', type: 'YouTube', icon: '▶️' },
            { name: 'Justin Odisho', desc: 'Premiere Pro & editing techniques', url: 'https://youtube.com/@JustinOdisho', type: 'YouTube', icon: '▶️' },
            { name: 'Peter McKinnon', desc: 'Photography, Lightroom & video editing', url: 'https://youtube.com/@PeterMcKinnon', type: 'YouTube', icon: '▶️' },
            { name: 'Mango Street', desc: 'Short & punchy editing & photography tips', url: 'https://youtube.com/@MangoStreet', type: 'YouTube', icon: '▶️' },
        ],
    },
    {
        id: 'cybersecurity', title: 'Cybersecurity', emoji: '🔐', icon: Shield, category: 'Tech',
        tagline: 'Protect systems & hack ethically', color: 'from-red-500 to-rose-700',
        bg: 'bg-red-500/10', border: 'border-red-500/20', accent: 'text-red-400',
        duration: '8–18 months', difficulty: 'Intermediate',
        roadmap: [
            { phase: 'Phase 1 — Foundations', icon: '🧱', steps: ['Networking Basics — TCP/IP, DNS, HTTP', 'Operating Systems: Linux command line', 'How the web works — HTTP, HTTPS, APIs'] },
            { phase: 'Phase 2 — Core Security', icon: '🔒', steps: ['Cryptography: Encryption, Hashing, SSL', 'OWASP Top 10 Vulnerabilities', 'Intro to Ethical Hacking concepts'] },
            { phase: 'Phase 3 — Practical Skills', icon: '⚔️', steps: ['CTF challenges on HackTheBox / TryHackMe', 'Penetration Testing methodology', 'Tools: Nmap, Burp Suite, Metasploit'] },
            { phase: 'Phase 4 — Certifications', icon: '🏅', steps: ['CompTIA Security+ (entry level)', 'CEH or OSCP for advanced roles', 'Build a home lab for practice'] },
        ],
        resources: [
            { name: 'TryHackMe', desc: 'Gamified cybersecurity learning — free tier', url: 'https://tryhackme.com', type: 'Platform', icon: '🏆' },
            { name: 'HackTheBox Academy', desc: 'Pro-level hacking labs & courses', url: 'https://academy.hackthebox.com', type: 'Platform', icon: '🏆' },
            { name: 'CS50 Cybersecurity (Harvard)', desc: 'Harvard free cybersecurity intro course', url: 'https://cs50.harvard.edu/cybersecurity/', type: 'Free Course', icon: '🎓' },
            { name: 'OWASP Testing Guide', desc: 'Free comprehensive security testing guide', url: 'https://owasp.org/www-project-web-security-testing-guide/', type: 'Docs', icon: '📖' },
            { name: 'NetworkChuck', desc: 'Networking & ethical hacking for beginners', url: 'https://youtube.com/@NetworkChuck', type: 'YouTube', icon: '▶️' },
            { name: 'John Hammond', desc: 'CTF walkthroughs & cybersecurity content', url: 'https://youtube.com/@_JohnHammond', type: 'YouTube', icon: '▶️' },
            { name: 'David Bombal', desc: 'Networking, Python & ethical hacking', url: 'https://youtube.com/@davidbombal', type: 'YouTube', icon: '▶️' },
        ],
    },
    {
        id: 'app-dev', title: 'App Development', emoji: '📱', icon: Smartphone, category: 'Tech',
        tagline: 'Build mobile apps for iOS & Android', color: 'from-cyan-500 to-blue-600',
        bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', accent: 'text-cyan-400',
        duration: '6–12 months', difficulty: 'Intermediate',
        roadmap: [
            { phase: 'Phase 1 — Choose Your Path', icon: '🔀', steps: ['Flutter (Dart) — cross-platform iOS & Android', 'React Native — if you know JS already', 'Swift (iOS only) or Kotlin (Android only)'] },
            { phase: 'Phase 2 — Core Dev', icon: '🔧', steps: ['UI components, Navigation & Routing', 'State Management (Provider/Bloc for Flutter)', 'Consuming REST APIs & local storage'] },
            { phase: 'Phase 3 — Backend Integration', icon: '🔗', steps: ['Firebase (Auth, Firestore, Storage)', 'Push Notifications (FCM)', 'Payments: Razorpay / Stripe SDK'] },
            { phase: 'Phase 4 — Publish & Monetize', icon: '🚀', steps: ['Publish to Google Play & App Store', 'ASO (App Store Optimization)', 'Monetization: Ads, Subscriptions, IAP'] },
        ],
        resources: [
            { name: 'Flutter Docs (Official)', desc: 'Free, comprehensive Flutter documentation', url: 'https://docs.flutter.dev', type: 'Docs', icon: '📖' },
            { name: 'Android Developer Guides', desc: 'Official Android development documentation', url: 'https://developer.android.com/guide', type: 'Docs', icon: '📖' },
            { name: 'Expo (React Native)', desc: 'Build & deploy React Native apps easily', url: 'https://expo.dev', type: 'Tool', icon: '🛠️' },
            { name: 'roadmap.sh/flutter', desc: 'Flutter learning roadmap', url: 'https://roadmap.sh/flutter', type: 'Roadmap', icon: '🗺️' },
            { name: 'Net Ninja', desc: 'Flutter & React Native full free courses', url: 'https://youtube.com/@NetNinja', type: 'YouTube', icon: '▶️' },
            { name: 'Flutter Mapp', desc: 'Flutter tutorials — beginner to advanced', url: 'https://youtube.com/@FlutterMapp', type: 'YouTube', icon: '▶️' },
            { name: 'Phillip Lackner', desc: 'Android (Kotlin/Jetpack Compose) tutorials', type: 'YouTube', url: 'https://youtube.com/@PhilippLackner', icon: '▶️' },
        ],
    },
    {
        id: 'graphic-design', title: 'Graphic Design', emoji: '🖌️', icon: Pen, category: 'Creative',
        tagline: 'Create visual content & brand identities', color: 'from-fuchsia-500 to-purple-600',
        bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20', accent: 'text-fuchsia-400',
        duration: '3–6 months', difficulty: 'Beginner Friendly',
        roadmap: [
            { phase: 'Phase 1 — Design Fundamentals', icon: '🎯', steps: ['Color Theory & Color Palettes', 'Typography — Fonts, Spacing, Hierarchy', 'Layout Principles & Grids'] },
            { phase: 'Phase 2 — Tools', icon: '🛠️', steps: ['Canva (free, beginner-friendly)', 'Adobe Illustrator — vector graphics', 'Photoshop — photo editing & compositing'] },
            { phase: 'Phase 3 — Specialization', icon: '💡', steps: ['Logo Design & Brand Identity', 'Social Media Content Design', 'Print Design — Posters, Brochures'] },
            { phase: 'Phase 4 — Portfolio & Freelance', icon: '💼', steps: ['Build portfolio on Behance / Dribbble', 'Start freelancing on Fiverr', 'Learn motion graphics as next step'] },
        ],
        resources: [
            { name: 'Canva Design School', desc: 'Free graphic design tutorials in Canva', url: 'https://www.canva.com/learn/design/', type: 'Free Course', icon: '🎓' },
            { name: 'Adobe Express (Free)', desc: 'Free Adobe tool for quick designs', url: 'https://www.adobe.com/express/', type: 'Tool', icon: '🛠️' },
            { name: 'Coolors.co', desc: 'Free color palette generator', url: 'https://coolors.co', type: 'Tool', icon: '🛠️' },
            { name: 'Google Fonts', desc: 'Free fonts for any project', url: 'https://fonts.google.com', type: 'Tool', icon: '🛠️' },
            { name: 'Gareth David Studio', desc: 'Illustrator & Photoshop tutorials', url: 'https://youtube.com/@GarethDavidStudio', type: 'YouTube', icon: '▶️' },
            { name: 'The Futur', desc: 'Design business, brand identity & freelancing', url: 'https://youtube.com/@thefutur', type: 'YouTube', icon: '▶️' },
            { name: 'Spoon Graphics', desc: 'Photoshop & Illustrator effects & design', url: 'https://youtube.com/@ChrisSpiral', type: 'YouTube', icon: '▶️' },
        ],
    },
    {
        id: 'content-writing', title: 'Content Writing', emoji: '✍️', icon: Pen, category: 'Creative',
        tagline: 'Write content that ranks, converts & inspires', color: 'from-lime-500 to-green-600',
        bg: 'bg-lime-500/10', border: 'border-lime-500/20', accent: 'text-lime-400',
        duration: '2–4 months', difficulty: 'Beginner Friendly',
        roadmap: [
            { phase: 'Phase 1 — Writing Skills', icon: '✏️', steps: ['Grammar, Clarity & Tone', 'Writing styles: Blog, Copywriting, Technical', 'Structure: Headlines, Intros, CTA'] },
            { phase: 'Phase 2 — SEO Writing', icon: '🔍', steps: ['Keyword research basics (Google, Ubersuggest)', 'On-page SEO: headings, meta, links', 'Writing blog posts that rank on Google'] },
            { phase: 'Phase 3 — Niche & Copywriting', icon: '🎯', steps: ['Pick a niche (Tech, Finance, Health, etc.)', 'Copywriting frameworks: AIDA, PAS', 'Email copywriting & ad copy'] },
            { phase: 'Phase 4 — Build & Earn', icon: '💰', steps: ['Create a writing portfolio / blog', 'Get clients via LinkedIn, Upwork, Fiverr', 'Grow your own blog for passive income'] },
        ],
        resources: [
            { name: 'Hemingway App', desc: 'Free tool to improve writing clarity', url: 'https://hemingwayapp.com', type: 'Tool', icon: '🛠️' },
            { name: 'Grammarly (Free)', desc: 'Grammar & clarity checker', url: 'https://www.grammarly.com', type: 'Tool', icon: '🛠️' },
            { name: 'Copyblogger', desc: 'Best resource for content & copywriting', url: 'https://copyblogger.com/blog/', type: 'Docs', icon: '📖' },
            { name: 'Ahrefs Content Strategy Blog', desc: 'SEO writing guides & templates', url: 'https://ahrefs.com/blog/content-strategy/', type: 'Docs', icon: '📖' },
            { name: 'Ali Abdaal', desc: 'Productivity, writing, online business', url: 'https://youtube.com/@aliabdaal', type: 'YouTube', icon: '▶️' },
            { name: 'Thomas Frank', desc: 'Study tips, writing workflow & Notion', url: 'https://youtube.com/@Thomasfrank', type: 'YouTube', icon: '▶️' },
        ],
    },
];

const CATEGORIES = ['All', 'Tech', 'Creative', 'Business'];

// ─── INDIA STUDENT OPPORTUNITIES ───────────────────────────────────────────────

const indiaEvents = [
    { title: 'Smart India Hackathon (SIH)', org: 'Ministry of Education, Govt. of India', type: 'Hackathon', emoji: '🇮🇳', desc: "India's biggest national-level hackathon. Open to all college students across every state.", url: 'https://www.sih.gov.in', prize: '₹1L+', tags: ['National', 'Govt'] },
    { title: 'HackIndia', org: 'HackIndia Network', type: 'Hackathon', emoji: '⚡', desc: "India's largest hackathon series — events across 50+ cities. Open to all students.", url: 'https://hackindia.xyz', prize: '$100K pool', tags: ['Open', 'Nationwide'] },
    { title: 'Devfolio Hackathons', org: 'Devfolio Platform', type: 'Hackathon', emoji: '🛠️', desc: 'Find & register for 100+ hackathons every month across India on this platform.', url: 'https://devfolio.co/hackathons', prize: 'Varies', tags: ['Platform', 'Always Open'] },
    { title: 'Unstop Challenges', org: 'Unstop (dare2compete)', type: 'Competition', emoji: '🏆', desc: "India's #1 platform — hackathons, case studies, quizzes & project challenges for students.", url: 'https://unstop.com', prize: 'Varies', tags: ['Platform', 'Multi-domain'] },
    { title: 'HackerEarth Challenges', org: 'HackerEarth', type: 'Competition', emoji: '💻', desc: 'Monthly coding sprints, ML challenges & hackathons with cash prizes.', url: 'https://www.hackerearth.com/challenges/', prize: '₹50K+', tags: ['Coding', 'ML'] },
    { title: 'Amazon HackOn', org: 'Amazon India', type: 'Hackathon', emoji: '🟠', desc: "Amazon's annual national hackathon for engineering students across India.", url: 'https://hackon.amazon.in', prize: '₹5L+', tags: ['Corporate', 'Engineering'] },
    { title: 'Techfest — IIT Bombay', org: 'IIT Bombay', type: 'Tech Fest', emoji: '🚀', desc: "Asia's largest science & tech festival. Project expo, robotics, drone racing & competitions.", url: 'https://techfest.org', prize: '₹50L+ total', tags: ['Premier', 'Annual'] },
    { title: 'Shaastra — IIT Madras', org: 'IIT Madras', type: 'Tech Fest', emoji: '🧠', desc: 'ISO 9001 certified tech fest with workshops, project expo & national competitions.', url: 'https://shaastra.org', prize: '₹25L+', tags: ['Premier', 'Annual'] },
    { title: 'Thomso — IIT Roorkee', org: 'IIT Roorkee', type: 'Tech Fest', emoji: '⚙️', desc: 'Technical & cultural fest with project exhibition & entrepreneurship events.', url: 'https://thomso.in', prize: 'Multiple', tags: ['National', 'Annual'] },
    { title: 'Kshitij — IIT Kharagpur', org: 'IIT Kharagpur', type: 'Tech Fest', emoji: '🔬', desc: "Asia's largest student-run technology & management fest with project competitions.", url: 'https://kshitij.ac.in', prize: '₹20L+', tags: ['Premier', 'Annual'] },
    { title: 'Google Summer of Code', org: 'Google', type: 'Fellowship', emoji: '🌐', desc: 'Global open-source fellowship. Indian students are consistently top contributors worldwide.', url: 'https://summerofcode.withgoogle.com', prize: '$1500–$6600', tags: ['Global', 'Open Source'] },
    { title: 'Microsoft Imagine Cup', org: 'Microsoft India', type: 'Competition', emoji: '🪟', desc: 'Build a project using Microsoft Azure & compete globally from India with your team.', url: 'https://imaginecup.microsoft.com', prize: '$100K+', tags: ['Global', 'Corporate'] },
    { title: 'Hack2skill Events', org: 'Hack2skill', type: 'Hackathon', emoji: '🎯', desc: 'Dedicated platform listing government & corporate hackathons for Indian students.', url: 'https://hack2skill.com', prize: 'Varies', tags: ['Platform', 'Govt & Corp'] },
    { title: 'Internshala Competitions', org: 'Internshala', type: 'Opportunity', emoji: '📋', desc: 'Student competitions, campus ambassador roles & internship opportunities all year.', url: 'https://internshala.com/student-competitions', prize: 'Certificates + Cash', tags: ['All Branches', 'Campus'] },
];

const EVENT_TYPES = ['All', 'Hackathon', 'Tech Fest', 'Competition', 'Fellowship', 'Opportunity'];

const typeColors = {
    'Course': 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20',
    'Free Course': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
    'YouTube': 'bg-red-500/15 text-red-300 border-red-500/20',
    'Docs': 'bg-blue-500/15 text-blue-300 border-blue-500/20',
    'Roadmap': 'bg-amber-500/15 text-amber-300 border-amber-500/20',
    'Tool': 'bg-violet-500/15 text-violet-300 border-violet-500/20',
    'Platform': 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20',
};

const eventTypeColors = {
    'Hackathon': 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20',
    'Tech Fest': 'bg-amber-500/15 text-amber-300 border-amber-500/20',
    'Competition': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
    'Fellowship': 'bg-violet-500/15 text-violet-300 border-violet-500/20',
    'Opportunity': 'bg-pink-500/15 text-pink-300 border-pink-500/20',
};

// ─── COMPONENT ─────────────────────────────────────────────────────────────────

export function CareerSkills() {
    const [selected, setSelected] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [search, setSearch] = useState('');
    const [expandedPhase, setExpandedPhase] = useState(null);
    const [eventFilter, setEventFilter] = useState('All');

    const filtered = skills.filter(s => {
        const matchCat = activeCategory === 'All' || s.category === activeCategory;
        const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
            s.tagline.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const filteredEvents = indiaEvents.filter(e =>
        eventFilter === 'All' || e.type === eventFilter
    );

    const handleSelect = (skill) => {
        setSelected(skill);
        setExpandedPhase(null);
        setTimeout(() => document.getElementById('skill-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    };

    return (
        <div className="min-h-screen bg-[#050b18] text-white overflow-x-hidden" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[100px]" />
            </div>

            <Navbar />

            <main className="relative z-10 pt-28 pb-24 px-4">

                {/* ── HERO ── */}
                <section className="max-w-5xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-6">
                        <Zap size={13} className="text-amber-400" />
                        <span className="text-xs font-black uppercase tracking-widest text-amber-300">Career & Creative Skills Hub</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black leading-tight mb-5">
                        <span className="text-white">Your </span>
                        <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">Skill Roadmap</span>
                        <br />
                        <span className="text-white/80 text-3xl md:text-4xl font-bold">Starts Here. All Free.</span>
                    </h1>
                    <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
                        Pick a career path, follow the step-by-step roadmap, and get handpicked <strong className="text-white">free YouTube channels, courses & tools</strong> — all in one place.
                    </p>
                    <div className="max-w-md mx-auto relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search a skill or career..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-11 pr-11 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium" />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </section>

                {/* ── CATEGORY FILTER ── */}
                <section className="max-w-5xl mx-auto mb-10">
                    <div className="flex gap-3 flex-wrap justify-center">
                        {CATEGORIES.map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-300 ${activeCategory === cat
                                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                    : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20'}`}>
                                {cat === 'All' ? '🌐' : cat === 'Tech' ? '💻' : cat === 'Creative' ? '🎨' : '📈'} {cat}
                            </button>
                        ))}
                    </div>
                </section>

                {/* ── SKILL CARDS GRID ── */}
                <section className="max-w-6xl mx-auto mb-16">
                    {filtered.length === 0 ? (
                        <div className="text-center py-24 text-slate-500">
                            <div className="text-5xl mb-4">🔍</div>
                            <p className="font-bold">No skills found for "{search}"</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filtered.map(skill => {
                                const isActive = selected?.id === skill.id;
                                return (
                                    <button key={skill.id} onClick={() => isActive ? setSelected(null) : handleSelect(skill)}
                                        className={`text-left group p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isActive
                                            ? `${skill.bg} ${skill.border} shadow-xl`
                                            : 'bg-white/3 border-white/8 hover:bg-white/6 hover:border-white/15'}`}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-14 h-14 bg-gradient-to-br ${skill.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                {skill.emoji}
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${skill.bg} ${skill.border} ${skill.accent}`}>{skill.category}</span>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{skill.difficulty}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-black text-white mb-1">{skill.title}</h3>
                                        <p className="text-sm text-slate-400 font-medium mb-4">{skill.tagline}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                                                <Clock size={12} />{skill.duration}
                                            </div>
                                            <div className={`text-xs font-black ${skill.accent} group-hover:translate-x-1 transition-transform`}>
                                                {isActive ? 'Close ↑' : 'View Roadmap →'}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* ── SKILL DETAIL PANEL ── */}
                {selected && (
                    <section id="skill-detail" className="max-w-6xl mx-auto mb-20">
                        <div className={`rounded-[2.5rem] border ${selected.border} overflow-hidden`}
                            style={{ background: 'linear-gradient(135deg, rgba(15,22,41,0.97) 0%, rgba(10,14,28,0.99) 100%)' }}>

                            <div className={`bg-gradient-to-r ${selected.color} p-8 md:p-12 relative overflow-hidden`}>
                                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                    <div>
                                        <div className="text-6xl mb-3">{selected.emoji}</div>
                                        <h2 className="text-4xl font-black text-white mb-2">{selected.title}</h2>
                                        <p className="text-white/80 font-medium">{selected.tagline}</p>
                                        <div className="flex gap-3 mt-4 flex-wrap">
                                            <span className="bg-white/20 text-white text-xs font-black px-3 py-1.5 rounded-full backdrop-blur-sm">⏱ {selected.duration}</span>
                                            <span className="bg-white/20 text-white text-xs font-black px-3 py-1.5 rounded-full backdrop-blur-sm">📚 {selected.difficulty}</span>
                                            <span className="bg-white/20 text-white text-xs font-black px-3 py-1.5 rounded-full backdrop-blur-sm">🔗 {selected.resources.length} Free Resources</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelected(null)} className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-2xl transition-all backdrop-blur-sm hover:scale-110">
                                        <X size={22} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                                {/* ROADMAP */}
                                <div className="p-8 md:p-10">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className={`w-10 h-10 bg-gradient-to-br ${selected.color} rounded-xl flex items-center justify-center`}>
                                            <Globe size={18} className="text-white" />
                                        </div>
                                        <h3 className="text-2xl font-black text-white">Learning Roadmap</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {selected.roadmap.map((phase, i) => {
                                            const isOpen = expandedPhase === i;
                                            return (
                                                <div key={i} className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? `${selected.bg} ${selected.border}` : 'bg-white/3 border-white/8 hover:border-white/15'}`}>
                                                    <button onClick={() => setExpandedPhase(isOpen ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-2xl">{phase.icon}</span>
                                                            <div>
                                                                <div className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${isOpen ? selected.accent : 'text-slate-500'}`}>Step {i + 1}</div>
                                                                <span className="font-black text-white text-base">{phase.phase}</span>
                                                            </div>
                                                        </div>
                                                        {isOpen ? <ChevronUp size={18} className="text-slate-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
                                                    </button>
                                                    {isOpen && (
                                                        <div className="px-5 pb-5">
                                                            <ul className="space-y-3 ml-2">
                                                                {phase.steps.map((step, j) => (
                                                                    <li key={j} className="flex items-start gap-3">
                                                                        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${selected.color} flex items-center justify-center shrink-0 mt-0.5`}>
                                                                            <span className="text-[9px] font-black text-white">{j + 1}</span>
                                                                        </div>
                                                                        <span className="text-sm font-semibold text-slate-300 leading-relaxed">{step}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* RESOURCES */}
                                <div className="p-8 md:p-10">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className={`w-10 h-10 bg-gradient-to-br ${selected.color} rounded-xl flex items-center justify-center`}>
                                            <BookOpen size={18} className="text-white" />
                                        </div>
                                        <h3 className="text-2xl font-black text-white">Free Resources</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {selected.resources.map((res, i) => (
                                            <a key={i} href={res.url} target="_blank" rel="noopener noreferrer"
                                                className="group flex items-center gap-4 p-4 bg-white/3 border border-white/8 rounded-2xl hover:bg-white/7 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5">
                                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selected.color} flex items-center justify-center text-xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                                                    {res.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-black text-white text-sm truncate">{res.name}</span>
                                                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${typeColors[res.type] || 'bg-slate-500/15 text-slate-300 border-slate-500/20'}`}>{res.type}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 font-medium truncate">{res.desc}</p>
                                                </div>
                                                <ExternalLink size={16} className="text-slate-600 group-hover:text-white shrink-0 transition-colors" />
                                            </a>
                                        ))}
                                    </div>
                                    <div className={`mt-6 p-5 rounded-2xl ${selected.bg} border ${selected.border}`}>
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl">💡</span>
                                            <div>
                                                <p className={`text-xs font-black uppercase tracking-widest mb-1 ${selected.accent}`}>Pro Tip</p>
                                                <p className="text-sm text-slate-300 font-medium leading-relaxed">
                                                    Start with one free resource, build a project, then move to the next phase. <strong className="text-white">Consistency beats intensity</strong> — 30 mins daily beats a 6-hour weekly binge.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* ── INDIA STUDENT OPPORTUNITIES ── */}
                <section className="max-w-6xl mx-auto mt-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1.5 mb-3">
                                <span className="text-xs font-black uppercase tracking-widest text-orange-400">🇮🇳 India Updates</span>
                            </div>
                            <h2 className="text-3xl font-black text-white">Hackathons, Expos & Events</h2>
                            <p className="text-slate-500 text-sm font-medium mt-1">All the big opportunities for Indian students — updated regularly</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {EVENT_TYPES.map(type => (
                                <button key={type} onClick={() => setEventFilter(type)}
                                    className={`px-3 py-1.5 rounded-lg font-black text-xs uppercase tracking-wider transition-all duration-200 ${eventFilter === type
                                        ? 'bg-orange-500 text-white shadow shadow-orange-500/30'
                                        : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'}`}>
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredEvents.map((ev, i) => (
                            <a key={i} href={ev.url} target="_blank" rel="noopener noreferrer"
                                className="group flex flex-col p-6 bg-white/3 border border-white/8 rounded-3xl hover:bg-white/6 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center text-2xl">
                                        {ev.emoji}
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full border ${eventTypeColors[ev.type] || 'bg-slate-500/15 text-slate-300 border-slate-500/20'}`}>
                                        {ev.type}
                                    </span>
                                </div>

                                <h3 className="font-black text-white text-base mb-1 group-hover:text-orange-300 transition-colors">{ev.title}</h3>
                                <p className="text-xs text-slate-500 font-bold mb-2">{ev.org}</p>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed flex-1 mb-4">{ev.desc}</p>

                                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/6">
                                    <div className="flex items-center gap-1.5">
                                        <Trophy size={12} className="text-amber-400" />
                                        <span className="text-xs font-black text-amber-400">{ev.prize}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-black text-slate-600 group-hover:text-orange-400 transition-colors">
                                        <ExternalLink size={12} />
                                        <span>Register</span>
                                    </div>
                                </div>

                                <div className="flex gap-1.5 flex-wrap mt-3">
                                    {ev.tags.map((tag, j) => (
                                        <span key={j} className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-slate-500">{tag}</span>
                                    ))}
                                </div>
                            </a>
                        ))}
                    </div>

                    <div className="mt-10 p-6 bg-gradient-to-r from-orange-500/10 to-amber-500/5 border border-orange-500/20 rounded-3xl flex flex-col sm:flex-row items-center gap-5">
                        <Rocket size={36} className="text-orange-400 shrink-0" />
                        <div>
                            <p className="font-black text-white text-lg mb-1">Stay updated on more events</p>
                            <p className="text-slate-400 text-sm font-medium">Follow <strong className="text-white">Unstop, Devfolio & Hack2skill</strong> for daily listings of new hackathons, project expos, and competitions across India.</p>
                        </div>
                        <a href="https://unstop.com" target="_blank" rel="noopener noreferrer"
                            className="shrink-0 bg-orange-500 hover:bg-orange-400 text-white font-black text-sm px-5 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 whitespace-nowrap">
                            Browse Unstop →
                        </a>
                    </div>
                </section>

            </main>
        </div>
    );
}
