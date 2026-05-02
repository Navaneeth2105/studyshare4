import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Heart } from 'lucide-react';

const FooterLinks = () => (
    <div className="flex items-center gap-6 mt-8 pt-8 border-t border-white/5 justify-center">
        <Link to="/privacy" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary-400 transition-colors">Privacy</Link>
        <Link to="/terms" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary-400 transition-colors">Terms</Link>
        <Link to="/support" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary-400 transition-colors">Support</Link>
    </div>
);

/* ═══════════════════════════════════════════
   PRIVACY PAGE
═══════════════════════════════════════════ */
export function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-body">
            <Navbar />
            <main className="pt-28 pb-20 max-w-3xl mx-auto px-4">
                <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-8 md:p-14">
                    <div className="text-center mb-10">
                        <div className="text-6xl mb-4">🕵️</div>
                        <h1 className="text-4xl font-display font-black mb-2">Privacy Policy</h1>
                        <p className="text-slate-400 font-bold">aka "what we do with your brain data"</p>
                        <p className="text-slate-600 text-xs mt-2">Last updated: May 2, 2026 | Effective immediately bro</p>
                    </div>

                    <div className="space-y-8 text-slate-300">
                        <Section emoji="🤓" title="TL;DR (The Real One)">
                            <p>We collect the bare minimum. We don't sell your data. We're not sketchy. We're students too. Pinky promise. 🤙</p>
                        </Section>

                        <Section emoji="📋" title="1. What We Collect">
                            <ul className="list-disc list-inside space-y-2 text-slate-400">
                                <li><strong className="text-white">Account info:</strong> Your email & display name when you sign up (via Supabase Auth)</li>
                                <li><strong className="text-white">Study materials:</strong> Files you upload, their titles, subjects, university info</li>
                                <li><strong className="text-white">Chat messages:</strong> Group chats & DMs stored in our database</li>
                                <li><strong className="text-white">Activity data:</strong> Downloads, karma points, friend connections</li>
                                <li><strong className="text-white">Device info:</strong> Browser type, basic analytics (no creepy tracking)</li>
                            </ul>
                            <p className="mt-3 text-xs text-slate-500 italic">We don't collect your CGPA. We already know it's a 7.2. We've all been there. 💀</p>
                        </Section>

                        <Section emoji="🎯" title="2. Why We Use It">
                            <ul className="list-disc list-inside space-y-2 text-slate-400">
                                <li>To run the platform (show you notes, connect friends, etc.)</li>
                                <li>To calculate karma & leaderboards (the fun stuff)</li>
                                <li>To prevent spam & abuse (no, you can't upload 1000 blank PDFs)</li>
                                <li>To improve StudyShare (we read crash logs, not your DMs)</li>
                            </ul>
                        </Section>

                        <Section emoji="🔒" title="3. Data Storage & Security">
                            <p>All data is stored on <strong className="text-white">Supabase</strong> (think Firebase but cooler), secured with Row Level Security (RLS). Your files are in Supabase Storage. We use HTTPS everywhere. Your DMs are private — only you and your friend can see them.</p>
                            <p className="mt-2 text-slate-400">We are not responsible if you screenshot your own DMs and send them to your ex. That's on you.</p>
                        </Section>

                        <Section emoji="🤝" title="4. Third-Party Services">
                            <ul className="list-disc list-inside space-y-2 text-slate-400">
                                <li><strong className="text-white">Supabase:</strong> Database, auth, file storage</li>
                                <li><strong className="text-white">Google Gemini API:</strong> AI Sensei features</li>
                                <li><strong className="text-white">Vercel:</strong> Hosting</li>
                            </ul>
                            <p className="mt-2 text-sm text-slate-500">These are Indian & global compliant services. We don't use sus data brokers. No Cambridge Analytica vibes here.</p>
                        </Section>

                        <Section emoji="❌" title="5. What We DON'T Do">
                            <ul className="list-disc list-inside space-y-2 text-slate-400">
                                <li>Sell your data to advertisers</li>
                                <li>Read your private messages</li>
                                <li>Share your info with third parties for profit</li>
                                <li>Store your passwords (Supabase handles auth securely)</li>
                            </ul>
                        </Section>

                        <Section emoji="🗑️" title="6. Your Rights">
                            <p>Under the <strong className="text-white">Digital Personal Data Protection Act, 2023 (India)</strong>, you have the right to:</p>
                            <ul className="list-disc list-inside space-y-2 text-slate-400 mt-2">
                                <li>Access your data</li>
                                <li>Correct wrong data</li>
                                <li>Delete your account & data ("Right to Erasure")</li>
                                <li>Withdraw consent</li>
                            </ul>
                            <p className="mt-3 text-sm">To exercise these rights, contact us on WhatsApp: <a href="https://wa.me/916309691674" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline font-bold">+91 6309691674</a></p>
                        </Section>

                        <Section emoji="🍪" title="7. Cookies">
                            <p>We use session cookies to keep you logged in. No third-party tracking cookies. No cookie banners needed because we're not Google.</p>
                        </Section>

                        <Section emoji="📞" title="8. Contact">
                            <p>Questions? Slide into our DMs:</p>
                            <div className="flex flex-wrap gap-3 mt-2">
                                <a href="https://wa.me/916309691674" target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm font-bold hover:bg-emerald-500/25 transition-all">
                                    💬 WhatsApp
                                </a>
                                <a href="https://www.instagram.com/k.navaneeth4/" target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-pink-500/15 border border-pink-500/20 rounded-2xl text-pink-400 text-sm font-bold hover:bg-pink-500/25 transition-all">
                                    📸 Instagram
                                </a>
                            </div>
                        </Section>
                    </div>
                    <FooterLinks />
                </div>
            </main>
        </div>
    );
}

