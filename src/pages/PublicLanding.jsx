import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    BookOpen, Brain, Users, Upload, Star, Zap, Shield,
    Check, ArrowRight, Sparkles, ChevronDown, GraduationCap,
    FileText, MessageSquare, Trophy, TrendingUp, Globe
} from 'lucide-react';

const features = [
    {
        icon: Brain,
        title: 'AI Sensei',
        desc: 'Chat with an AI that actually reads your study material. Ask anything, get smart answers instantly.',
        color: 'from-violet-500 to-purple-600',
        glow: 'shadow-violet-500/20',
    },
    {
        icon: Upload,
        title: 'Upload & Earn Clout',
        desc: 'Share your notes, question papers & study materials. Build your academic reputation.',
        color: 'from-blue-500 to-indigo-600',
        glow: 'shadow-blue-500/20',
    },
    {
        icon: Globe,
        title: 'Explore Everything',
        desc: 'Browse thousands of resources across every subject, university and semester.',
        color: 'from-emerald-500 to-teal-600',
        glow: 'shadow-emerald-500/20',
    },
    {
        icon: MessageSquare,
        title: 'Chill Zone',
        desc: 'Connect, discuss and vibe with students from your college and beyond.',
        color: 'from-amber-500 to-orange-600',
        glow: 'shadow-amber-500/20',
    },
];

const testimonials = [
    { name: 'Arjun S.', college: 'NIT Trichy', avatar: 'Arjun', text: '"Got a 9.1 CGPA last sem. StudyShare\'s notes are absolutely elite. Worth every rupee."', stars: 5 },
    { name: 'Priya M.', college: 'VIT Vellore', avatar: 'Priya', text: '"AI Sensei explained thermodynamics better than my prof. No joke, I passed because of this app."', stars: 5 },
    { name: 'Rahul K.', college: 'SRM Chennai', avatar: 'Rahul', text: '"39 rupees is literally less than a chai. And I get unlimited study material + AI? Steal."', stars: 5 },
];

const stats = [
    { value: '10,000+', label: 'Study Materials', icon: FileText },
    { value: '5,000+', label: 'Active Students', icon: Users },
    { value: '98%', label: 'Pass Rate', icon: Trophy },
    { value: '4.9★', label: 'Avg Rating', icon: Star },
];

function AnimatedCounter({ target, suffix = '' }) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const num = parseInt(target.replace(/[^0-9]/g, ''));
        const duration = 2000;
        const steps = 60;
        const increment = num / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= num) {
                setCount(num);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);
        return () => clearInterval(timer);
    }, [target]);
    return <span>{count.toLocaleString()}{suffix}</span>;
}

