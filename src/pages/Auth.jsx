import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Mail, Lock, User, Github, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export function Auth() {
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(location.state?.isSignUp ? false : true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                // Login logic
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/home');
            } else {
                // Signup logic
                const { error, data } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username: username,
                        },
                    },
                });
                if (error) throw error;
                
                // If "Confirm Email" is disabled in Supabase, the user is successfully logged in.
                // We can navigate them straight to the home page.
                navigate('/home');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMagicLink = async () => {
        if (!email) {
            setError('Please enter your email first!');
            return;
        }
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: window.location.origin + '/home',
                }
            });
            if (error) throw error;
            alert('Magic link sent! Check your inbox.');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: window.location.origin + '/home'
                }
            });
            if (error) throw error;
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen grid md:grid-cols-2">
            {/* Left: Form */}
            <div className="p-8 md:p-20 flex flex-col justify-center bg-white">
                <div className="max-w-md mx-auto w-full">
                    <Link to="/" className="inline-block mb-12">
                        <img src="/src/assets/logo.svg" alt="StudyShare Logo" className="w-12 h-12 object-contain" />
                    </Link>

                    <h1 className="text-4xl font-display font-black text-slate-900 mb-2">
                        {isLogin ? '🚪 Enter the Study Zone' : '✨ Join the Cult'}
                    </h1>
                    <p className="text-slate-500 mb-8 text-lg font-medium">
                        {isLogin ? 'Ready to lock in? Welcome back.' : 'Your grades will thank you later. No cap.'}
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-4 mb-8">
                        {!isLogin && (
                            <Input
                                icon={User}
                                placeholder="Username (make it cool)"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        )}
                        <Input
                            icon={Mail}
                            type="email"
                            placeholder="Student Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            icon={Lock}
                            type="password"
                            placeholder="Password (shhh)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Button
                            variant="primary"
                            className="w-full text-base"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                isLogin ? 'Let Me In →' : 'Create Account'
                            )}
                        </Button>

                        {isLogin && (
                            <button
                                type="button"
                                onClick={handleMagicLink}
                                className="w-full text-xs font-bold text-slate-400 hover:text-primary-600 transition-colors uppercase tracking-widest mt-4"
                            >
                                ✨ Send Magic Link instead
                            </button>
                        )}
                    </form>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-500 font-medium">Or slide in with</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleSocialLogin('github')}
                            type="button"
                        >
                            <Github size={18} /> Github
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleSocialLogin('google')}
                            type="button"
                        >
                            <span className="text-red-500 font-bold">G</span> Google
                        </Button>
                    </div>

                    <p className="text-center text-slate-500 font-medium">
                        {isLogin ? "New around here?" : "Already part of the squad?"}{' '}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-primary-600 font-bold hover:underline"
                            type="button"
                        >
                            {isLogin ? 'Join us' : 'Log in'}
                        </button>
                    </p>
                </div>
            </div>

            {/* Right: Illustration/Vibe */}
            <div className="hidden md:flex bg-primary-50 p-20 items-center justify-center relative overflow-hidden">
                <div className="relative z-10 max-w-lg text-center">
                    <div className="text-8xl mb-6 animate-bounce-slight">🧑‍🎓</div>
                    <h2 className="text-3xl font-display font-bold text-primary-900 mb-4">
                        "I studied for 3 days and got an A. StudyShare is a cheat code."
                    </h2>
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-10 h-10 bg-indigo-500 rounded-full overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-primary-900 text-sm">Alex from Engineering</p>
                            <p className="text-primary-600 text-xs font-bold">SAVED BY NOTES</p>
                        </div>
                    </div>
                </div>

                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
            </div>
        </div>
    );
}