/* ═══════════════════════════════════════════
   TERMS PAGE
═══════════════════════════════════════════ */
export function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-body">
            <Navbar />
            <main className="pt-28 pb-20 max-w-3xl mx-auto px-4">
                <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-8 md:p-14">
                    <div className="text-center mb-10">
                        <div className="text-6xl mb-4">📜</div>
                        <h1 className="text-4xl font-display font-black mb-2">Terms of Service</h1>
                        <p className="text-slate-400 font-bold">aka "the rules of the academic dojo"</p>
                        <p className="text-slate-600 text-xs mt-2">Last updated: May 2, 2026 | Governed by Indian Law</p>
                    </div>

                    <div className="space-y-8 text-slate-300">
                        <Section emoji="👋" title="Welcome to StudyShare">
                            <p>By using StudyShare, you agree to these terms. If you don't agree, that's valid — but you gotta leave. We're operating under Indian law, specifically the <strong className="text-white">Information Technology Act, 2000</strong> and the <strong className="text-white">Digital Personal Data Protection Act, 2023</strong>.</p>
                        </Section>

                        <Section emoji="✅" title="1. Eligibility">
                            <ul className="list-disc list-inside space-y-2 text-slate-400">
                                <li>You must be at least <strong className="text-white">13 years old</strong> to use StudyShare</li>
                                <li>You must be a student, educator, or academic enthusiast</li>
                                <li>You must have a working brain (the biological kind — AI is allowed)</li>
                            </ul>
                        </Section>

                        <Section emoji="📤" title="2. Content You Upload">
                            <p>When you upload notes or files, you confirm that:</p>
                            <ul className="list-disc list-inside space-y-2 text-slate-400 mt-2">
                                <li>You own it OR have permission to share it</li>
                                <li>It's not copied directly from a textbook/publisher without permission (Copyright Act, 1957)</li>
                                <li>It's not spam, adult content, malware, or hate speech</li>
                                <li>Your handwritten notes with 5 colours and 3 highlighters are valid and encouraged</li>
                            </ul>
                            <p className="mt-3 text-sm text-slate-500">Uploading someone else's work without credit = not cool. We can remove it.</p>
                        </Section>

                        <Section emoji="🚫" title="3. Prohibited Activities">
                            <p>Don't be that person. You may NOT:</p>
                            <ul className="list-disc list-inside space-y-2 text-slate-400 mt-2">
                                <li>Upload exam papers illegally obtained from professors</li>
                                <li>Use StudyShare to cheat in active exams (come on bro)</li>
                                <li>Harass other students in the Chill Zone or DMs</li>
                                <li>Create fake accounts or impersonate others</li>
                                <li>Try to hack or reverse-engineer the platform</li>
                                <li>Upload copyrighted books/paid courses (we're not LibGen)</li>
                            </ul>
                            <p className="mt-3 text-amber-400 text-sm font-bold">⚠️ Violation = ban. No appeals from the shadow realm.</p>
                        </Section>

                        <Section emoji="⚖️" title="4. Intellectual Property">
                            <p>All content you upload remains yours. You grant StudyShare a <strong className="text-white">non-exclusive, royalty-free license</strong> to display and share it on the platform for educational purposes. We won't sell your notes to coaching institutes. We're not that low.</p>
                        </Section>

                        <Section emoji="🤖" title="5. AI Features">
                            <p>Our AI Sensei uses <strong className="text-white">Google Gemini</strong>. AI-generated content may sometimes be wrong (we call it "confidently incorrect"). Don't use AI summaries as your only exam prep. Actually study a little. 😅</p>
                        </Section>

                        <Section emoji="💸" title="6. Free Service">
                            <p>StudyShare is currently <strong className="text-white">free</strong>. We may introduce premium features in the future. We'll warn you before we charge you. No surprise charges at 3am.</p>
                        </Section>

                        <Section emoji="🔧" title="7. Termination">
                            <p>We can suspend/delete accounts that violate these terms. You can also delete your account anytime (no guilt trips). Upon deletion, your public notes may remain if other students depend on them — but your personal data will be removed.</p>
                        </Section>

                        <Section emoji="⚖️" title="8. Governing Law">
                            <p>These terms are governed by the laws of <strong className="text-white">India</strong>. Any disputes will be subject to the exclusive jurisdiction of courts in <strong className="text-white">Andhra Pradesh, India</strong>.</p>
                        </Section>

                        <Section emoji="📞" title="9. Contact">
                            <p>Questions about these terms? Hit us up:</p>
                            <div className="flex flex-wrap gap-3 mt-2">
                                <a href="https://wa.me/916309691674" target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm font-bold hover:bg-emerald-500/25 transition-all">
                                    💬 WhatsApp: +91 6309691674
                                </a>
                            </div>
                        </Section>
                    </div>
                    <FooterLinks />
                </div>
            </main>
        </div>
    );
}

