import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

/**
 * Real-time notification hook.
 * Subscribes to INSERT events on the `notifications` table filtered
 * to the logged-in user, keeping the count and list in sync without
 * ever polling the server.
 */
export function useNotifications() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    /* ── fetch on mount ── */
    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(30);

            const list = data || [];
            setNotifications(list);
            setUnreadCount(list.filter(n => !n.is_read).length);
        } catch (e) {
            console.error('notifications fetch:', e);
        } finally {
            setLoading(false);
        }
    }, [user]);

    /* ── realtime subscription ── */
    useEffect(() => {
        if (!user) return;
        fetchNotifications();

        const channel = supabase
            .channel(`notifs-${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    setNotifications(prev => [payload.new, ...prev]);
                    setUnreadCount(prev => prev + 1);
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [user, fetchNotifications]);

    /* ── mark all as read ── */
    const markAllRead = useCallback(async () => {
        if (!user) return;
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('is_read', false);
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
    }, [user]);

    /* ── mark one as read ── */
    const markRead = useCallback(async (id) => {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    /* ── dismiss / delete one ── */
    const dismiss = useCallback(async (id) => {
        await supabase.from('notifications').delete().eq('id', id);
        setNotifications(prev => {
            const removed = prev.find(n => n.id === id);
            if (removed && !removed.is_read) setUnreadCount(c => Math.max(0, c - 1));
            return prev.filter(n => n.id !== id);
        });
    }, []);

    return { notifications, unreadCount, loading, markAllRead, markRead, dismiss, refresh: fetchNotifications };
}
