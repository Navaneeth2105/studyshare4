import React, { useEffect, useState } from 'react';
import { Search, Loader2, Instagram, Linkedin, Github, Globe, Heart } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card, Badge } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Navbar } from '../components/layout/Navbar';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export function Landing() {
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrending();
    }, []);

    const fetchTrending = async () => {
        try {
            const { data, error } = await supabase
                .from('materials')
                .select('*')
                .order('downloads', { ascending: false })
                .limit(6);
            if (error) throw error;
            setTrending(data || []);
        } catch (error) {
            console.error('Error fetching trending:', error);
        } finally {
            setLoading(false);
        }
    };

    const floatingEmojis = [
        // 1. Concentrated / Studying
        { emoji: '🤓', top: '10%', left: '5%', delay: '0s' },
        { emoji: '🧐', top: '15%', left: '40%', delay: '4s' },
        { emoji: '😑', top: '25%', left: '75%', delay: '2s' },
        // 2. Thinking / Confused
        { emoji: '🤔', top: '40%', left: '10%', delay: '1.5s' },
        { emoji: '😵‍💫', top: '20%', left: '85%', delay: '1s' },
        { emoji: '🫤', top: '75%', left: '15%', delay: '3.5s' },
        // 3. Sleepy
        { emoji: '😴', top: '80%', left: '30%', delay: '5s' },
        { emoji: '🥱', top: '60%', left: '90%', delay: '2.5s' },
        // 4. Stressed
        { emoji: '😰', top: '50%', left: '5%', delay: '0.5s' },
        { emoji: '😬', top: '70%', left: '80%', delay: '4.2s' },
        // 5. Confident
        { emoji: '😎', top: '5%', left: '90%', delay: '1.2s' },
        { emoji: '💪', top: '85%', left: '5%', delay: '3s' },
        // 6. Symbols
        { emoji: '📚', top: '35%', left: '85%', delay: '0.8s' },
        { emoji: '🧠', top: '45%', left: '45%', delay: '1.8s' },
        { emoji: '✨', top: '90%', left: '60%', delay: '2.2s' },
    ];

    const moodGroups = [
        { label: 'Studying', emojis: ['🤓', '🧐', '😐', '😑', '😶'] },
        { label: 'Confused', emojis: ['🤔', '😕', '😵‍💫', '😣', '🫤'] },
        { label: 'Sleepy', emojis: ['😴', '🥱', '😪', '😩', '😫'] },
        { label: 'Stressed', emojis: ['😰', '😓', '😖', '😬', '😨'] },
        { label: 'Confident', emojis: ['😎', '💪', '😌', '😏', '🥳'] },
        { label: 'Mind Blown', emojis: ['😃', '😄', '🤩', '😁', '🎉'] },
    ];

    return (
        <div className="min-h-screen text-slate-800 font-body selection:bg-accent-light selection:text-accent-hover overflow-x-hidden relative bg-background">
            {/* Motion Emojis Background */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {floatingEmojis.map((item, i) => (
                    <div
                        key={i}
                        className="absolute text-4xl opacity-10 animate-float"
                        style={{
                            top: item.top,
                            left: item.left,
                            animationDelay: item.delay
                        }}
                    >
                        {item.emoji}
                    </div>
                ))}
            </div>

            <Navbar />

            <main className="pt-32 pb-20 px-4 relative z-10">
                {/* Hero Section */}
                <section className="max-w-4xl mx-auto text-center mb-24">
                    <Badge variant="yellow" className="mb-6 animate-pulse">
                        🚨 Finals Week approaching? We gotchu.
                    </Badge>

                    <h1 className="text-5xl md:text-7xl font-display font-black text-slate-900 leading-[1.1] mb-6">
                        POV: You found the <br />
                        <span className="text-primary-600 inline-block rotate-1">exact notes</span>
                        <span className="text-slate-900"> before exams 😌</span>
                    </h1>

                    <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto font-medium">
                        Zero gatekeeping. Just pure academic weapon energy.
                        Join 2.5M+ students sharing the cheat codes to degreemaxxing.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 px-4">
                        <div className="w-full max-w-md relative">
                            <Input
                                icon={Search}
                                placeholder="🔍 Find that one PDF..."
                                className="shadow-[0_4px_0_0_#e2e8f0]"
                            />
                        </div>
                        <Link to="/explore">
                            <Button variant="accent" className="w-full sm:w-auto text-shadow-sm">
                                Start Studying Smarter →
                            </Button>
                        </Link>
                    </div>

                    {/* Social Proof / Trust */}
                    <div className="flex flex-wrap justify-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                        <span className="font-display font-bold text-slate-400">Harvard (Real)</span>
                        <span className="font-display font-bold text-slate-400">MIT (Fr)</span>
                        <span className="font-display font-bold text-slate-400">Stanford (No Cap)</span>
                    </div>
                </section>

                {/* Core Features: What we consist of */}
                <section className="max-w-6xl mx-auto mb-32 px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-display font-black text-slate-900 mb-4">
                            Everything you need to <span className="text-primary-600 block sm:inline">Degreemax 🧠</span>
                        </h2>
                        <p className="text-slate-500 font-medium max-w-2xl mx-auto">
                            We've built the ultimate survival toolkit for students. No more digging through random WhatsApp groups.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 hover:bg-primary-50 hover:border-primary-100 transition-all group shadow-sm">
                            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-3xl mb-8 shadow-sm group-hover:scale-110 transition-transform">🤖</div>
                            <h3 className="text-2xl font-display font-bold text-slate-900 mb-4">AI Sensei</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                Upload any PDF and let our Gemini-powered AI break it down, quiz you, and explain complex concepts in slang you actually understand.
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 hover:bg-secondary-50 hover:border-secondary-100 transition-all group shadow-sm">
                            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-3xl mb-8 shadow-sm group-hover:scale-110 transition-transform">📂</div>
                            <h3 className="text-2xl font-display font-bold text-slate-900 mb-4">Survival Kits</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                Access a massive library of notes, assignments, and past papers shared by top students from your university.
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 hover:bg-accent-light hover:border-accent-light transition-all group shadow-sm">
                            <div className={`w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-3xl mb-8 shadow-sm group-hover:scale-110 transition-transform`}>🧊</div>
                            <h3 className="text-2xl font-display font-bold text-slate-900 mb-4">Chill Zone</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                A global community chat where you can vent about exams, find study buddies, and share "academic weapon" memes.
                            </p>
                        </div>
                    </div>
                </section>

                {/* New: Vibe Check Component */}
                <section className="max-w-6xl mx-auto mb-32 px-4 relative">
                    <div className="glass-dark rounded-[3rem] p-10 md:p-16 border border-primary-500/20 shadow-2xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>

                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                                <div className="text-center md:text-left">
                                    <Badge variant="blue" className="mb-4 bg-primary-500/10 text-primary-400 border-primary-500/20 uppercase tracking-widest font-black">
                                        Community Vibe
                                    </Badge>
                                    <h2 className="text-3xl md:text-5xl font-display font-black text-white leading-tight">
                                        Current Study <span className="text-gradient">Vibe Check</span>
                                    </h2>
                                    <p className="text-slate-400 font-medium mt-2">How's the brain feeling today, academic weapon?</p>
                                </div>
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center text-xl shadow-lg ring-2 ring-primary-500/20">
                                            {i === 1 ? '🤓' : i === 2 ? '😵‍💫' : i === 3 ? '😴' : i === 4 ? '😎' : '🎉'}
                                        </div>
                                    ))}
                                    <div className="w-12 h-12 rounded-full border-4 border-slate-900 bg-primary-600 flex items-center justify-center text-xs font-black text-white shadow-lg ring-2 ring-primary-500/20">
                                        +2k
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                                {moodGroups.map((group, i) => (
                                    <div key={i} className="group/mood">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-2 group-hover/mood:text-primary-400 transition-colors">
                                            {group.label}
                                        </div>
                                        <div className="bg-slate-950/50 rounded-2xl p-2 border border-white/5 group-hover/mood:border-primary-500/30 transition-all flex justify-between h-14 items-center">
                                            {group.emojis.map((emoji, j) => (
                                                <button
                                                    key={j}
                                                    className="w-10 h-10 flex items-center justify-center text-xl hover:bg-white/10 rounded-xl transition-all hover:scale-125"
                                                    title={group.label}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-4 items-center justify-center md:justify-start">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-500 mr-2">Study Combos:</span>
                                <div className="px-4 py-2 bg-slate-950 rounded-full border border-white/5 text-sm font-bold text-slate-300 hover:border-primary-500/50 transition-all cursor-pointer">
                                    🤓📚✏️ Serious Mode
                                </div>
                                <div className="px-4 py-2 bg-slate-950 rounded-full border border-white/5 text-sm font-bold text-slate-300 hover:border-primary-500/50 transition-all cursor-pointer">
                                    😴📖 Sleepy Study
                                </div>
                                <div className="px-4 py-2 bg-slate-950 rounded-full border border-white/5 text-sm font-bold text-slate-300 hover:border-primary-500/50 transition-all cursor-pointer">
                                    😰📝 Exam Tension
                                </div>
                                <div className="px-4 py-2 bg-slate-950 rounded-full border border-white/5 text-sm font-bold text-slate-300 hover:border-primary-500/50 transition-all cursor-pointer">
                                    😎🧠 Smart Mode
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trending "Everyone's Studying This" + AD Placement */}
                <section className="max-w-6xl mx-auto mb-24 lg:px-0 px-4">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3">
                            <span>🔥</span>
                            Everyone’s Studying This
                        </h2>
                        <Link to="/explore" className="text-primary-600 font-bold hover:underline">See all the tea →</Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* AD PLACEMENT 1: Promoted Card */}
                        <Card reaction="🚀" className="cursor-pointer group border-primary-200 bg-primary-50/30 overflow-hidden relative">
                            <div className="absolute top-0 right-0 px-3 py-1 bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-xl z-20">
                                Promoted
                            </div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm group-hover:rotate-6 transition-transform">
                                    💻
                                </div>
                                <Badge variant="yellow">Exclusive Deal</Badge>
                            </div>
                            <h3 className="text-xl font-display font-bold text-slate-900 mb-2 group-hover:text-primary-600">
                                MacBook Air M3: Student Price + Free AirPods
                            </h3>
                            <div className="flex items-center justify-between text-slate-500 text-sm font-medium">
                                <span className="flex items-center gap-1 font-bold text-primary-600">Unidays x StudyShare</span>
                                <Button variant="ghost" size="sm" className="p-0 h-auto font-black text-xs text-slate-900">Grab Deal →</Button>
                            </div>
                        </Card>

                        {loading ? (
                            <div className="col-span-2 flex items-center justify-center py-20">
                                <Loader2 className="animate-spin text-primary-500" size={40} />
                            </div>
                        ) : trending.map((item, i) => (
                            <Link to={`/material/${item.id}`} key={item.id}>
                                <Card reaction={i === 0 ? "🤯" : i === 1 ? "🧪" : "📚"} className="cursor-pointer group h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                            {item.type?.toLowerCase().includes('pdf') ? '📄' : '📝'}
                                        </div>
                                        <Badge variant="blue">{item.type || 'Note'}</Badge>
                                    </div>
                                    <h3 className="text-xl font-display font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center justify-between text-slate-500 text-sm font-medium">
                                        <span className="flex items-center gap-1 truncate max-w-[150px]">👤 {item.university || 'Scholar'}</span>
                                        <span className="flex items-center gap-1 text-accent-hover italic">🔥 {item.downloads || 0} hits</span>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* AD PLACEMENT 2: Partner Spotlight Banner */}
                <section className="max-w-6xl mx-auto mb-24 px-4">
                    <div className="bg-linear-to-r from-slate-900 to-indigo-900 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 shadow-2xl relative overflow-hidden">
                        {/* Subtle Grainy Background */}
                        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-white/20">🎁</div>
                            <div className="text-center md:text-left">
                                <Badge variant="yellow" className="mb-4 bg-accent-400 text-slate-900 border-none font-black uppercase tracking-widest">Partner Spotlight</Badge>
                                <h3 className="text-2xl md:text-3xl font-display font-black text-white mb-2">Upgrade your Study Setup for $0.</h3>
                                <p className="text-indigo-200 font-medium">Get 1 year of Notion Plus for free as a StudyShare OG. Limited time only.</p>
                            </div>
                        </div>
                        <Button variant="accent" className="relative z-10 px-8 py-6 rounded-2xl shadow-xl shadow-accent-950/20 whitespace-nowrap">Claim Student Benefit →</Button>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="max-w-5xl mx-auto rounded-[3rem] bg-slate-900 text-white p-12 md:p-20 text-center relative overflow-hidden mb-24">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-display font-black mb-6">
                            Got notes gathering dust?
                        </h2>
                        <p className="text-xl text-slate-300 mb-10 max-w-xl mx-auto">
                            Upload once. Help thousands. Watch your karma go to the moon. 🚀
                        </p>
                        <Link to="/upload">
                            <Button variant="accent" size="lg" className="shadow-[0_4px_0_0_#7c2d12]">
                                📤 Drop Your Brain Files
                            </Button>
                        </Link>
                        <p className="mt-6 text-sm text-slate-400 font-medium">
                            100% Free. Zero Gatekeeping.
                        </p>
                    </div>
                </section>

                {/* New: The Channel / Profile Upgrade Section */}
                <section className="max-w-6xl mx-auto mb-24 px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-black text-slate-900 mb-4">
                            🏆 Top Academic Weapons
                        </h2>
                        <p className="text-slate-500 font-medium text-lg">
                            The legends passing notes and saving semesters in real-time.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { name: "Navaneeth", bio: "Notes King 👑", karma: "25k", files: "42", color: "from-blue-500 to-indigo-600", emoji: "⚡" },
                            { name: "Sarah_CS", bio: "Algorithmic Goddess", karma: "18k", files: "29", color: "from-purple-500 to-pink-600", emoji: "🧠" },
                            { name: "Drake_Eng", bio: "Mech Mech Mech", karma: "12k", files: "15", color: "from-orange-500 to-red-600", emoji: "⚙️" },
                            { name: "Ananya_Med", bio: "Bio Flashcard Pro", karma: "30k", files: "56", color: "from-green-500 to-teal-600", emoji: "🩺" }
                        ].map((profile, i) => (
                            <div key={i} className="group relative">
                                <Card className="p-0 overflow-hidden border-none shadow-2xl transition-all duration-500 group-hover:-translate-y-4 group-hover:rotate-2">
                                    <div className={`h-24 bg-linear-to-br ${profile.color} relative overflow-hidden`}>
                                        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            <div className="w-2 h-2 rounded-full bg-white/40"></div>
                                            <div className="w-2 h-2 rounded-full bg-white/40"></div>
                                            <div className="w-2 h-2 rounded-full bg-white/40"></div>
                                        </div>
                                    </div>
                                    <div className="px-6 pb-8 pt-12 relative">
                                        {/* Profile Photo - "Downsize" effect on hover */}
                                        <div className="absolute -top-10 left-6 w-20 h-20 rounded-3xl bg-white p-1 shadow-xl transition-all duration-500 group-hover:w-16 group-hover:h-16 group-hover:-top-8">
                                            <div className={`w-full h-full rounded-2xl bg-linear-to-br ${profile.color} flex items-center justify-center text-3xl shadow-inner`}>
                                                {profile.emoji}
                                            </div>
                                            {/* Status Dot */}
                                            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
                                        </div>

                                        <div className="mb-6">
                                            <h3 className="text-xl font-display font-black text-slate-900 leading-tight">
                                                {profile.name}
                                            </h3>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{profile.bio}</p>
                                        </div>

                                        <div className="flex gap-4 mb-6">
                                            <div className="flex-1 bg-slate-50 rounded-2xl p-3 text-center transition-colors group-hover:bg-primary-50">
                                                <div className="text-xs font-black text-slate-400 uppercase tracking-tighter mb-1">Karma</div>
                                                <div className="text-lg font-black text-slate-900 group-hover:text-primary-600">{profile.karma}</div>
                                            </div>
                                            <div className="flex-1 bg-slate-50 rounded-2xl p-3 text-center transition-colors group-hover:bg-accent-light">
                                                <div className="text-xs font-black text-slate-400 uppercase tracking-tighter mb-1">Files</div>
                                                <div className="text-lg font-black text-slate-900 group-hover:text-accent-hover">{profile.files}</div>
                                            </div>
                                        </div>

                                        <Button variant="outline" size="sm" className="w-full rounded-2xl font-black uppercase tracking-widest text-[10px] py-3 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                            Visit Channel →
                                        </Button>
                                    </div>

                                    {/* Action Hint on Right Click (Mock) */}
                                    <div className="absolute inset-0 bg-slate-900/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-6 text-center pointer-events-none">
                                        <p className="font-bold text-sm">
                                            Right-click to inspect <br />
                                            <span className="text-accent-400">@{profile.name}'s</span> <br />
                                            Vault
                                        </p>
                                    </div>
                                </Card>

                                {/* Decorative "Passed Note" behind */}
                                <div className="absolute inset-0 -z-10 bg-slate-100 rounded-3xl rotate-3 translate-x-3 translate-y-3 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 p-8 bg-linear-to-br from-primary-50 to-indigo-50 rounded-[3rem] border border-primary-100 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg transform -rotate-6">
                                <span className="text-3xl">📡</span>
                            </div>
                            <div>
                                <h4 className="text-xl font-display font-black text-slate-900">Live Note Broadcast</h4>
                                <p className="text-slate-500 font-medium">Navaneeth just passed "Xamarin Advanced UI" to his channel.</p>
                            </div>
                        </div>
                        <Link to="/community">
                            <Button variant="primary" className="rounded-2xl px-8 shadow-xl shadow-primary-500/20">
                                Join the Channel →
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 pt-24 pb-12 relative overflow-hidden">
                {/* Decorative Background Element */}
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>

                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
                        {/* Meet the Architect Section */}
                        <div className="text-left">
                            <Badge variant="blue" className="mb-4 bg-primary-50 text-primary-600 border-primary-100 font-black uppercase tracking-widest">
                                The Architect
                            </Badge>
                            <h2 className="text-4xl font-display font-black text-slate-900 mb-6">
                                Built for students, by <span className="text-gradient">Navaneeth</span>
                            </h2>
                            <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-md mb-8">
                                I built StudyShare to kill gatekeeping in academics. Let's make sure no student ever has to fail because they couldn't find the right notes.
                            </p>
                            <div className="flex items-center gap-4">
                                <a href="https://instagram.com/_navaneeth.k_" target="_blank" rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-pink-50 hover:text-pink-600 transition-all hover:-translate-y-1 shadow-sm">
                                    <Instagram size={24} />
                                </a>
                                <a href="https://linkedin.com/in/navaneeth-k" target="_blank" rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all hover:-translate-y-1 shadow-sm">
                                    <Linkedin size={24} />
                                </a>
                                <a href="https://github.com/navaneeth-k" target="_blank" rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-all hover:-translate-y-1 shadow-sm">
                                    <Github size={24} />
                                </a>
                                <div className="h-12 w-px bg-slate-100 mx-2"></div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Location</span>
                                    <span className="text-sm font-bold text-slate-700">Digital World 🌐</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Action Card */}
                        <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 blur-2xl rounded-full"></div>
                            <h3 className="text-2xl font-display font-bold mb-4 relative z-10">Wanna collaborate?</h3>
                            <p className="text-slate-400 font-medium mb-8 relative z-10">
                                If you're an academic weapon who wants to help scale this mission, slide into my DMs.
                            </p>
                            <Button variant="accent" className="w-full rounded-2xl py-6 font-black uppercase tracking-widest group-hover:scale-[1.02] transition-transform">
                                Send a Message 🚀
                            </Button>
                        </div>
                    </div>

                    {/* Standard Footer Bottom */}
                    <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-3">
                            <img src="/src/assets/logo.svg" alt="StudyShare Logo" className="w-10 h-10 object-contain shadow-lg shadow-primary-500/20" />
                            <span className="font-display font-black text-2xl tracking-tighter text-slate-900">STUDYSHARE.</span>
                        </div>

                        <div className="flex items-center gap-8">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-primary-600 cursor-pointer transition-colors">Privacy</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-primary-600 cursor-pointer transition-colors">Terms</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-primary-600 cursor-pointer transition-colors">Support</span>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            MADE WITH <Heart size={10} className="text-red-500 fill-red-500" /> BY <span className="text-primary-600">STUDYSHARE CREW</span>
                        </div>
                    </div>

                    <div className="mt-8 text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em]">
                        © 2026 {new Date().getFullYear() !== 2026 && `- ${new Date().getFullYear()}`} StudyShare Global | All Rights Reserved
                    </div>
                </div>
            </footer>
        </div>
    );
}
