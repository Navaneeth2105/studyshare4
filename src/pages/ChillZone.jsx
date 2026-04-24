import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/common/Button';
import {
    Send, Hash, Users, MoreVertical, Image as ImageIcon,
    Loader2, Sparkles, UserPlus, MessageCircle, Check,
    X, ArrowLeft, UserCheck, Search, Bell
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

/* ─── helpers ─── */
const displayName = (u) =>
    u?.user_metadata?.full_name ||
    u?.user_metadata?.username ||
    u?.email?.split('@')[0] ||
    'Anon';

const timeStr = (ts) =>
    ts ? new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

/* ─── floating emoji background ─── */
const floatingEmojis = [
    { emoji: '🔥', top: '15%', left: '10%', delay: '0s' },
    { emoji: '💀', top: '25%', left: '85%', delay: '2s' },
    { emoji: '💯', top: '40%', left: '5%', delay: '4s' },
    { emoji: '🙏', top: '60%', left: '90%', delay: '1.5s' },
    { emoji: '😂', top: '75%', left: '15%', delay: '3.5s' },
    { emoji: '🫡', top: '10%', left: '70%', delay: '5s' },
    { emoji: '🛹', top: '85%', left: '40%', delay: '2.5s' },
    { emoji: '🎮', top: '35%', left: '20%', delay: '0.8s' },
    { emoji: '🍕', top: '50%', left: '80%', delay: '1.2s' },
    { emoji: '🎧', top: '70%', left: '50%', delay: '3s' },
    { emoji: '🚀', top: '5%', left: '30%', delay: '1s' },
    { emoji: '💎', top: '45%', left: '75%', delay: '2.5s' },
    { emoji: '🌈', top: '80%', left: '10%', delay: '4.5s' },
    { emoji: '🎸', top: '65%', left: '25%', delay: '3.2s' },
    { emoji: '⚡', top: '70%', left: '85%', delay: '3.8s' },
    { emoji: '🥳', top: '12%', left: '22%', delay: '0.2s' },
    { emoji: '😎', top: '38%', left: '62%', delay: '2.1s' },
    { emoji: '🎨', top: '52%', left: '38%', delay: '1.1s' },
];

/* ─── SIDEBAR VIEWS ─── */
const SIDEBAR = { CHANNELS: 'channels', FRIENDS: 'friends', DMS: 'dms' };
/* ─── CHAT VIEWS ─── */
const CHAT = { GROUP: 'group', DM: 'dm' };

export function ChillZone() {
    const { user } = useAuth();

    /* ─── sidebar / view state ─── */
    const [sidebarView, setSidebarView] = useState(SIDEBAR.CHANNELS);
    const [chatView, setChatView] = useState(CHAT.GROUP);
    const [activeChannel, setActiveChannel] = useState('general');

    /* ─── group messages ─── */
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    /* ─── dm state ─── */
    const [dmPartner, setDmPartner] = useState(null); // { id, name, avatar }
    const [dmMessages, setDmMessages] = useState([]);
    const [dmInput, setDmInput] = useState('');
    const [dmLoading, setDmLoading] = useState(false);
    const [dmSending, setDmSending] = useState(false);

    /* ─── friends state ─── */
    const [allUsers, setAllUsers] = useState([]);
    const [friends, setFriends] = useState([]);          // accepted friend IDs
    const [friendProfiles, setFriendProfiles] = useState([]); // full profile objects for friends
    const [sentReqs, setSentReqs] = useState([]);        // pending request receiver IDs I sent
    const [incomingReqs, setIncomingReqs] = useState([]); // { id, requester_id, name } incoming pending
    const [friendSearch, setFriendSearch] = useState('');
    const [friendsLoading, setFriendsLoading] = useState(false);
    const [dmConversations, setDmConversations] = useState([]); // sidebar DM list

    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const dmEndRef = useRef(null);

    const scrollToBottom = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth' });

    /* ════════════════════════════════════════
       GROUP CHAT
    ════════════════════════════════════════ */
    useEffect(() => {
        fetchMessages();
        const ch = supabase
            .channel(`room-${activeChannel}`)
            .on('postgres_changes', {
                event: 'INSERT', schema: 'public', table: 'messages',
                filter: `channel=eq.${activeChannel}`
            }, (payload) => {
                setMessages(prev => [...prev, payload.new]);
                setTimeout(() => scrollToBottom(messagesEndRef), 50);
            })
            .subscribe();
        return () => supabase.removeChannel(ch);
    }, [activeChannel]);

    useEffect(() => { scrollToBottom(messagesEndRef); }, [messages]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('channel', activeChannel)
                .order('created_at', { ascending: true });
            if (!error) setMessages(data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || !user) return;
        setSending(true);
        const name = displayName(user);
        const msg = {
            sender_id: user.id,
            sender_name: name,
            text: inputValue,
            channel: activeChannel,
            avatar: '😎',
            created_at: new Date().toISOString()
        };
        const { error } = await supabase.from('messages').insert([msg]);
        if (!error) setInputValue('');
        setSending(false);
    };

    const handleMemeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !user) return;
        setSending(true);
        try {
            const ext = file.name.split('.').pop();
            const path = `memes/${Math.random()}.${ext}`;
            const { error: upErr } = await supabase.storage.from('materials').upload(path, file);
            if (upErr) throw upErr;
            const { data: { publicUrl } } = supabase.storage.from('materials').getPublicUrl(path);
            await supabase.from('messages').insert([{
                sender_id: user.id,
                sender_name: displayName(user),
                text: 'Sent a meme!',
                meme_url: publicUrl,
                channel: activeChannel,
                avatar: '🖼️',
                created_at: new Date().toISOString()
            }]);
        } catch (err) { alert('Upload failed: ' + err.message); }
        finally { setSending(false); }
    };

    /* ════════════════════════════════════════
       FRIENDS & USERS
    ════════════════════════════════════════ */
    useEffect(() => {
        if (sidebarView === SIDEBAR.FRIENDS) fetchFriendsData();
    }, [sidebarView]);

    useEffect(() => {
        fetchDmConversations();
        // Real-time: refresh when a friendship changes (new request or acceptance)
        if (!user) return;
        const ch = supabase
            .channel('friendships-realtime')
            .on('postgres_changes', {
                event: '*', schema: 'public', table: 'friendships'
            }, () => {
                fetchFriendsData();
                fetchDmConversations();
            })
            .subscribe();
        return () => supabase.removeChannel(ch);
    }, [user]);

    const fetchFriendsData = async () => {
        if (!user) return;
        setFriendsLoading(true);
        try {
            // Fetch all user profiles
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, username, full_name, avatar_url')
                .neq('id', user.id)
                .limit(100);

            // Fetch all friendships involving current user
            const { data: fships } = await supabase
                .from('friendships')
                .select('*')
                .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`);

            const allFships = fships || [];

            // Accepted friendships
            const accepted = allFships.filter(f => f.status === 'accepted');
            const acceptedIds = accepted.map(f =>
                f.requester_id === user.id ? f.receiver_id : f.requester_id
            );

            // Pending I sent
            const pending = allFships.filter(f => f.status === 'pending' && f.requester_id === user.id);
            const pendingIds = pending.map(f => f.receiver_id);

            // Incoming requests others sent to me
            const incoming = allFships.filter(f => f.status === 'pending' && f.receiver_id === user.id);
            const incomingWithNames = incoming.map(f => {
                const profile = (profiles || []).find(p => p.id === f.requester_id);
                return {
                    friendshipId: f.id,
                    requester_id: f.requester_id,
                    name: profile?.full_name || profile?.username || 'Unknown Student'
                };
            });

            // Friend profiles (accepted)
            const friendPros = (profiles || []).filter(p => acceptedIds.includes(p.id));

            setFriends(acceptedIds);
            setFriendProfiles(friendPros);
            setSentReqs(pendingIds);
            setIncomingReqs(incomingWithNames);
            setAllUsers(profiles || []);
        } catch (e) { console.error(e); }
        finally { setFriendsLoading(false); }
    };

    const sendFriendRequest = async (targetId) => {
        if (!user) return;
        const { error } = await supabase.from('friendships').insert([{
            requester_id: user.id,
            receiver_id: targetId,
            status: 'pending'
        }]);
        if (!error) setSentReqs(prev => [...prev, targetId]);
    };

    const acceptFriendRequest = async (friendshipId, requesterId, requesterName) => {
        await supabase
            .from('friendships')
            .update({ status: 'accepted' })
            .eq('id', friendshipId);
        // Refresh
        setIncomingReqs(prev => prev.filter(r => r.friendshipId !== friendshipId));
        setFriends(prev => [...prev, requesterId]);
        setFriendProfiles(prev => [...prev, { id: requesterId, full_name: requesterName }]);
    };

    const rejectFriendRequest = async (friendshipId) => {
        await supabase.from('friendships').delete().eq('id', friendshipId);
        setIncomingReqs(prev => prev.filter(r => r.friendshipId !== friendshipId));
    };

    /* ════════════════════════════════════════
       DIRECT MESSAGES
    ════════════════════════════════════════ */
    const fetchDmConversations = async () => {
        if (!user) return;
        try {
            const { data } = await supabase
                .from('direct_messages')
                .select('*')
                .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
                .order('created_at', { ascending: false });

            if (!data) return;
            // Get unique conversation partners
            const seen = new Set();
            const convos = [];
            for (const msg of data) {
                const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
                if (!seen.has(partnerId)) {
                    seen.add(partnerId);
                    convos.push({
                        partnerId,
                        partnerName: msg.sender_id === user.id ? msg.receiver_name : msg.sender_name,
                        lastMsg: msg.text,
                        lastTime: msg.created_at
                    });
                }
            }
            setDmConversations(convos);
        } catch (e) { console.error(e); }
    };

    const openDm = async (partner) => {
        setDmPartner(partner);
        setChatView(CHAT.DM);
        setSidebarView(SIDEBAR.DMS);
        setDmLoading(true);

        try {
            const { data } = await supabase
                .from('direct_messages')
                .select('*')
                .or(
                    `and(sender_id.eq.${user.id},receiver_id.eq.${partner.id}),and(sender_id.eq.${partner.id},receiver_id.eq.${user.id})`
                )
                .order('created_at', { ascending: true });
            setDmMessages(data || []);
        } catch (e) { console.error(e); }
        finally { setDmLoading(false); }

        setTimeout(() => scrollToBottom(dmEndRef), 100);

        // Real-time for DMs
        const ch = supabase
            .channel(`dm-${[user.id, partner.id].sort().join('-')}`)
            .on('postgres_changes', {
                event: 'INSERT', schema: 'public', table: 'direct_messages'
            }, (payload) => {
                const msg = payload.new;
                const relevant =
                    (msg.sender_id === user.id && msg.receiver_id === partner.id) ||
                    (msg.sender_id === partner.id && msg.receiver_id === user.id);
                if (relevant) {
                    setDmMessages(prev => [...prev, msg]);
                    fetchDmConversations();
                    setTimeout(() => scrollToBottom(dmEndRef), 50);
                }
            })
            .subscribe();

        return () => supabase.removeChannel(ch);
    };

    const sendDm = async (e) => {
        e.preventDefault();
        if (!dmInput.trim() || !dmPartner || !user) return;
        setDmSending(true);
        await supabase.from('direct_messages').insert([{
            sender_id: user.id,
            sender_name: displayName(user),
            receiver_id: dmPartner.id,
            receiver_name: dmPartner.name,
            text: dmInput,
            created_at: new Date().toISOString()
        }]);
        setDmInput('');
        setDmSending(false);
        fetchDmConversations();
    };

    /* ════════════════════════════════════════
       RENDER
    ════════════════════════════════════════ */
    const myName = displayName(user);
    const filteredUsers = allUsers.filter(u =>
        (u.full_name || u.username || '').toLowerCase().includes(friendSearch.toLowerCase())
    );

    return (
        <div className="h-screen bg-slate-950 text-white flex flex-col font-body overflow-hidden selection:bg-primary-500/30 relative">
            {/* Floating Emoji BG */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {floatingEmojis.map((item, i) => (
                    <div key={i} className="absolute text-4xl opacity-25 animate-float"
                        style={{ top: item.top, left: item.left, animationDelay: item.delay }}>
                        {item.emoji}
                    </div>
                ))}
            </div>

            {/* Ambient Glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-600/10 blur-[120px] rounded-full" />
            </div>

            <Navbar />

            <div className="flex flex-1 pt-16 h-full relative z-10 overflow-hidden">

                {/* ═══ SIDEBAR ═══ */}
                <div className="w-72 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 flex-col hidden md:flex overflow-hidden">

                    {/* Header */}
                    <div className="p-5 border-b border-white/5">
                        <h2 className="font-display font-black text-white text-lg flex items-center justify-between italic">
                            The Student Union 🎓
                            <MoreVertical size={16} className="text-slate-500 cursor-pointer" />
                        </h2>
                        <div className="flex items-center gap-2 mt-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">2.5k Students Vibing</p>
                        </div>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex gap-1 p-3 border-b border-white/5 bg-slate-950/30">
                        {[
                            { key: SIDEBAR.CHANNELS, label: '#', title: 'Rooms' },
                            {
                                key: SIDEBAR.FRIENDS,
                                label: (
                                    <span className="relative">
                                        <UserPlus size={14} />
                                        {incomingReqs.length > 0 && (
                                            <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] font-black flex items-center justify-center leading-none">
                                                {incomingReqs.length}
                                            </span>
                                        )}
                                    </span>
                                ),
                                title: 'Friends'
                            },
                            { key: SIDEBAR.DMS, label: <MessageCircle size={14} />, title: 'DMs' },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setSidebarView(tab.key)}
                                title={tab.title}
                                className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1 transition-all ${
                                    sidebarView === tab.key
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                                        : 'text-slate-500 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                {tab.label}
                                <span className="hidden sm:inline">{tab.title}</span>
                            </button>
                        ))}
                    </div>

                    {/* Sidebar Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">

                        {/* ── CHANNELS VIEW ── */}
                        {sidebarView === SIDEBAR.CHANNELS && (
                            <>
                                <div>
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 px-2">Rooms</h3>
                                    <nav className="space-y-1.5">
                                        {[
                                            { id: 'general',      label: 'general',        icon: '#' },
                                            { id: 'cram',         label: 'late-night-cram', icon: '#' },
                                            { id: 'help',         label: 'homework-help',  icon: '#' },
                                            { id: 'memes-only',   label: 'memes-only',     icon: '🔥' },
                                        ].map(ch => (
                                            <div
                                                key={ch.id}
                                                onClick={() => { setActiveChannel(ch.id); setChatView(CHAT.GROUP); }}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer text-sm font-bold transition-all ${
                                                    chatView === CHAT.GROUP && activeChannel === ch.id
                                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                                }`}
                                            >
                                                <span className="opacity-70 text-base">{ch.icon}</span> {ch.label}
                                            </div>
                                        ))}
                                    </nav>
                                </div>

                                {/* Friends Online in Chill Zone */}
                                {friendProfiles.length > 0 && (
                                    <div>
                                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 px-2">
                                            Your Squad ({friendProfiles.length})
                                        </h3>
                                        <nav className="space-y-3 px-2">
                                            {friendProfiles.map((fp) => {
                                                const name = fp.full_name || fp.username || 'Student';
                                                return (
                                                    <div
                                                        key={fp.id}
                                                        className="flex items-center gap-3 text-sm font-bold text-slate-300 group cursor-pointer hover:text-white transition-colors"
                                                        onClick={() => openDm({ id: fp.id, name, avatar: '🎓' })}
                                                    >
                                                        <div className="w-9 h-9 rounded-2xl bg-primary-500/15 flex items-center justify-center text-lg shadow-inner group-hover:bg-primary-500/30 transition-colors border border-white/5">
                                                            🎓
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="truncate">{name}</p>
                                                        </div>
                                                        <MessageCircle size={13} className="opacity-0 group-hover:opacity-60 transition-opacity shrink-0" />
                                                    </div>
                                                );
                                            })}
                                        </nav>
                                    </div>
                                )}
                            </>
                        )}

                        {/* ── FRIENDS VIEW ── */}
                        {sidebarView === SIDEBAR.FRIENDS && (
                            <div className="space-y-4">

                                {/* Incoming Requests */}
                                {incomingReqs.length > 0 && (
                                    <div>
                                        <h3 className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] mb-3 px-2 flex items-center gap-1.5">
                                            <Bell size={11} /> Requests ({incomingReqs.length})
                                        </h3>
                                        <div className="space-y-2">
                                            {incomingReqs.map(req => (
                                                <div key={req.friendshipId} className="flex items-center gap-3 p-3 rounded-2xl bg-primary-500/8 border border-primary-500/20">
                                                    <div className="w-10 h-10 rounded-2xl bg-primary-600/20 flex items-center justify-center text-lg shrink-0">
                                                        🎓
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-black text-white truncate">{req.name}</p>
                                                        <p className="text-[10px] text-primary-400 font-bold">Wants to connect</p>
                                                    </div>
                                                    <div className="flex gap-1.5">
                                                        <button
                                                            onClick={() => acceptFriendRequest(req.friendshipId, req.requester_id, req.name)}
                                                            className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                                                            title="Accept"
                                                        >
                                                            <Check size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => rejectFriendRequest(req.friendshipId)}
                                                            className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                                                            title="Decline"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t border-white/5 mt-4 mb-1" />
                                    </div>
                                )}

                                {/* Search */}
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        value={friendSearch}
                                        onChange={e => setFriendSearch(e.target.value)}
                                        placeholder="Search students..."
                                        className="w-full bg-slate-800/60 border border-white/8 rounded-xl pl-8 pr-3 py-2.5 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all"
                                    />
                                </div>

                                {friendsLoading ? (
                                    <div className="flex items-center justify-center py-10">
                                        <Loader2 size={24} className="animate-spin text-primary-500" />
                                    </div>
                                ) : filteredUsers.length === 0 ? (
                                    <div className="text-center py-10 text-slate-600 text-xs font-bold uppercase tracking-widest">
                                        No students found
                                    </div>
                                ) : (
                                    filteredUsers.map(u => {
                                        const isFriend = friends.includes(u.id);
                                        const isPending = sentReqs.includes(u.id);
                                        const name = u.full_name || u.username || 'Anon';
                                        return (
                                            <div key={u.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/3 border border-white/5 hover:bg-white/6 transition-all group">
                                                <div className="w-10 h-10 rounded-2xl bg-primary-600/20 flex items-center justify-center text-lg shrink-0">
                                                    🎓
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-black text-white truncate">{name}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">{u.username || u.id?.slice(0,8)}</p>
                                                </div>
                                                {isFriend ? (
                                                    <div className="flex gap-1.5">
                                                        <button
                                                            onClick={() => openDm({ id: u.id, name, avatar: '🎓' })}
                                                            className="p-1.5 rounded-lg bg-primary-600/20 text-primary-400 hover:bg-primary-600/40 transition-all"
                                                            title="Send DM"
                                                        >
                                                            <MessageCircle size={14} />
                                                        </button>
                                                        <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400" title="Friends">
                                                            <UserCheck size={14} />
                                                        </div>
                                                    </div>
                                                ) : isPending ? (
                                                    <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 text-[10px] font-black uppercase tracking-wide px-2">
                                                        Sent
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => sendFriendRequest(u.id)}
                                                        className="p-1.5 rounded-lg bg-primary-600/20 text-primary-400 hover:bg-primary-600 hover:text-white transition-all"
                                                        title="Add Friend"
                                                    >
                                                        <UserPlus size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}

                        {/* ── DMs VIEW ── */}
                        {sidebarView === SIDEBAR.DMS && (
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 px-2">Direct Messages</h3>

                                {/* Friends you can DM (accepted friends) */}
                                {friendProfiles.length > 0 && dmConversations.length === 0 && (
                                    <div>
                                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-2 px-1">Your Friends — Start a Chat</p>
                                        {friendProfiles.map(fp => {
                                            const name = fp.full_name || fp.username || 'Student';
                                            return (
                                                <div
                                                    key={fp.id}
                                                    onClick={() => openDm({ id: fp.id, name, avatar: '🎓' })}
                                                    className="flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer hover:bg-white/5 border border-transparent mb-1 transition-all group"
                                                >
                                                    <div className="w-9 h-9 rounded-2xl bg-primary-600/20 flex items-center justify-center text-base shrink-0">🎓</div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-black text-white truncate">{name}</p>
                                                        <p className="text-xs text-slate-600 font-medium">Tap to say hi 👋</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {dmConversations.length === 0 && friendProfiles.length === 0 ? (
                                    <div className="text-center py-10 text-slate-600 text-xs font-bold uppercase tracking-widest">
                                        No DMs yet.<br />
                                        <span className="text-slate-700 normal-case font-medium">Add friends to start chatting!</span>
                                    </div>
                                ) : (
                                    dmConversations.map((c, i) => (
                                        <div
                                            key={i}
                                            onClick={() => openDm({ id: c.partnerId, name: c.partnerName, avatar: '🎓' })}
                                            className={`flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer transition-all ${
                                                chatView === CHAT.DM && dmPartner?.id === c.partnerId
                                                    ? 'bg-primary-600/20 border border-primary-500/30'
                                                    : 'hover:bg-white/5 border border-transparent'
                                            }`}
                                        >
                                            <div className="w-9 h-9 rounded-2xl bg-primary-600/20 flex items-center justify-center text-base shrink-0">
                                                🎓
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-black text-white truncate">{c.partnerName}</p>
                                                <p className="text-xs text-slate-500 font-medium truncate">{c.lastMsg}</p>
                                            </div>
                                            <span className="text-[9px] text-slate-600 font-bold shrink-0">{timeStr(c.lastTime)}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ═══ MAIN CHAT AREA ═══ */}
                <div className="flex-1 flex flex-col bg-slate-950/20 min-w-0">

                    {/* ── GROUP CHAT ── */}
                    {chatView === CHAT.GROUP && (
                        <>
                            {/* Channel Header */}
                            <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-slate-950/40 backdrop-blur-md shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary-500/10 rounded-lg">
                                        <Hash size={18} className="text-primary-400" />
                                    </div>
                                    <span className="font-display font-black text-white text-xl italic">{activeChannel}</span>
                                    <div className="h-4 w-px bg-white/10 mx-2 hidden sm:block" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest hidden md:inline-block">
                                        Quantum Real-time Active
                                    </span>
                                </div>
                                <div className="hidden sm:flex items-center gap-2">
                                    {['🔥', '💀', '💯', '🙏'].map(e => (
                                        <button key={e} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-all hover:scale-125 text-lg">{e}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 no-scrollbar relative">
                                <div className="relative z-10 w-full">
                                    {loading ? (
                                        <div className="flex flex-col items-center justify-center text-slate-500 text-center py-32">
                                            <div className="relative mb-6">
                                                <Loader2 className="animate-spin text-primary-500" size={40} />
                                                <Sparkles className="absolute -top-2 -right-2 text-accent-400 animate-pulse" size={18} />
                                            </div>
                                            <p className="font-black uppercase tracking-[0.3em] text-xs">Syncing with Squad Matrix...</p>
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="text-center py-32 text-slate-600">
                                            <div className="text-5xl mb-4">💬</div>
                                            <p className="font-black uppercase tracking-widest text-xs">No messages yet. Be the first to vibe!</p>
                                        </div>
                                    ) : (
                                        messages.map((msg, i) => {
                                            if (!msg) return null;
                                            const isMe = user && msg.sender_id === user.id;
                                            const name = msg.sender_name || 'Anonymous';
                                            return (
                                                <div key={msg.id || i} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                                    <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center text-xl shrink-0 shadow-xl border border-white/5 self-end">
                                                        {msg.avatar || '👤'}
                                                    </div>
                                                    <div className={`max-w-[72%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                        <div className={`flex items-baseline gap-2 mb-1.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                                                            <span className="font-display font-black text-white text-sm">{isMe ? 'You' : name}</span>
                                                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">{timeStr(msg.created_at)}</span>
                                                        </div>
                                                        <div className={`px-5 py-3.5 rounded-[1.6rem] text-sm font-bold leading-relaxed shadow-xl ${isMe ? 'bg-primary-600 text-white rounded-br-none' : 'bg-slate-900/80 border border-white/5 text-slate-200 rounded-bl-none'}`}>
                                                            {msg.text}
                                                            {msg.meme_url && (
                                                                <div className="mt-3">
                                                                    <img src={msg.meme_url} alt="meme" className="rounded-2xl max-w-full border-4 border-white/5 shadow-xl" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>

                            {/* Input */}
                            <div className="p-5 md:p-6 bg-slate-950/50 backdrop-blur-xl border-t border-white/5 shrink-0">
                                <form onSubmit={handleSend} className="relative max-w-5xl mx-auto flex gap-3">
                                    <input type="file" ref={fileInputRef} onChange={handleMemeUpload} className="hidden" accept="image/*" />
                                    <button type="button" onClick={() => fileInputRef.current?.click()}
                                        className="p-3.5 bg-white/5 text-slate-400 rounded-2xl hover:bg-white/10 hover:text-white transition-all border border-white/5 shrink-0">
                                        <ImageIcon size={20} />
                                    </button>
                                    <div className="flex-1 relative">
                                        <input
                                            value={inputValue}
                                            onChange={e => setInputValue(e.target.value)}
                                            className="w-full bg-slate-900/60 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-bold placeholder:text-slate-600 shadow-inner text-sm"
                                            placeholder={`Keep it real in #${activeChannel}...`}
                                            disabled={sending}
                                        />
                                        <button type="submit" disabled={sending}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-500 transition-all disabled:opacity-50 shadow-lg active:scale-95">
                                            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </>
                    )}

                    {/* ── DM CHAT ── */}
                    {chatView === CHAT.DM && dmPartner && (
                        <>
                            {/* DM Header */}
                            <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-slate-950/40 backdrop-blur-md shrink-0">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => { setChatView(CHAT.GROUP); setDmPartner(null); }}
                                        className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                                    >
                                        <ArrowLeft size={18} />
                                    </button>
                                    <div className="w-9 h-9 rounded-2xl bg-primary-600/30 flex items-center justify-center text-lg border border-primary-500/20">
                                        🎓
                                    </div>
                                    <div>
                                        <span className="font-display font-black text-white text-base">{dmPartner.name}</span>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Direct Message</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest hidden md:block">🔒 Private Chat</div>
                            </div>

                            {/* DM Messages */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-5 no-scrollbar">
                                {dmLoading ? (
                                    <div className="flex items-center justify-center py-32">
                                        <Loader2 size={32} className="animate-spin text-primary-500" />
                                    </div>
                                ) : dmMessages.length === 0 ? (
                                    <div className="text-center py-32 text-slate-600">
                                        <div className="text-5xl mb-4">👋</div>
                                        <p className="font-black uppercase tracking-widest text-xs">You're now connected!</p>
                                        <p className="text-slate-700 text-sm mt-2 font-medium">Say hi to {dmPartner.name} 👇</p>
                                    </div>
                                ) : (
                                    dmMessages.map((msg, i) => {
                                        const isMe = msg.sender_id === user.id;
                                        return (
                                            <div key={msg.id || i} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                                <div className="w-9 h-9 rounded-2xl bg-slate-800 flex items-center justify-center text-lg shrink-0 border border-white/5 self-end">
                                                    {isMe ? '😎' : '🎓'}
                                                </div>
                                                <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                    <div className={`flex items-baseline gap-2 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                                                        <span className="font-display font-black text-white text-sm">{isMe ? 'You' : msg.sender_name}</span>
                                                        <span className="text-[9px] text-slate-600">{timeStr(msg.created_at)}</span>
                                                    </div>
                                                    <div className={`px-4 py-3 rounded-[1.4rem] text-sm font-bold leading-relaxed shadow-lg ${isMe ? 'bg-primary-600 text-white rounded-br-sm' : 'bg-slate-800/90 border border-white/8 text-slate-200 rounded-bl-sm'}`}>
                                                        {msg.text}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={dmEndRef} />
                            </div>

                            {/* DM Input */}
                            <div className="p-5 md:p-6 bg-slate-950/50 backdrop-blur-xl border-t border-white/5 shrink-0">
                                <form onSubmit={sendDm} className="relative max-w-5xl mx-auto">
                                    <input
                                        value={dmInput}
                                        onChange={e => setDmInput(e.target.value)}
                                        className="w-full bg-slate-900/60 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-bold placeholder:text-slate-600 shadow-inner text-sm"
                                        placeholder={`Message ${dmPartner.name}...`}
                                        disabled={dmSending}
                                    />
                                    <button type="submit" disabled={dmSending}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-500 transition-all disabled:opacity-50 shadow-lg active:scale-95">
                                        {dmSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
