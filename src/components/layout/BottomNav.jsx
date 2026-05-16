import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Upload, MessageSquare, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function BottomNav() {
    const location = useLocation();
    const { user } = useAuth();

    if (!user) return null; // Don't show when not logged in

    const tabs = [
        { to: '/home', label: 'Home', icon: Home },
        { to: '/explore', label: 'Explore', icon: Compass },
        { to: '/upload', label: 'Upload', icon: Upload, isAction: true },
        { to: '/community', label: 'Chill', icon: MessageSquare },
        { to: '/dashboard', label: 'Profile', icon: LayoutDashboard },
    ];

    return (
        // Only visible on mobile (md:hidden)
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-safe">
            <div className="flex items-center justify-around px-2 h-16">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = location.pathname === tab.to
                        || (tab.to === '/home' && location.pathname === '/');

                    if (tab.isAction) {
                        // Center Upload button — elevated pill style
                        return (
                            <Link
                                key={tab.to}
                                to={tab.to}
                                id={`bottom-nav-${tab.label.toLowerCase()}`}
                                className="flex flex-col items-center -mt-5"
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 transition-transform active:scale-95 ${isActive ? 'bg-primary-700' : 'bg-primary-600'}`}>
                                    <Icon size={24} color="white" strokeWidth={2.5} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 mt-1">
                                    {tab.label}
                                </span>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={tab.to}
                            to={tab.to}
                            id={`bottom-nav-${tab.label.toLowerCase()}`}
                            className="flex flex-col items-center gap-1 py-1 px-3 min-w-[56px] rounded-xl transition-all active:scale-95"
                        >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isActive ? 'bg-primary-50' : 'bg-transparent'}`}>
                                <Icon
                                    size={20}
                                    strokeWidth={isActive ? 2.5 : 1.8}
                                    className={isActive ? 'text-primary-600' : 'text-slate-400'}
                                />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-wider transition-colors ${isActive ? 'text-primary-600' : 'text-slate-400'}`}>
                                {tab.label}
                            </span>
                            {/* Active dot indicator */}
                            {isActive && (
                                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary-600" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
