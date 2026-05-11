import React, { useEffect, useState } from 'react';
import studyShareLogo from '../assets/logo.svg';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Card';
import {
    Search, Loader2, Download, Sparkles, GraduationCap,
    UserPlus, UserCheck, MessageCircle, Heart, BookOpen, Filter, Share2
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export function Explorer() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeType, setActiveType] = useState('All');

    const handleShare = async (e, item) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isApp = item.id === 'app';
        const url = isApp ? window.location.origin : `${window.location.origin}/material/${item.id}`;
        const text = isApp 
            ? "Check out StudyShare! The best place to find notes and survival kits. 📚"
            : `Check out these study notes for ${item.subject || 'your exams'} on StudyShare! 🚀`;

        try {
            if (navigator.share) {
                await navigator.share({ title: isApp ? 'StudyShare' : item.title, text, url });
            } else {
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
                if (confirm(`Open WhatsApp to share ${isApp ? 'StudyShare' : 'this material'}?`)) {
                    window.open(whatsappUrl, '_blank');
                } else {
                    await navigator.clipboard.writeText(url);
                    alert('Link copied to clipboard! 🔗');
                }
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                await navigator.clipboard.writeText(url);
                alert('Link copied! 🔗');
            }
        }
    };

    // friendship status per uploader: { [uploaderId]: 'none' | 'pending' | 'incoming' | 'accepted' }
    const [connectMap, setConnectMap] = useState({});
    const [connectLoading, setConnectLoading] = useState({});

    // liked materials (local state only, for visual feedback)
    const [liked, setLiked] = useState({});

    useEffect(() => {
        fetchMaterials();
    }, [searchQuery, activeType]);

    // Once materials loaded, batch-fetch friendship statuses for unique uploaders
    useEffect(() => {
        if (!user || materials.length === 0) return;
        fetchFriendships();
    }, [materials, user]);

    const fetchMaterials = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('materials')
                .select('*')
                .order('created_at', { ascending: false });

            if (searchQuery) {
                query = query.or(`title.ilike.%${searchQuery}%,subject.ilike.%${searchQuery}%,university.ilike.%${searchQuery}%`);
            }
            if (activeType !== 'All') {
                query = query.ilike('type', `%${activeType}%`);
            }

            const { data, error } = await query;
            if (error) throw error;
            setMaterials(data || []);
        } catch (error) {
            console.error('Fetch error:', error);
            setMaterials([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchFriendships = async () => {
        if (!user) return;
        const uploaderIds = [...new Set(materials.map(m => m.uploaded_by).filter(Boolean))];
        if (!uploaderIds.length) return;

        const { data: fships } = await supabase
            .from('friendships')
            .select('requester_id, receiver_id, status')
            .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
            .in('requester_id', [user.id, ...uploaderIds])

        const map = {};
        for (const uid of uploaderIds) {
            if (uid === user.id) continue;
            const fs = (fships || []).find(f =>
                (f.requester_id === user.id && f.receiver_id === uid) ||
                (f.requester_id === uid && f.receiver_id === user.id)
            );
            if (!fs) { map[uid] = 'none'; continue; }
            if (fs.status === 'accepted') { map[uid] = 'accepted'; continue; }
            if (fs.status === 'pending') {
                map[uid] = fs.requester_id === user.id ? 'pending' : 'incoming';
            }
        }
        setConnectMap(map);
    };

    const handleConnect = async (e, uploaderId) => {
        e.preventDefault(); // don't navigate to material
        e.stopPropagation();
        if (!user || connectLoading[uploaderId]) return;
        setConnectLoading(prev => ({ ...prev, [uploaderId]: true }));
        const { data: fsData, error } = await supabase.from('friendships').insert([{
            requester_id: user.id,
            receiver_id: uploaderId,
            status: 'pending'
        }]).select().single();
        if (!error) {
            setConnectMap(prev => ({ ...prev, [uploaderId]: 'pending' }));
            // 🔔 Notify the uploader
            const senderName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'A student';
            await supabase.from('notifications').insert([{
                user_id: uploaderId,
                type: 'friend_request',
                sender_id: user.id,
                sender_name: senderName,
                reference_id: fsData?.id || null,
                message: `${senderName} wants to connect with you!`,
                is_read: false,
                created_at: new Date().toISOString()
            }]);
        }
        setConnectLoading(prev => ({ ...prev, [uploaderId]: false }));
    };

    const toggleLike = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        setLiked(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const filters = ['All', 'Notes', 'Assignment', 'Exam Paper', 'Summary'];

    const ConnectButton = ({ uploaderId, uploaderName }) => {
        if (!user || uploaderId === user.id) return null;
        const status = connectMap[uploaderId] || 'none';
        const isLoading = connectLoading[uploaderId];

        if (status === 'accepted') return (
            <Link to="/community" onClick={e => e.stopPropagation()}>
                <button className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-2.5 py-1.5 hover:bg-emerald-500/20 transition-all">
                    <MessageCircle size={11} /> DM
                </button>
            </Link>
        );
        if (status === 'pending') return (
            <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-2.5 py-1.5">
                Sent
            </span>
        );
        if (status === 'incoming') return (
            <Link to="/community" onClick={e => e.stopPropagation()}>
                <span className="text-[10px] font-black text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-xl px-2.5 py-1.5 cursor-pointer hover:bg-violet-500/20 transition-all">
                    Accept
                </span>
            </Link>
        );
        return (
            <button
                onClick={(e) => handleConnect(e, uploaderId)}
                disabled={isLoading}
                className="flex items-center gap-1.5 text-[10px] font-black text-white bg-primary-600 hover:bg-primary-500 rounded-xl px-2.5 py-1.5 transition-all shadow-sm disabled:opacity-60 active:scale-95"
            >
                {isLoading ? <Loader2 size={10} className="animate-spin" /> : <UserPlus size={11} />}
                Connect
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-body selection:bg-primary-500/30 overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent-600/10 blur-[120px] rounded-full" />
            </div>

            <Navbar />

            <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 relative z-10">

                {/* Hero Search Header */}
                <div className="bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border border-white/5 rounded-[3rem] p-10 md:p-14 mb-10 relative overflow-hidden text-center shadow-2xl">
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #6366f1, transparent 60%), radial-gradient(circle at 70% 50%, #a855f7, transparent 60%)' }} />
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <Badge variant="blue" className="mb-5 bg-primary-500/20 text-primary-300 border-primary-500/30 font-black tracking-widest uppercase">
                            <Sparkles size={12} className="mr-1" /> StudyConnect Feed
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-display font-black mb-6 leading-tight">
                            Discover notes. <span className="text-gradient italic">Connect</span> with students.
                        </h1>
                        <p className="text-slate-400 font-medium mb-8 text-lg">
                            Find the perfect study resource and connect with the person who made it.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                <input
                                    placeholder="Search subjects, universities, or topics..."
                                    className="w-full bg-slate-900/80 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-bold placeholder:text-slate-600"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="primary" size="lg" className="px-10 shadow-xl shadow-primary-600/20">
                                Hunt Notes
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar">
                    {filters.map(type => (
                        <button
                            key={type}
                            onClick={() => setActiveType(type)}
                            className={`px-5 py-2.5 border rounded-2xl text-sm font-black whitespace-nowrap transition-all ${activeType === type
                                ? 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-600/20'
                                : 'bg-slate-900 border-white/5 text-slate-400 hover:border-primary-500/50 hover:text-white'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Feed */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <Loader2 className="animate-spin text-primary-500 mb-4" size={48} />
                        <p className="text-sm font-black uppercase tracking-widest text-slate-500 animate-pulse">Scanning the matrix...</p>
                    </div>
                ) : materials.length === 0 ? (
                    <div className="col-span-full py-32 text-center bg-slate-900/40 border border-white/5 rounded-[3rem]">
                        <div className="text-6xl mb-6">🏜️</div>
                        <h3 className="text-2xl font-display font-black mb-2 italic">Matrix Empty.</h3>
                        <p className="text-slate-500 max-w-sm mx-auto font-medium">No survival kits found. Be the academic weapon this campus needs.</p>
                        <Link to="/upload">
                            <Button variant="primary" className="mt-8">Upload Original Notes</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                        {materials.map((item) => {
                            const isOwn = user?.id === item.uploaded_by;
                            const uploaderName = item.uploader_name || 'Study Scholar';
                            const timeAgo = item.created_at
                                ? (() => {
                                    const diff = Date.now() - new Date(item.created_at).getTime();
                                    const d = Math.floor(diff / 86400000);
                                    if (d > 0) return `${d}d ago`;
                                    const h = Math.floor(diff / 3600000);
                                    if (h > 0) return `${h}h ago`;
                                    return 'Just now';
                                })()
                                : '';

                            return (
                                <div key={item.id} className="break-inside-avoid">
                                    <Link to={`/material/${item.id}`} className="group block">
                                        <div className="bg-slate-900 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden hover:border-primary-500/20 hover:shadow-2xl transition-all duration-300 h-full flex flex-col">

                                            {/* Thumbnail (Top) */}
                                            <div className="h-32 md:h-44 bg-gradient-to-br from-slate-800 via-indigo-950 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500 shrink-0 gap-2 px-3">
                                                {/* Subtle animated bg glow */}
                                                <div className="absolute inset-0 pointer-events-none">
                                                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary-600/20 rounded-full blur-2xl animate-pulse" />
                                                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-accent-600/15 rounded-full blur-2xl" />
                                                </div>
                                                {/* StudyShare Logo */}
                                                <img
                                                    src={studyShareLogo}
                                                    alt="StudyShare"
                                                    className="w-8 h-8 md:w-10 md:h-10 object-contain z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0"
                                                />
                                                {/* Material Title */}
                                                <p className="z-10 text-center font-display font-black text-white text-[11px] md:text-sm leading-tight line-clamp-3 drop-shadow-md px-1 group-hover:text-primary-300 transition-colors duration-200">
                                                    {item.title}
                                                </p>
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                <Badge variant="blue" className="absolute top-2 left-2 md:top-3 md:left-3 bg-primary-500/20 text-primary-300 border-primary-500/30 uppercase tracking-widest text-[8px] md:text-[9px] font-black">
                                                    {item.type || 'Notes'}
                                                </Badge>
                                            </div>

                                            {/* Info Content */}
                                            <div className="p-3 md:p-5 flex-1 flex flex-col">
                                                <div className="flex justify-between items-start gap-2 mb-2">
                                                    <h3 className="font-display font-black text-white text-xs md:text-base leading-tight group-hover:text-primary-400 transition-colors line-clamp-2 min-h-[2.5rem]">
                                                        {item.title}
                                                    </h3>
                                                    <button 
                                                        onClick={(e) => handleShare(e, item)}
                                                        className="p-1.5 md:p-2 bg-white/5 hover:bg-primary-500/20 text-slate-400 hover:text-primary-400 rounded-lg transition-all shrink-0 active:scale-90"
                                                        title="Share Material"
                                                    >
                                                        <Share2 size={14} className="md:w-[16px] md:h-[16px]" />
                                                    </button>
                                                </div>
                                                
                                                <div className="flex items-center gap-1.5 text-slate-500 text-[9px] md:text-xs font-bold mb-3 mt-auto">
                                                    <GraduationCap size={10} className="text-slate-600 shrink-0" />
                                                    <span className="truncate">{item.university || item.subject}</span>
                                                </div>

                                                {/* Uploader small row */}
                                                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-5 h-5 rounded-lg bg-primary-600/20 flex items-center justify-center text-[10px] border border-white/5">🎓</div>
                                                        <span className="text-[9px] font-bold text-slate-400 truncate max-w-[50px] md:max-w-none">{uploaderName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[9px] font-black text-primary-500 uppercase">
                                                        <Download size={10} /> {item.downloads || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
