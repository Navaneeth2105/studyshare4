import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Send, Hash, Users, MoreVertical, Phone, Video, Search, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

export function ChillZone() {
    const { user } = useAuth();
    const [activeChannel, setActiveChannel] = useState('general');
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    const floatingEmojis = [
        // Current set
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
        // New set 1
        { emoji: '🚀', top: '5%', left: '30%', delay: '1s' },
        { emoji: '💎', top: '45%', left: '75%', delay: '2.5s' },
        { emoji: '🌈', top: '80%', left: '10%', delay: '4.5s' },
        { emoji: '🍔', top: '20%', left: '55%', delay: '1.8s' },
        { emoji: '🎸', top: '65%', left: '25%', delay: '3.2s' },
        { emoji: '🌟', top: '90%', left: '70%', delay: '0.5s' },
        { emoji: '🍦', top: '15%', left: '92%', delay: '2.8s' },
        { emoji: '🏀', top: '55%', left: '12%', delay: '4s' },
        { emoji: '🍿', top: '30%', left: '45%', delay: '1.3s' },
        { emoji: '⚡', top: '70%', left: '85%', delay: '3.8s' },
        // New set 2
        { emoji: '🥳', top: '12%', left: '22%', delay: '0.2s' },
        { emoji: '😎', top: '38%', left: '62%', delay: '2.1s' },
        { emoji: '👽', top: '72%', left: '33%', delay: '4.3s' },
        { emoji: '🍣', top: '58%', left: '5%', delay: '1.6s' },
        { emoji: '🧉', top: '28%', left: '78%', delay: '3.4s' },
        { emoji: '🛸', top: '95%', left: '18%', delay: '0.9s' },
        { emoji: '🧿', top: '42%', left: '95%', delay: '2.3s' },
        { emoji: '🪩', top: '8%', left: '48%', delay: '4.7s' },
        { emoji: '🎨', top: '52%', left: '38%', delay: '1.1s' },
        { emoji: '🧿', top: '88%', left: '58%', delay: '3.5s' },
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchMessages();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('realtime messages')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `channel=eq.${activeChannel}`
            }, (payload) => {
                setMessages((prev) => [...prev, payload.new]);
                scrollToBottom();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [activeChannel]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('channel', activeChannel)
                .order('created_at', { ascending: true });

            if (!error) {
                processChatMessages(data || []);
            } else {
                console.error('Messages fetch error:', error);
                processChatMessages([]);
            }
        } catch (err) {
            console.error('Fatal fetch error:', err);
            processChatMessages([]);
        } finally {
            setLoading(false);
        }
    };

    const processChatMessages = (realMessages = []) => {
        const messagesToSet = realMessages || [];
        if (messagesToSet.length === 0 && activeChannel === 'memes-only') {
            const studentMemes = [
                { id: 'm1', sender_name: 'System', text: 'When the exam is in 5 minutes and you haven\'t started chapter 1', meme_url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJieHpwd3R6Y3N5Zmt6bnZ5YmY4bW93ZzN5amV5eTV5eXp6Z3h6dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/HUKnMRAWpMv6/giphy.gif', created_at: new Date().toISOString(), avatar: '🎓' },
                { id: 'm2', sender_name: 'System', text: 'My brain during the finals vs my brain at 3AM', meme_url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJieHpwd3R6Y3N5Zmt6bnZ5YmY4bW93ZzN5amV5eTV5eXp6Z3h6dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LAKIIRqtM1dqE/giphy.gif', created_at: new Date().toISOString(), avatar: '🧠' }
            ];
            setMessages(studentMemes);
        } else {
            setMessages(messagesToSet);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || !user) return;

        setSending(true);
        const newMessage = {
            sender_id: user.id,
            sender_name: user.user_metadata?.username || user.email.split('@')[0],
            text: inputValue,
            channel: activeChannel,
            avatar: '😎',
            created_at: new Date().toISOString()
        };

        const { error } = await supabase.from('messages').insert([newMessage]);

        if (error) {
            console.error('Error sending message:', error);
            // Fallback for demo if table doesn't have these columns
            if (error.message.includes('column') || error.message.includes('relation')) {
                alert("The 'messages' table needs to be set up in Supabase with columns: sender_id, sender_name, text, channel, avatar, meme_url");
            }
        } else {
            setInputValue('');
        }
        setSending(false);
    };

    const handleMemeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !user) return;

        setSending(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `memes/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('materials')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('materials')
                .getPublicUrl(filePath);

            const newMessage = {
                sender_id: user.id,
                sender_name: user.user_metadata?.username || user.email.split('@')[0],
                text: 'Sent a meme!',
                meme_url: publicUrl,
                channel: activeChannel,
                avatar: '🖼️',
                created_at: new Date().toISOString()
            };

            await supabase.from('messages').insert([newMessage]);
        } catch (error) {
            alert('Meme blast failed: ' + error.message);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="h-screen bg-slate-950 text-white flex flex-col font-body overflow-hidden selection:bg-primary-500/30 relative">
            {/* Motion Emojis Background */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {floatingEmojis.map((item, i) => (
                    <div
                        key={i}
                        className="absolute text-4xl opacity-25 animate-float"
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

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-600/10 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-600/10 blur-[120px] rounded-full"></div>
            </div>

            <Navbar />

            <div className="flex flex-1 pt-16 h-full relative z-10">
                {/* Sidebar - Squads & Channels */}
                <div className="w-72 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 flex-col hidden md:flex">
                    <div className="p-6 border-b border-white/5">
                        <h2 className="font-display font-black text-white text-xl flex items-center justify-between italic">
                            The Student Union 🎓
                            <MoreVertical size={16} className="text-slate-500 cursor-pointer" />
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
                            <p className="text-[10px] text-primary-400 font-black uppercase tracking-widest">2.5k Students Vibing</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-8">
                        <div>
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-2">Rooms</h3>
                            <nav className="space-y-2">
                                {[
                                    { id: 'general', label: 'general', icon: <Hash size={16} /> },
                                    { id: 'cram', label: 'late-night-cram', icon: <Hash size={16} /> },
                                    { id: 'help', label: 'homework-help', icon: <Hash size={16} /> },
                                    { id: 'memes-only', label: 'memes-only', icon: <span>🔥</span> },
                                ].map(channel => (
                                    <div
                                        key={channel.id}
                                        onClick={() => setActiveChannel(channel.id)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer text-sm font-bold transition-all ${activeChannel === channel.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        <span className="opacity-70">{channel.icon}</span> {channel.label}
                                    </div>
                                ))}
                            </nav>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-2">Top Contributers</h3>
                            <nav className="space-y-4 px-2">
                                {[
                                    { name: 'Brad (GPA Savior)', avatar: '🤓' },
                                    { name: 'Sarah (Main Character)', avatar: '👩‍🎓' },
                                    { name: 'Mike (Vibe Check)', avatar: '🧢' },
                                ].map((u, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-300 group cursor-default">
                                        <div className="w-9 h-9 rounded-2xl bg-white/5 flex items-center justify-center text-lg shadow-inner group-hover:bg-primary-500/20 transition-colors border border-white/5">{u.avatar}</div>
                                        {u.name}
                                    </div>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-slate-950/20">
                    <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-slate-950/40 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary-500/10 rounded-lg">
                                <Hash size={20} className="text-primary-400" />
                            </div>
                            <span className="font-display font-black text-white text-xl italic">{activeChannel}</span>
                            <div className="h-4 w-px bg-white/10 mx-2 hidden sm:block" />
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest hidden md:inline-block">Quantum Real-time Active</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-6">
                            <div className="flex gap-2">
                                {['🔥', '💀', '💯', '🙏'].map(e => (
                                    <button key={e} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-all hover:scale-125 text-lg">
                                        {e}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 no-scrollbar relative">
                        {/* Legend Background - Transparent Overlay */}
                        <div
                            className="absolute inset-0 z-0 opacity-[0.1] pointer-events-none bg-center bg-fixed bg-no-repeat bg-cover"
                            style={{ backgroundImage: `url('/chat-bg.jpg')` }}
                        />

                        <div className="relative z-10 w-full">
                            {loading ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center py-40">
                                    <div className="relative mb-6">
                                        <Loader2 className="animate-spin text-primary-500" size={48} />
                                        <Sparkles className="absolute -top-2 -right-2 text-accent-400 animate-pulse" size={20} />
                                    </div>
                                    <p className="font-black uppercase tracking-[0.3em] text-xs">Syncing with Squad Matrix...</p>
                                </div>
                            ) : (
                                Array.isArray(messages) && messages.map((msg, i) => {
                                    if (!msg) return null;
                                    const isMe = user && msg.sender_id === user.id;
                                    const timeStr = msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'recently';

                                    return (
                                        <div key={msg.id || i} className={`flex gap-5 ${isMe ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                            <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center text-2xl shrink-0 shadow-xl border border-white/5 self-end">
                                                {msg.avatar || '👤'}
                                            </div>
                                            <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                                <div className={`flex items-baseline gap-3 mb-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                                                    <span className="font-display font-black text-white text-sm tracking-wide">{msg.sender_name || 'Anonymous'}</span>
                                                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">{timeStr}</span>
                                                </div>
                                                <div className={`px-5 py-4 rounded-[1.8rem] text-sm font-bold leading-relaxed shadow-2xl transition-all hover:shadow-primary-500/5 ${isMe ? 'bg-primary-600 text-white rounded-br-none' : 'bg-slate-900/80 border border-white/5 text-slate-200 rounded-bl-none'}`}>
                                                    {msg.text}
                                                    {msg.meme_url && (
                                                        <div className="mt-4 group relative">
                                                            <img src={msg.meme_url} alt="meme" className="rounded-2xl max-w-full border-4 border-white/5 shadow-2xl transition-transform group-hover:scale-[1.02]" />
                                                            <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
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

                    <div className="p-6 md:p-8 bg-slate-950/40 backdrop-blur-xl border-t border-white/5">
                        <form onSubmit={handleSend} className="relative max-w-5xl mx-auto flex gap-4">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleMemeUpload}
                                className="hidden"
                                accent="image/*"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-4 bg-white/5 text-slate-400 rounded-2xl hover:bg-white/10 hover:text-white transition-all shadow-inner border border-white/5"
                            >
                                <ImageIcon size={22} />
                            </button>
                            <div className="flex-1 relative group">
                                <input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4.5 pl-6 pr-14 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-bold placeholder:text-slate-600 shadow-inner"
                                    placeholder={activeChannel === 'memes-only' ? "Drop a 10/10 meme..." : `Keep it real in #${activeChannel}...`}
                                    disabled={sending}
                                />
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-500 transition-all disabled:opacity-50 shadow-lg shadow-primary-600/30 active:scale-95"
                                >
                                    {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