export function PublicLanding() {
    const [scrolled, setScrolled] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        const testimonialTimer = setInterval(() => {
            setActiveTestimonial(prev => (prev + 1) % testimonials.length);
        }, 4000);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(testimonialTimer);
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#050b18] text-white overflow-x-hidden font-sans" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>

            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
                <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[100px]" />
            </div>

            {/* ===== NAVBAR ===== */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#050b18]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/20' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/src/assets/logo.svg" alt="StudyShare" className="w-9 h-9" />
                        <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                            StudyShare
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Features</a>
                        <a href="#pricing" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Pricing</a>
                        <a href="#testimonials" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Reviews</a>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/auth"
                            className="text-sm font-bold text-slate-300 hover:text-white transition-colors px-4 py-2"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/auth"
                            state={{ isSignUp: true }}
                            className="text-sm font-black bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105"
                        >
                            Start 15-Day Free Trial
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ===== HERO ===== */}
            <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest text-indigo-300">India's #1 Student Study Platform</span>
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight mb-6 max-w-5xl">
                    <span className="text-white">Study Smarter.</span>
                    <br />
                    <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                        Score Higher.
                    </span>
                    <br />
                    <span className="text-white/50 text-4xl md:text-5xl">For just ₹39/month.</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 font-medium mb-10 max-w-2xl leading-relaxed">
                    Access thousands of notes, question papers & AI-powered tutoring — all curated by students, for students. Your grades will thank you.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-center mb-16">
                    <Link
                        to="/auth"
                        state={{ isSignUp: true }}
                        id="hero-cta-primary"
                        className="group flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black text-lg px-8 py-4 rounded-2xl transition-all duration-300 shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 hover:-translate-y-0.5"
                    >
                        Start 15-Day Free Trial
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <a
                        href="#features"
                        className="flex items-center gap-2 text-slate-400 hover:text-white font-bold text-base px-6 py-4 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300"
                    >
                        See How It Works <ChevronDown size={16} />
                    </a>
                </div>

                {/* Hero Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl w-full">
                    {stats.map(({ value, label, icon: Icon }) => (
                        <div key={label} className="bg-white/3 border border-white/8 rounded-2xl p-4 backdrop-blur-sm hover:bg-white/5 transition-all duration-300">
                            <Icon size={20} className="text-indigo-400 mb-2 mx-auto" />
                            <div className="text-2xl font-black text-white">{value}</div>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
                        </div>
                    ))}
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 animate-bounce">
                    <ChevronDown size={20} />
                </div>
            </section>

            {/* ===== FEATURES ===== */}
            <section id="features" className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-2 mb-4">
                            <Sparkles size={14} className="text-violet-400" />
                            <span className="text-xs font-black uppercase tracking-widest text-violet-300">Everything You Need</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Built for the <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Modern Student</span></h2>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium">Stop juggling 10 different apps. Everything your academic life needs, in one place.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {features.map(({ icon: Icon, title, desc, color, glow }) => (
                            <div
                                key={title}
                                className={`group bg-white/3 border border-white/8 rounded-3xl p-7 hover:bg-white/6 hover:border-white/15 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${glow} cursor-default`}
                            >
                                <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon size={26} className="text-white" />
                                </div>
                                <h3 className="text-lg font-black text-white mb-2">{title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed font-medium">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">How It <span className="bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">Works</span></h2>
                        <p className="text-slate-400 text-lg font-medium">Get from zero to study-mode in under 2 minutes</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connecting line - desktop only */}
                        <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px bg-gradient-to-r from-indigo-500/50 via-violet-500/50 to-teal-500/50" />

                        {[
                            { step: '01', title: 'Create Account', desc: 'Sign up with your college email. Takes 30 seconds, no credit card needed to try.', icon: GraduationCap, color: 'from-indigo-500 to-blue-500' },
                            { step: '02', title: 'Subscribe for ₹39', desc: 'That\'s less than a cup of coffee. Unlock unlimited AI + all study materials instantly.', icon: Zap, color: 'from-violet-500 to-purple-500' },
                            { step: '03', title: 'Start Scoring', desc: 'Explore notes, chat with AI Sensei, upload your own. Watch your grades skyrocket.', icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
                        ].map(({ step, title, desc, icon: Icon, color }) => (
                            <div key={step} className="relative text-center">
                                <div className={`w-20 h-20 bg-gradient-to-br ${color} rounded-3xl flex flex-col items-center justify-center mx-auto mb-5 shadow-2xl`}>
                                    <Icon size={28} className="text-white" />
                                </div>
                                <div className="text-5xl font-black text-white/5 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 select-none">{step}</div>
                                <h3 className="text-xl font-black text-white mb-2">{title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed font-medium">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== PRICING ===== */}
            <section id="pricing" className="py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-6">
                        <span className="text-xs font-black uppercase tracking-widest text-amber-300">💸 Ridiculously Affordable</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                        One Plan. <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Everything Unlocked.</span>
                    </h2>
                    <p className="text-slate-400 text-lg font-medium mb-16 max-w-xl mx-auto">No tiers. No hidden fees. No BS. Just pure student value.</p>

                    {/* Pricing Card */}
                    <div className="relative max-w-md mx-auto">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-violet-500/30 rounded-[2.5rem] blur-2xl scale-105 -z-10" />

                        <div className="relative bg-gradient-to-br from-[#0f1629] to-[#0a0e1c] border border-white/15 rounded-[2.5rem] p-10 overflow-hidden">
                            {/* Top Badge */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <div className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg">
                                    Most Popular ✨
                                </div>
                            </div>

                            {/* Decorative corner accent */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-full blur-2xl" />

                            <div className="relative">
                                <div className="mb-2">
                                    <span className="text-2xl font-bold text-slate-400">Just</span>
                                </div>

                                {/* Price */}
                                <div className="flex items-start justify-center gap-1 mb-1">
                                    <span className="text-3xl font-black text-white mt-3">₹</span>
                                    <span className="text-8xl font-black leading-none bg-gradient-to-r from-indigo-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">39</span>
                                </div>
                                <p className="text-slate-400 font-bold mb-1">per month</p>
                                <p className="text-xs text-slate-600 font-medium mb-8">= ₹1.3 per day. Less than a chai ☕</p>

                                {/* Features */}
                                <ul className="space-y-4 mb-10 text-left">
                                    {[
                                        'Unlimited study material downloads',
                                        'AI Sensei — unlimited chat sessions',
                                        'Upload & share your own materials',
                                        'Access Chill Zone community',
                                        'New materials added daily',
                                        'Works on any device, anywhere',
                                    ].map(feature => (
                                        <li key={feature} className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                                                <Check size={12} className="text-white font-black" strokeWidth={3} />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    to="/auth"
                                    state={{ isSignUp: true }}
                                    id="pricing-cta"
                                    className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 hover:from-indigo-400 hover:via-violet-400 hover:to-pink-400 text-white font-black text-lg py-5 rounded-2xl transition-all duration-300 shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] hover:-translate-y-0.5"
                                >
                                    Start for ₹39/month
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <p className="text-center text-xs text-slate-600 font-medium mt-4">
                                    🔒 Secure payment · Cancel anytime · Instant access
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Comparison callout */}
                    <div className="mt-10 grid grid-cols-3 gap-4 max-w-xl mx-auto">
                        {[
                            { label: 'Samosa', price: '₹25', emoji: '🥟' },
                            { label: 'StudyShare', price: '₹39/mo', emoji: '📚', highlight: true },
                            { label: 'One coffee', price: '₹80', emoji: '☕' },
                        ].map(({ label, price, emoji, highlight }) => (
                            <div key={label} className={`rounded-2xl p-4 text-center border transition-all ${highlight ? 'bg-indigo-500/15 border-indigo-500/30 shadow-lg shadow-indigo-500/10' : 'bg-white/3 border-white/8'}`}>
                                <div className="text-2xl mb-1">{emoji}</div>
                                <div className={`text-xs font-bold mb-1 ${highlight ? 'text-indigo-300' : 'text-slate-500'}`}>{label}</div>
                                <div className={`text-sm font-black ${highlight ? 'text-white' : 'text-slate-400 line-through opacity-50'}`}>{price}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <section id="testimonials" className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                            Students <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Love It</span>
                        </h2>
                        <p className="text-slate-400 text-lg font-medium">Don't take our word for it</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-5">
                        {testimonials.map((t, i) => (
                            <div
                                key={t.name}
                                className={`bg-white/3 border rounded-3xl p-7 transition-all duration-500 ${i === activeTestimonial ? 'border-indigo-500/40 bg-indigo-500/5 shadow-xl shadow-indigo-500/10 scale-[1.02]' : 'border-white/8 hover:border-white/15'}`}
                            >
                                <div className="flex gap-0.5 mb-4">
                                    {Array.from({ length: t.stars }).map((_, k) => (
                                        <Star key={k} size={16} className="text-amber-400 fill-amber-400" />
                                    ))}
                                </div>
                                <p className="text-slate-300 font-medium text-sm leading-relaxed mb-6 italic">{t.text}</p>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.avatar}`}
                                        alt={t.name}
                                        className="w-10 h-10 rounded-full bg-indigo-900"
                                    />
                                    <div>
                                        <p className="text-white font-bold text-sm">{t.name}</p>
                                        <p className="text-slate-500 text-xs font-semibold">{t.college}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FINAL CTA ===== */}
            <section className="py-24 px-6">
                <div className="max-w-3xl mx-auto relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-[3rem] blur-3xl -z-10" />
                    <div className="bg-gradient-to-br from-[#0f1629]/80 to-[#0a0e1c]/80 border border-white/10 rounded-[3rem] p-14 text-center backdrop-blur-xl">
                        <div className="text-6xl mb-5">🎓</div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                            Your Next Grade<br />Starts Here.
                        </h2>
                        <p className="text-slate-400 text-lg font-medium mb-8 max-w-lg mx-auto">
                            Join thousands of students already using StudyShare to ace their exams. At ₹39/month, it's the best investment in your academic career.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/auth"
                                state={{ isSignUp: true }}
                                id="final-cta"
                                className="group inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black text-lg px-10 py-5 rounded-2xl transition-all duration-300 shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 hover:-translate-y-1"
                            >
                                Join StudyShare — ₹39/mo
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="flex items-center justify-center gap-6 mt-8">
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                                <Shield size={14} className="text-emerald-500" />
                                Secure & Private
                            </div>
                            <div className="w-px h-4 bg-white/10" />
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                                <Check size={14} className="text-blue-400" />
                                Cancel Anytime
                            </div>
                            <div className="w-px h-4 bg-white/10" />
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                                <Zap size={14} className="text-amber-400" />
                                Instant Access
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="border-t border-white/5 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <img src="/src/assets/logo.svg" alt="StudyShare" className="w-7 h-7" />
                        <span className="text-sm font-bold text-slate-500">StudyShare © 2025</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                        Built with ❤️ for Indian students. Study hard, score harder. 🚀
                    </p>
                    <div className="flex items-center gap-6">
                        <Link to="/auth" className="text-xs font-bold text-slate-500 hover:text-white transition-colors">Log In</Link>
                        <Link to="/auth" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">Sign Up →</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
