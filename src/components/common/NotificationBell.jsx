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
                <div className="absolute right-0 top-12 w-[380px] bg-slate-950 border border-white/10 rounded-[1.75rem] shadow-2xl shadow-black/40 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <Bell size={16} className="text-primary-400" />
                            <span className="font-display font-black text-white text-sm">Notifications</span>
                            {unreadCount > 0 && (
                                <span className="text-[10px] font-black text-white bg-red-500 rounded-full px-2 py-0.5">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {notifications.length > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-[10px] font-black text-slate-500 hover:text-primary-400 transition-colors flex items-center gap-1 uppercase tracking-widest"
                                    title="Mark all as read"
                                >
                                    <CheckCheck size={12} /> All read
                                </button>
                            )}
                            <button
                                onClick={() => setOpen(false)}
                                className="p-1 rounded-lg text-slate-600 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="max-h-[420px] overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-10">
                                <div className="w-5 h-5 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-12 px-6">
                                <div className="text-4xl mb-3">🔔</div>
                                <p className="text-slate-500 text-sm font-bold">You're all caught up!</p>
                                <p className="text-slate-700 text-xs mt-1">Connect with students to get notifications</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/[0.04]">
                                {notifications.map((notif) => {
                                    const meta = TYPE_META[notif.type] || TYPE_META.message;
                                    const isFriendReq = notif.type === 'friend_request';

                                    return (
                                        <div
                                            key={notif.id}
                                            className={`flex gap-3 px-4 py-3.5 transition-colors ${!notif.is_read ? 'bg-primary-500/[0.04]' : ''} hover:bg-white/[0.03]`}
                                        >
                                            {/* Type Icon */}
                                            <div className={`w-9 h-9 rounded-xl ${meta.bg} ${meta.text} ${meta.border} border flex items-center justify-center shrink-0 mt-0.5`}>
                                                {meta.icon}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${meta.text}`}>
                                                            {meta.label}
                                                        </p>
                                                        <p className="text-sm font-bold text-white leading-snug">
                                                            {notif.message}
                                                        </p>
                                                        <p className="text-[10px] text-slate-600 font-bold mt-1">
                                                            {timeAgo(notif.created_at)}
                                                        </p>
                                                    </div>
                                                    {/* Unread dot */}
                                                    <div className="flex items-center gap-1 shrink-0 mt-1">
                                                        {!notif.is_read && (
                                                            <div className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_6px_#6366f1]" />
                                                        )}
                                                        <button
                                                            onClick={() => dismiss(notif.id)}
                                                            className="p-1 rounded-lg text-slate-700 hover:text-red-400 hover:bg-white/5 transition-all"
                                                            title="Dismiss"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* ── Actionable Buttons ── */}
                                                {isFriendReq && (
                                                    <div className="flex gap-2 mt-2.5">
                                                        <button
                                                            onClick={() => handleAccept(notif)}
                                                            className="flex items-center gap-1.5 text-[11px] font-black text-white bg-primary-600 hover:bg-primary-500 rounded-xl px-3 py-1.5 transition-all active:scale-95"
                                                        >
                                                            <Check size={12} /> Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(notif)}
                                                            className="flex items-center gap-1.5 text-[11px] font-black text-slate-400 bg-white/5 hover:bg-red-500/15 hover:text-red-400 rounded-xl px-3 py-1.5 transition-all border border-white/5"
                                                        >
                                                            <X size={12} /> Decline
                                                        </button>
                                                    </div>
                                                )}

                                                {notif.type === 'message' && (
                                                    <Link to="/community" onClick={() => { setOpen(false); markRead(notif.id); }}>
                                                        <button className="flex items-center gap-1.5 text-[11px] font-black text-accent-400 bg-accent-500/10 hover:bg-accent-500/20 rounded-xl px-3 py-1.5 mt-2 transition-all border border-accent-500/20">
                                                            <MessageCircle size={12} /> Open Chat
                                                        </button>
                                                    </Link>
                                                )}

                                                {notif.type === 'accepted' && (
                                                    <Link to="/community" onClick={() => { setOpen(false); markRead(notif.id); }}>
                                                        <button className="flex items-center gap-1.5 text-[11px] font-black text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl px-3 py-1.5 mt-2 transition-all border border-emerald-500/20">
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
                    {notifications.length > 0 && (
                        <div className="px-5 py-3 border-t border-white/5 flex items-center justify-center">
                            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                                Notifications auto-clear after 30 days
                            </p>
                        </div>
                    )}
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
