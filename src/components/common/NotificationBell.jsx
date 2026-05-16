import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, X, Check, MessageCircle, UserPlus, UserCheck, Trash2, CheckCheck } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';

/* ─── icon + colours per notification type ─── */
const TYPE_META = {
    friend_request: {
        icon: <UserPlus size={15} />,
        bg: 'bg-primary-500/15',
        text: 'text-primary-400',
        border: 'border-primary-500/20',
        label: 'Connection Request',
    },
    accepted: {
        icon: <UserCheck size={15} />,
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-400',
        border: 'border-emerald-500/20',
        label: 'Request Accepted',
    },
    message: {
        icon: <MessageCircle size={15} />,
        bg: 'bg-accent-500/15',
        text: 'text-accent-400',
        border: 'border-accent-500/20',
        label: 'New Message',
    },
};

const timeAgo = (ts) => {
    if (!ts) return '';
    const diff = Date.now() - new Date(ts).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
};

export function NotificationBell({ isDarkPage }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { notifications, unreadCount, loading, markAllRead, markRead, dismiss } = useNotifications();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    /* close on outside click */
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    /* mark all read when panel opens */
    const handleOpen = () => {
        setOpen(prev => !prev);
        if (!open && unreadCount > 0) {
            setTimeout(markAllRead, 1500); // slight delay so badge still shows briefly
        }
    };

    /* accept friend request right from the notification */
    const handleAccept = async (notif) => {
        if (!notif.reference_id) return;
        await supabase
            .from('friendships')
            .update({ status: 'accepted' })
            .eq('id', notif.reference_id);

        // insert accepted notification for the requester
        await supabase.from('notifications').insert([{
            user_id: notif.sender_id,
            type: 'accepted',
            sender_id: user.id,
            sender_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Someone',
            message: `${user.user_metadata?.full_name || 'Someone'} accepted your connection request!`,
            is_read: false,
            created_at: new Date().toISOString(),
        }]);

        dismiss(notif.id);
    };

    const handleReject = async (notif) => {
        if (notif.reference_id) {
            await supabase.from('friendships').delete().eq('id', notif.reference_id);
        }
        dismiss(notif.id);
    };

    const iconColor = isDarkPage ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900';

    return (
        <div className="relative" ref={dropdownRef}>

            {/* ── Bell Button ── */}
            <button
                onClick={handleOpen}
                className={`relative p-2 rounded-xl transition-all ${iconColor} ${open ? (isDarkPage ? 'bg-white/10' : 'bg-slate-100') : 'hover:bg-white/5'}`}
                title="Notifications"
                aria-label="Notifications"
            >
                <Bell size={20} className={unreadCount > 0 ? 'animate-[wiggle_0.5s_ease-in-out]' : ''} />

                {/* Red badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-lg shadow-red-900/40 animate-in zoom-in duration-200">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* ── Dropdown Panel ── */}
            {open && (
                <div className="absolute right-0 md:right-0 top-14 w-[calc(100vw-2rem)] sm:w-[380px] bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-4 duration-300 ring-1 ring-white/5">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-primary-500/20 flex items-center justify-center">
                                <Bell size={16} className="text-primary-400" />
                            </div>
                            <div>
                                <span className="font-display font-black text-white text-sm block">Notifications</span>
                                {unreadCount > 0 && (
                                    <span className="text-[9px] font-black text-primary-400 uppercase tracking-widest animate-pulse">
                                        {unreadCount} UNREAD
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {notifications.length > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-[9px] font-black text-slate-500 hover:text-primary-400 transition-colors flex items-center gap-1.5 uppercase tracking-widest bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5"
                                    title="Mark all as read"
                                >
                                    <CheckCheck size={12} /> All read
                                </button>
                            )}
                            <button
                                onClick={() => setOpen(false)}
                                className="p-2 rounded-xl text-slate-600 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-16 px-8">
                                <div className="text-5xl mb-4 grayscale opacity-50">🔔</div>
                                <p className="text-white font-black text-sm uppercase tracking-widest">Quiet Zone</p>
                                <p className="text-slate-600 text-[10px] font-bold mt-2 leading-relaxed">No new alerts. Connect with more students to see activity here!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/[0.05]">
                                {notifications.map((notif) => {
                                    const meta = TYPE_META[notif.type] || TYPE_META.message;
                                    const isFriendReq = notif.type === 'friend_request';

                                    return (
                                        <div
                                            key={notif.id}
                                            className={`relative flex gap-4 px-6 py-5 transition-all ${!notif.is_read ? 'bg-primary-500/[0.04]' : 'hover:bg-white/[0.02]'}`}
                                        >
                                            {!notif.is_read && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" />
                                            )}

                                            {/* Type Icon */}
                                            <div className={`w-10 h-10 rounded-2xl ${meta.bg} ${meta.text} ${meta.border} border flex items-center justify-center shrink-0 mt-0.5 shadow-sm`}>
                                                {meta.icon}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${meta.text}`}>
                                                                {meta.label}
                                                            </p>
                                                            <span className="w-1 h-1 rounded-full bg-slate-800" />
                                                            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">
                                                                {timeAgo(notif.created_at)}
                                                            </p>
                                                        </div>
                                                        <p className="text-[13px] font-bold text-slate-200 leading-snug">
                                                            {notif.message}
                                                        </p>
                                                    </div>
                                                    
                                                    <button
                                                        onClick={() => dismiss(notif.id)}
                                                        className="p-1.5 rounded-lg text-slate-700 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0 active:scale-90"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>

                                                {/* ── Actionable Buttons ── */}
                                                {isFriendReq && (
                                                    <div className="flex gap-2 mt-4">
                                                        <button
                                                            onClick={() => handleAccept(notif)}
                                                            className="flex-1 flex items-center justify-center gap-1.5 text-[10px] font-black text-white bg-primary-600 hover:bg-primary-500 rounded-xl py-2.5 transition-all active:scale-95 shadow-lg shadow-primary-950/20 uppercase tracking-widest"
                                                        >
                                                            <Check size={12} /> Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(notif)}
                                                            className="flex-1 flex items-center justify-center gap-1.5 text-[10px] font-black text-slate-400 bg-white/5 hover:bg-white/10 rounded-xl py-2.5 transition-all border border-white/5 uppercase tracking-widest"
                                                        >
                                                            <X size={12} /> Decline
                                                        </button>
                                                    </div>
                                                )}

                                                {notif.type === 'message' && (
                                                    <Link to="/community" onClick={() => { setOpen(false); markRead(notif.id); }} className="block mt-4">
                                                        <button className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-accent-400 bg-accent-500/10 hover:bg-accent-500/20 rounded-xl py-2.5 transition-all border border-accent-500/20 uppercase tracking-widest">
                                                            <MessageCircle size={12} /> Open Chat
                                                        </button>
                                                    </Link>
                                                )}

                                                {notif.type === 'accepted' && (
                                                    <Link to="/community" onClick={() => { setOpen(false); markRead(notif.id); }} className="block mt-4">
                                                        <button className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl py-2.5 transition-all border border-emerald-500/20 uppercase tracking-widest">
                                                            <MessageCircle size={12} /> Send DM
                                                        </button>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">
                            Syncing Live
                        </p>
                        <Link to="/community" onClick={() => setOpen(false)} className="text-[9px] font-black text-primary-400 hover:text-primary-300 uppercase tracking-widest hover:underline">
                            Community Updates →
                        </Link>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes wiggle {
                    0%, 100% { transform: rotate(0deg); }
                    20% { transform: rotate(-15deg); }
                    60% { transform: rotate(15deg); }
                }
            `}</style>
        </div>
    );
}
