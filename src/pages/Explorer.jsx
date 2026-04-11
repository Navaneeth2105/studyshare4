import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Card, Badge } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Search, Filter, Loader2, Download, Sparkles, BookOpen, GraduationCap } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

export function Explorer() {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeType, setActiveType] = useState('All');

    useEffect(() => {
        fetchMaterials();
    }, [searchQuery, activeType]);

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

            if (activeType !== 'All' && !activeType.includes('🔥')) {
                // Ensure we use the 'type' column found in probe
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

    return (
        <div className="min-h-screen bg-slate-950 text-white font-body selection:bg-primary-500/30 overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary-600/10 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent-600/10 blur-[120px] rounded-full"></div>
            </div>

            <Navbar />

            <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 relative z-10">
                {/* Search Header */}
                <div className="glass-dark border-primary-500/20 rounded-[3rem] p-12 md:p-16 mb-12 relative overflow-hidden text-center">
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <Badge variant="blue" className="mb-6 bg-primary-500/20 text-primary-300 border-primary-500/30 font-black tracking-widest uppercase">
                            <Sparkles size={12} className="mr-1" /> Unlimited Knowledge
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-display font-black mb-8 leading-tight">
                            Find the <span className="text-gradient italic">cheat codes</span> <br />
                            to your degree.
                        </h1>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                <input
                                    placeholder="Search subjects, universities, or topics..."
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-bold placeholder:text-slate-600"
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
                <div className="flex gap-3 overflow-x-auto pb-6 mb-8 no-scrollbar scroll-smooth">
                    {['All', 'Notes', 'Assignment', 'Exam Paper', 'Summary'].map(type => (
                        <button
                            key={type}
                            onClick={() => setActiveType(type)}
                            className={`px-6 py-2.5 border rounded-2xl text-sm font-black whitespace-nowrap transition-all ${activeType === type
                                ? 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-600/20'
                                : 'bg-slate-900 border-white/5 text-slate-400 hover:border-primary-500/50 hover:text-white'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <Loader2 className="animate-spin text-primary-500 mb-4" size={48} />
                        <p className="text-sm font-black uppercase tracking-widest text-slate-500 animate-pulse">Scanning the matrix...</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {materials.length > 0 ? materials.map((item) => (
                            <Link to={`/material/${item.id}`} key={item.id} className="group">
                                <div className="glass p-1 rounded-[2.5rem] transition-all duration-500 group-hover:scale-[1.03] group-hover:bg-linear-to-br group-hover:from-primary-500/20 group-hover:to-accent-500/20 shadow-xl">
                                    <div className="bg-slate-900 rounded-[2.4rem] p-6 h-full flex flex-col">
                                        <div className="h-44 bg-slate-800 rounded-3xl mb-6 flex items-center justify-center text-5xl relative overflow-hidden group-hover:bg-slate-700 transition-colors">
                                            {item.type?.toLowerCase().includes('pdf') || item.title.toLowerCase().includes('pdf') ? '📝' : '📊'}
                                            <div className="absolute inset-0 bg-linear-to-t from-slate-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>

                                        <div className="flex-1">
                                            <Badge variant="blue" className="mb-4 bg-primary-500/10 text-primary-400 border-primary-500/20 uppercase tracking-widest text-[10px]">
                                                {item.type || 'Survival Kit'}
                                            </Badge>
                                            <h3 className="font-display font-black text-xl leading-tight mb-3 group-hover:text-primary-400 transition-colors line-clamp-2">
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mb-6">
                                                <GraduationCap size={14} className="text-slate-400" />
                                                <span className="truncate">{item.university || item.subject}</span>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-primary-400 text-sm font-black">
                                                <Download size={16} /> {item.downloads || 0}
                                            </div>
                                            <Button variant="ghost" size="sm" className="text-xs font-black uppercase tracking-widest hover:text-white">
                                                Peek →
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )) : (
                            <div className="col-span-full py-32 text-center glass-dark rounded-[3rem] border-dashed border-2 border-white/5">
                                <div className="text-6xl mb-6">🏜️</div>
                                <h3 className="text-2xl font-display font-black mb-2 italic">Matrix Empty.</h3>
                                <p className="text-slate-500 max-w-sm mx-auto font-medium">No survival kits found for this criteria. Be the academic weapon this campus needs.</p>
                                <Link to="/upload">
                                    <Button variant="primary" className="mt-8">Upload Original Notes</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
