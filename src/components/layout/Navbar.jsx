import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../common/Button';
import { NotificationBell } from '../common/NotificationBell';
import { useAuth } from '../../context/AuthContext';
import { Upload } from 'lucide-react';

export function Navbar() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isDarkPage = location.pathname === '/dashboard' || location.pathname === '/community' || location.pathname.startsWith('/material/') || location.pathname === '/skills' || location.pathname === '/explore' || location.pathname.startsWith('/profile/');

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <nav className={`fixed w-full top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${isDarkPage ? 'bg-slate-950/60 border-white/10 text-white' : 'bg-white/80 border-slate-100 text-slate-900'}`}>
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/home" className="flex items-center gap-2 group cursor-pointer">
                    <img src="/src/assets/logo.svg" alt="StudyShare Logo" className="w-8 h-8 object-contain" />
                    <span className={`text-xl font-display font-black tracking-tight group-hover:tracking-normal transition-all ${isDarkPage ? 'text-white' : 'text-primary-900'}`}>
                        StudyShare
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    <Link to="/explore" className={`font-bold transition-colors ${isDarkPage ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-primary-600'}`}>Survival Kits</Link>
                    <Link to="/skills" className={`font-bold transition-colors ${isDarkPage ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-primary-600'}`}>Skills 🎯</Link>
                    <Link to="/community" className={`font-bold transition-colors ${isDarkPage ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-primary-600'}`}>Chill Zone</Link>
                    {user && <Link to="/dashboard" className={`font-bold transition-colors ${isDarkPage ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-primary-600'}`}>Dashboard</Link>}
                </div>

                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <div className={`hidden sm:block text-xs font-bold mr-1 ${isDarkPage ? 'text-slate-500' : 'text-slate-500'}`}>
                                {user.email}
                            </div>
                            {/* 🔔 Real-time Notification Bell */}
                            <NotificationBell isDarkPage={isDarkPage} />
                            <Link to="/upload">
                                <Button variant="primary" size="sm" className="hidden sm:flex gap-2 shadow-lg shadow-primary-500/20">
                                    <Upload size={16} /> Upload
                                </Button>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={handleSignOut} className={isDarkPage ? 'text-slate-300' : ''}>🚪 Out</Button>
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
            </div>
        </nav>
    );
}
