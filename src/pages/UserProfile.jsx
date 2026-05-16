import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Card';
import {
    ArrowLeft, School, Book, Calendar, FileText, Download,
    UserPlus, UserCheck, MessageCircle, Loader2, Sparkles
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';

export function UserProfile() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [profile, setProfile] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [connectStatus, setConnectStatus] = useState('none'); // 'none' | 'pending' | 'incoming' | 'accepted'
    const [connectLoading, setConnectLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const isSelf = user?.id === userId;
    const sub = useSubscription();  // karma-based plan info (only meaningful for self)

    useEffect(() => {
        fetchAll();
    }, [userId, user]);

    const fetchAll = async () => {
        setPageLoading(true);
        await Promise.all([fetchProfile(), fetchMaterials()]);
        if (user && !isSelf) await checkFriendship();
        setPageLoading(false);
    };

    const fetchProfile = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .eq('id', userId)
            .maybeSingle();
        // Merge with user_metadata from auth (for university/degree/year)
        // We store those in materials rows as well, so derive from first material
        setProfile(data);
    };

    const fetchMaterials = async () => {
        const { data } = await supabase
            .from('materials')
            .select('*')
            .eq('uploaded_by', userId)
            .order('created_at', { ascending: false });
        setMaterials(data || []);
    };

    const checkFriendship = async () => {
        if (!user || !userId) return;
        const { data } = await supabase
            .from('friendships')
            .select('status, requester_id')
            .or(
                `and(requester_id.eq.${user.id},receiver_id.eq.${userId}),` +
                `and(requester_id.eq.${userId},receiver_id.eq.${user.id})`
            )
            .maybeSingle();

        if (!data) { setConnectStatus('none'); return; }
        if (data.status === 'accepted') { setConnectStatus('accepted'); return; }
        if (data.status === 'pending') {
            setConnectStatus(data.requester_id === user.id ? 'pending' : 'incoming');
        }
    };

    const handleConnect = async () => {
        if (!user) return;
        setConnectLoading(true);
        const { error } = await supabase.from('friendships').insert([{
            requester_id: user.id,
            receiver_id: userId,
            status: 'pending'
        }]);
        if (!error) setConnectStatus('pending');
        setConnectLoading(false);
    };

    // Derive academic info from materials or profile
    const displayName = profile?.full_name || profile?.username || 'Student';
    const firstMaterial = materials[0];
    const university = firstMaterial?.university || '—';
    const subject = firstMaterial?.subject || '—';
    const totalDownloads = materials.reduce((a, c) => a + (c.downloads || 0), 0);

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 size={48} className="animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white font-body overflow-x-hidden">
            {/* Ambient blobs */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary-600/10 blur-[140px] rounded-full animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-600/8 blur-[140px] rounded-full" />
            </div>

            <Navbar />

            <main className="pt-28 pb-20 max-w-5xl mx-auto px-4 relative z-10">
                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-bold mb-8 transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                {/* Profile Hero Card */}
                <div className="relative rounded-[2.5rem] overflow-hidden mb-10 border border-white/5 shadow-2xl">
                    {/* Banner gradient */}
                    <div className="h-40 bg-gradient-to-br from-primary-900 via-indigo-900 to-slate-900 relative">
                        <div className="absolute inset-0 opacity-20"
                            style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #6366f1 0%, transparent 60%)' }} />
                        <Sparkles className="absolute top-6 right-8 text-primary-400 opacity-30 animate-pulse" size={32} />
                    </div>

                    {/* Avatar + Info */}
                    <div className="bg-slate-900/80 backdrop-blur-xl px-8 pb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-12 mb-6">
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-5xl shadow-2xl border-4 border-slate-900 shrink-0">
                                🎓
                            </div>
                            <div className="flex-1 pb-1">
                                <h1 className="text-3xl font-display font-black text-white">{displayName}</h1>
                                <p className="text-slate-400 text-sm font-medium mt-0.5">
                                    {profile?.username ? `@${profile.username}` : 'StudyShare Member'}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            {isSelf ? (
                                <Link to="/dashboard">
                                    <Button variant="outline" className="rounded-2xl border-white/10 text-slate-300 hover:bg-white/5">
                                        Edit Profile
                                    </Button>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-3 pb-1">
                                    {connectStatus === 'accepted' ? (
                                        <>
                                            <span className="flex items-center gap-1.5 text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
                                                <UserCheck size={14} /> Friends
                                            </span>
                                            <Link to="/community">
                                                <button className="flex items-center gap-1.5 text-xs font-black text-white bg-primary-600 hover:bg-primary-500 rounded-xl px-4 py-2.5 transition-all shadow-lg shadow-primary-900/30">
                                                    <MessageCircle size={14} /> Send DM
                                                </button>
                                            </Link>
                                        </>
                                    ) : connectStatus === 'pending' ? (
                                        <span className="flex items-center gap-1.5 text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5">
                                            <UserPlus size={14} /> Request Sent
                                        </span>
                                    ) : connectStatus === 'incoming' ? (
                                        <Link to="/community">
                                            <span className="flex items-center gap-1.5 text-xs font-black text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-2.5 cursor-pointer hover:bg-violet-500/20 transition-all">
                                                <UserPlus size={14} /> Accept in Chill Zone
                                            </span>
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={handleConnect}
                                            disabled={connectLoading}
                                            className="flex items-center gap-1.5 text-sm font-black text-white bg-primary-600 hover:bg-primary-500 rounded-xl px-5 py-2.5 transition-all shadow-lg shadow-primary-900/30 active:scale-95 disabled:opacity-60"
                                        >
                                            {connectLoading ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                                            Connect
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Academic Info Chips */}
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/8 rounded-xl text-sm font-bold text-slate-300">
                                <School size={14} className="text-primary-400" /> {university}
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/8 rounded-xl text-sm font-bold text-slate-300">
                                <Book size={14} className="text-accent-400" /> {subject}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8 md:mb-10">
                    {[
                        { label: 'Shared', value: materials.length, icon: '📄' },
                        { label: 'Downloads', value: totalDownloads, icon: '⬇️' },
                        { label: 'Karma', value: totalDownloads * 15, icon: '⭐' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-slate-900/60 border border-white/5 rounded-2xl md:rounded-[1.5rem] p-3 md:p-5 text-center backdrop-blur-xl flex flex-col justify-center">
                            <div className="text-xl md:text-3xl mb-1">{stat.icon}</div>
                            <div className="text-lg md:text-2xl font-display font-black text-white">{stat.value}</div>
                            <div className="text-[9px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 leading-tight">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* ── Subscription Card (self only) ── */}
                {isSelf && (
                    <div className="mb-8">
                        <div className="relative rounded-[2rem] overflow-hidden border border-white/8 bg-gradient-to-br from-slate-900/80 to-indigo-950/60 backdrop-blur-xl p-6 md:p-8">
                            {/* glow */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/10 blur-3xl rounded-full -z-0" />

                            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl">
                                        {sub.isSubscribed ? '🎓⚡' : sub.isTrialActive ? '🎁' : '💀'}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-0.5">Your Plan</p>
                                        <h3 className="text-lg font-black text-white">
                                            {sub.isSubscribed
                                                ? sub.planName
                                                : sub.isTrialActive
                                                    ? `Free Trial — ${sub.trialDaysLeft} day${sub.trialDaysLeft !== 1 ? 's' : ''} left 🏃`
                                                    : 'Brain Dead (No Plan) 💀'}
                                        </h3>
                                        <p className="text-xs font-medium text-slate-500 mt-0.5">
                                            {sub.isSubscribed
                                                ? `Active · ${sub.price}/mo · Renews monthly`
                                                : sub.isTrialActive
                                                    ? 'Enjoying the free ride while it lasts? Smart move.'
                                                    : 'Trial ended. Subscribe to keep the grind going.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 shrink-0">
                                    {/* Karma pill */}
                                    <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-1.5 text-xs font-black text-yellow-400">
                                        ⭐ {sub.karma} Karma
                                        {sub.karma >= 100 && <span className="text-green-400 ml-1">→ ₹29 rate!</span>}
                                    </div>

                                    <Link
                                        to="/subscribe"
                                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-black px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-900/30 active:scale-95"
                                    >
                                        {sub.isSubscribed ? '🔄 Manage Plan' : sub.isTrialActive ? '⚡ Subscribe Early' : '🚀 Subscribe Now'}
                                    </Link>
                                </div>
                            </div>

                            {/* Plan name info */}
                            {!sub.isSubscribed && (
                                <div className="relative z-10 mt-5 pt-5 border-t border-white/5 flex flex-wrap gap-3">
                                    <div className="flex items-center gap-2 bg-slate-800/60 border border-white/5 rounded-xl px-3 py-2 text-xs font-bold text-slate-400">
                                        🧠💀 <span className="text-slate-300">Brain Rot Beginner</span> — ₹39/mo
                                    </div>
                                    <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-xl px-3 py-2 text-xs font-bold text-violet-400">
                                        🎓⚡ <span className="text-violet-300">Certified Academic Weapon</span> — ₹29/mo (100+ Karma)
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Uploaded Notes */}
                <div>
                    <h2 className="text-xl font-display font-black text-white mb-5 flex items-center gap-2">
                        <FileText size={20} className="text-primary-400" />
                        Notes by {displayName}
                    </h2>

                    {materials.length === 0 ? (
                        <div className="text-center py-20 bg-slate-900/40 border border-white/5 rounded-[2rem] text-slate-500">
                            <div className="text-5xl mb-4">🫙</div>
                            <p className="font-black uppercase tracking-widest text-sm">No notes uploaded yet</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-5">
                            {materials.map((item) => (
                                <Link to={`/material/${item.id}`} key={item.id} className="group">
                                    <div className="bg-slate-900/60 border border-white/5 rounded-[1.8rem] p-5 hover:border-primary-500/30 hover:bg-slate-900/80 transition-all group-hover:shadow-xl group-hover:shadow-primary-900/20 flex items-center gap-4">
                                        <div className="w-14 h-14 bg-primary-500/10 rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:bg-primary-500/20 transition-colors border border-primary-500/10">
                                            {item.type?.toLowerCase().includes('pdf') ? '📄' : '📝'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Badge variant="blue" className="mb-1.5 bg-primary-500/10 text-primary-400 border-primary-500/20 uppercase tracking-widest text-[9px]">
                                                {item.type || 'Notes'}
                                            </Badge>
                                            <h3 className="font-display font-bold text-white truncate group-hover:text-primary-400 transition-colors">
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1 text-xs font-bold text-slate-500">
                                                <span className="flex items-center gap-1"><Download size={11} /> {item.downloads || 0}</span>
                                                <span className="truncate">{item.subject}</span>
                                            </div>
                                        </div>
                                        <div className="text-xs font-black text-slate-600 uppercase tracking-widest group-hover:text-primary-400 transition-colors shrink-0">
                                            Open →
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