/* ═══════════════════════════════════════════
   SUPPORT PAGE
═══════════════════════════════════════════ */
export function SupportPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-body">
            <Navbar />
            <main className="pt-28 pb-20 max-w-3xl mx-auto px-4">
                <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-8 md:p-14">
                    <div className="text-center mb-10">
                        <div className="text-6xl mb-4">🆘</div>
                        <h1 className="text-4xl font-display font-black mb-2">Support</h1>
                        <p className="text-slate-400 font-bold">aka "we actually care, fr fr"</p>
                    </div>

                    <div className="space-y-8 text-slate-300">
                        <Section emoji="⚡" title="Fastest Way to Get Help">
                            <p>Ping us directly on WhatsApp — no tickets, no wait, no bot responses. Just vibes and solutions.</p>
                            <a href="https://wa.me/916309691674" target="_blank" rel="noopener noreferrer"
                                className="mt-4 flex items-center justify-center gap-3 px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-emerald-900/30 active:scale-95">
                                <span className="text-2xl">💬</span> WhatsApp: +91 6309691674
                            </a>
                        </Section>

                        <Section emoji="❓" title="Common Issues (FAQ)">
                            <div className="space-y-4">
                                <Faq q="I can't log in" a="Try resetting your password. If you signed up with Google, use that same method. Still stuck? WhatsApp us." />
                                <Faq q="My file upload is failing" a='Make sure your file is under 50MB and is PDF, DOCX, PPT, or image format. If the bucket gives a 403, run the Supabase storage policy from our SQL setup guide.' />
                                <Faq q="The Chill Zone shows no messages" a="Go to Supabase → Database → Replication and enable Realtime for the `messages` and `direct_messages` tables." />
                                <Faq q="My friend request isn't showing" a="Enable Realtime on the `friendships` table in Supabase. Also check that the `notifications` table exists." />
                                <Faq q="AI Sensei isn't working" a="The Gemini API key may have expired or hit quota. Check your `.env` file for `VITE_GEMINI_API_KEY`." />
                                <Faq q="I want to delete my account" a="WhatsApp us with your registered email. We'll delete everything in 48 hours, in compliance with DPDPA 2023." />
                            </div>
                        </Section>

                        <Section emoji="🐛" title="Found a Bug?">
                            <p>You found a bug? Congrats, you're a QA legend. Please report:</p>
                            <ul className="list-disc list-inside space-y-1 text-slate-400 mt-2">
                                <li>What you were doing when it happened</li>
                                <li>What browser / device you're on</li>
                                <li>Screenshot if possible (we love receipts)</li>
                            </ul>
                            <a href="https://wa.me/916309691674" target="_blank" rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-500/15 border border-primary-500/20 rounded-2xl text-primary-400 text-sm font-bold hover:bg-primary-500/25 transition-all">
                                🐛 Report a Bug
                            </a>
                        </Section>

                        <Section emoji="📬" title="Other Contact Channels">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <a href="https://wa.me/916309691674" target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/15 rounded-2xl hover:bg-emerald-500/20 transition-all">
                                    <span className="text-2xl">💬</span>
                                    <div>
                                        <p className="text-sm font-black text-white">WhatsApp</p>
                                        <p className="text-xs text-emerald-400">+91 6309691674</p>
                                    </div>
                                </a>
                                <a href="https://www.instagram.com/k.navaneeth4/" target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-4 bg-pink-500/10 border border-pink-500/15 rounded-2xl hover:bg-pink-500/20 transition-all">
                                    <span className="text-2xl">📸</span>
                                    <div>
                                        <p className="text-sm font-black text-white">Instagram DM</p>
                                        <p className="text-xs text-pink-400">@k.navaneeth4</p>
                                    </div>
                                </a>
                            </div>
                        </Section>

                        <div className="text-center p-6 bg-white/3 border border-white/5 rounded-2xl">
                            <p className="text-slate-400 font-bold text-sm">Response time: Usually within <span className="text-white">2-4 hours</span> during the day 🕑</p>
                            <p className="text-slate-600 text-xs mt-1">If we're asleep, we promise to reply before your next class 🫡</p>
                        </div>
                    </div>
                    <FooterLinks />
                </div>
            </main>
        </div>
    );
}

/* ── Reusable Section component ── */
function Section({ emoji, title, children }) {
    return (
        <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-display font-black text-white mb-4 flex items-center gap-2">
                <span>{emoji}</span> {title}
            </h2>
            <div className="text-sm leading-relaxed space-y-2">{children}</div>
        </div>
    );
}

/* ── FAQ item ── */
function Faq({ q, a }) {
    const [open, setOpen] = React.useState(false);
    return (
        <div className="border border-white/5 rounded-xl overflow-hidden">
            <button onClick={() => setOpen(p => !p)} className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/3 transition-all">
                <span className="text-sm font-black text-white">{q}</span>
                <span className="text-slate-500 text-lg shrink-0 ml-2">{open ? '−' : '+'}</span>
            </button>
            {open && <p className="px-4 pb-4 text-xs text-slate-400 leading-relaxed">{a}</p>}
        </div>
    );
}
