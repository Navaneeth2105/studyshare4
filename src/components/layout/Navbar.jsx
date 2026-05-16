import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../common/Button';
import { NotificationBell } from '../common/NotificationBell';
import { useAuth } from '../../context/AuthContext';
import { Upload, LogIn } from 'lucide-react';

export function Navbar() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isDarkPage = location.pathname === '/dashboard'
        || location.pathname === '/community'
        || location.pathname.startsWith('/material/')
        || location.pathname === '/skills'
        || location.pathname === '/explore'
        || location.pathname.startsWith('/profile/');

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const navLinks = [
        { to: '/explore', label: 'Survival Kits' },
        { to: '/skills', label: 'Skills 🎯' },
        { to: '/community', label: 'Chill Zone' },
        ...(user ? [{ to: '/dashboard', label: 'Dashboard' }] : []),
    ];

    return (
        <nav className={`fixed w-full top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${isDarkPage
            ? 'bg-slate-950/70 border-white/10 text-white'
            : 'bg-white/90 border-slate-100 text-slate-900'}`}
        >
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                {/* ── Logo ── */}
                <Link to="/home" className="flex items-center gap-2 group cursor-pointer flex-shrink-0">
                    <img src="/src/assets/logo.svg" alt="StudyShare Logo" className="w-7 h-7 md:w-8 md:h-8 object-contain" />
                    <span className={`text-base md:text-xl font-display font-black tracking-tight group-hover:tracking-normal transition-all ${isDarkPage ? 'text-white' : 'text-primary-900'}`}>
                        Study<span className="hidden xs:inline">Share</span>
                    </span>
                </Link>

                {/* ── Desktop Nav Links (hidden on mobile) ── */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`font-bold transition-colors ${location.pathname === link.to
                                ? (isDarkPage ? 'text-white' : 'text-primary-600')
                                : (isDarkPage ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-primary-600')}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* ── Desktop Right Actions (hidden on mobile) ── */}
                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <>
                            <div className={`text-xs font-bold mr-1 truncate max-w-[140px] ${isDarkPage ? 'text-slate-400' : 'text-slate-500'}`}>
                                {user.email}
                            </div>
                            <NotificationBell isDarkPage={isDarkPage} />
                            <Link to="/upload">
                                <Button variant="primary" size="sm" className="flex gap-2 shadow-lg shadow-primary-500/20">
                                    <Upload size={16} /> Upload
                                </Button>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={handleSignOut} className={isDarkPage ? 'text-slate-300' : ''}>
                                🚪 Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/auth">
                                <Button variant="ghost" size="sm" className={isDarkPage ? 'text-white' : ''}>🚪 Log In</Button>
                            </Link>
                            <Link to="/auth?mode=signup">
                                <Button variant="primary" size="sm" className="shadow-lg shadow-primary-500/20">✨ Join the Cult</Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* ── Mobile Right: Notifications + Sign-in shortcut ── */}
                <div className="flex md:hidden items-center gap-2">
                    {user ? (
                        <NotificationBell isDarkPage={isDarkPage} />
                    ) : (
                        <Link to="/auth">
                            <button className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-black transition-colors ${isDarkPage
                                ? 'text-white bg-white/10 hover:bg-white/20'
                                : 'text-primary-600 bg-primary-50 hover:bg-primary-100'}`}>
                                <LogIn size={16} />
                                Login
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
