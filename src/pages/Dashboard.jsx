import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card, Badge } from '../components/common/Card';
import {
  FileText, Star, Loader2, User, School, Book, Calendar,
  TrendingUp, Download, CheckCircle2, MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [stats, setStats] = useState({ uploads: 0, downloads: 0, rating: 0 });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    university: '',
    degree: '',
    year: '1st Year'
  });

  useEffect(() => {
    if (user) {
      fetchUserMaterials();
      const meta = user?.user_metadata;
      setIsProfileModalOpen(!meta?.full_name || !meta?.university || !meta?.degree);
      setProfileData({
        full_name: meta?.full_name || '',
        university: meta?.university || '',
        degree: meta?.degree || '',
        year: meta?.year || '1st Year',
      });
    }
  }, [user]);

  const fetchUserMaterials = async () => {
    setDataLoading(true);
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('uploaded_by', user.id)
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setMaterials(data);
        const dl = data.reduce((a, c) => a + (c.downloads || 0), 0);
        const avg = data.length > 0 ? (data.reduce((a, c) => a + (c.rating || 0), 0) / data.length).toFixed(1) : 0;
        setStats({ uploads: data.length, downloads: dl, rating: avg });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDataLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ data: profileData });
      if (!error) {
        setIsProfileModalOpen(false);
        window.location.reload();
      } else {
        alert('Update failed: ' + error.message);
      }
    } catch {
      alert('Something went wrong.');
    } finally {
      setProfileLoading(false);
    }
  };

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.username || user?.email?.split('@')[0] || 'Student';
  const xpPct = Math.min(((stats.downloads * 15) / 5000) * 100, 100).toFixed(0);

  return (
    <div className="min-h-screen font-body bg-background text-slate-800 selection:bg-accent-light selection:text-accent-hover">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4 max-w-6xl mx-auto">
        {/* Welcome Section */}
        <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12 border-2 border-slate-100 shadow-sm bg-white rounded-[2.5rem] relative overflow-hidden group">
            <div className="relative z-10 w-full">
              <div className="flex items-center gap-3 mb-6">
                <Badge variant="blue" className="bg-primary-50 text-primary-600 border-primary-100 font-black uppercase tracking-widest">
                  Academic Profile
                </Badge>
                <Badge variant="yellow" className="bg-yellow-50 text-yellow-600 border-yellow-100 font-black uppercase tracking-widest">
                  {stats.downloads * 15} Karma
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 mb-4 tracking-tight">
                Welcome back, <br className="hidden md:block"/>
                <span className="text-primary-600">{displayName}</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium mb-8">
                Ready to degreemax? Here's your study command center.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  { icon: School, text: user?.user_metadata?.university || 'Set University' },
                  { icon: Book, text: user?.user_metadata?.degree || 'Set Degree' },
                  { icon: Calendar, text: user?.user_metadata?.year || 'Set Year' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 shadow-sm">
                    <item.icon size={16} className="text-primary-500" />
                    {item.text}
                  </div>
                ))}
              </div>
              
              <Button variant="outline" onClick={() => setIsProfileModalOpen(true)} className="rounded-2xl shadow-sm text-sm border-slate-200 hover:bg-slate-50">
                Edit Profile ⚙️
              </Button>
            </div>
            
            <div className="w-48 h-48 bg-primary-50 rounded-full flex items-center justify-center border-8 border-white shadow-xl flex-shrink-0 relative group-hover:scale-105 transition-transform duration-500">
              <div className="absolute inset-0 rounded-full border border-primary-100"></div>
              <span className="text-6xl animate-bounce-slight">🤓</span>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-lg border border-slate-100">
                📚
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {[
            { label: "Notes Uploaded", value: stats.uploads, icon: FileText, color: "text-blue-500", bg: "bg-blue-50", link: "/upload" },
            { label: "Study Karma", value: stats.downloads * 15, icon: Star, color: "text-yellow-500", bg: "bg-yellow-50" },
            { label: "Total Downloads", value: stats.downloads, icon: Download, color: "text-green-500", bg: "bg-green-50" },
            { label: "Average Rating", value: stats.rating || '—', icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-50" }
          ].map((stat, i) => {
            const inner = (
              <div className="p-6 h-full flex flex-col justify-center">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} />
                </div>
                <div className="text-3xl font-display font-black text-slate-900 mb-1 pointer-events-none">{stat.value}</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            );
            return stat.link ? (
              <Link to={stat.link} key={i} className="block group">
                <Card hover className="h-full !p-0 overflow-hidden">{inner}</Card>
              </Link>
            ) : (
              <Card key={i} hover className="h-full !p-0 overflow-hidden group">
                {inner}
              </Card>
            )
          })}
        </section>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area - My Vault */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-black text-slate-900 flex items-center gap-2">
                📂 My Vault
              </h2>
              <Link to="/upload">
                <Button variant="outline" size="sm" className="rounded-xl font-bold bg-white shadow-sm border-slate-200">
                  + Upload New
                </Button>
              </Link>
            </div>

            {dataLoading ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border-2 border-slate-100">
                <Loader2 className="animate-spin text-primary-500 mb-4" size={32} />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Your Notes...</p>
              </div>
            ) : materials.length > 0 ? (
              <div className="flex flex-col gap-4">
                {materials.map(item => (
                  <Link to={`/material/${item.id}`} key={item.id} className="block outline-none">
                    <Card hover className="p-5 flex items-center gap-5">
                      <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-primary-100 transition-colors">
                        {item.type?.toLowerCase().includes('pdf') ? '📄' : '📝'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-slate-900 text-lg mb-1 truncate group-hover:text-primary-600 transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                          <span className="truncate max-w-[120px]">{item.subject}</span>
                          <span className="flex items-center gap-1"><Download size={14}/> {item.downloads || 0}</span>
                        </div>
                      </div>
                      <div className="hidden sm:flex px-4 py-2 text-xs font-bold rounded-xl text-slate-600 bg-slate-50 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                        Manage
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card hover={false} className="text-center p-16 border-dashed border-2 bg-slate-50 overflow-hidden">
                <div className="text-5xl mb-6">🫙</div>
                <h3 className="text-xl font-display font-black text-slate-900 mb-3">Your vault is empty</h3>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">
                  Start uploading your study materials to help others and earn Karma points!
                </p>
                <Link to="/upload">
                  <Button variant="accent" className="shadow-lg shadow-accent-500/20">
                    Upload Your First Note
                  </Button>
                </Link>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            
            {/* Goals/Progression */}
            <Card className="p-6">
              <h3 className="text-lg font-display font-black text-slate-900 mb-6 flex items-center gap-2">
                🎯 Term Goals
              </h3>
              
              <div className="mb-6">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  <span>Level Progress</span>
                  <span className="text-primary-600">{xpPct}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-primary-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{ width: `${xpPct}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20"></div>
                  </div>
                </div>
                <div className="text-[10px] text-right text-slate-400 mt-2 font-black uppercase tracking-widest">
                  Next tier at 5,000 Karma
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Upload first document', done: stats.uploads > 0 },
                  { label: 'Get 10 total downloads', done: stats.downloads >= 10 },
                  { label: 'Complete profile setup', done: !!user?.user_metadata?.full_name },
                  { label: 'Reach 100 Karma points', done: stats.downloads * 15 >= 100 },
                ].map((task, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className={task.done ? "text-green-500" : "text-slate-200"} />
                    <span className={`text-sm font-bold ${task.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                      {task.label}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Community/Chill Zone CTA */}
            <Card className="p-6 border border-slate-100 shadow-sm bg-linear-to-br from-indigo-50 to-purple-50 hover:border-indigo-200 hover:shadow-lg hover:-translate-y-1 transition-all">
              <h3 className="text-lg font-display font-black text-slate-900 mb-3 flex items-center gap-2">
                <MessageSquare size={18} className="text-indigo-500" />
                Chill Zone
              </h3>
              <p className="text-sm font-medium text-slate-600 mb-6 italic">
                "Anyone having a mental breakdown over the compiler design project? 💀"
              </p>
              <Link to="/community">
                <Button variant="outline" className="w-full bg-white text-indigo-700 border-indigo-200 hover:bg-white hover:text-indigo-800 focus:ring-indigo-500/20 shadow-sm">
                  Join the Discussion
                </Button>
              </Link>
            </Card>

          </div>
        </div>
      </main>

      {/* Profile Setup Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 border border-slate-100">
            <div className="mb-8">
              <Badge variant="blue" className="mb-4 text-[10px] bg-primary-50 text-primary-600 border-none font-black uppercase tracking-widest">
                Setup Required
              </Badge>
              <h2 className="text-3xl font-display font-black text-slate-900 leading-tight mb-2">
                Complete Your Profile
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Let's get everything ready so you can start sharing notes and earning karma.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <Input 
                icon={User} 
                placeholder="Full Name"
                value={profileData.full_name}
                onChange={e => setProfileData({ ...profileData, full_name: e.target.value })}
                required 
              />
              <Input 
                icon={School} 
                placeholder="University Name"
                value={profileData.university}
                onChange={e => setProfileData({ ...profileData, university: e.target.value })}
                required 
              />
              <Input 
                icon={Book} 
                placeholder="Degree / Major (e.g. CS, ME)"
                value={profileData.degree}
                onChange={e => setProfileData({ ...profileData, degree: e.target.value })}
                required 
              />
              
              <div className="relative">
                <select
                  className="w-full pl-4 pr-10 py-3.5 bg-white border-2 border-slate-200 rounded-2xl text-slate-700 font-bold text-sm focus:outline-hidden focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none shadow-sm"
                  value={profileData.year}
                  onChange={e => setProfileData({ ...profileData, year: e.target.value })}
                >
                  {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduated'].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-xs">▼</div>
              </div>

              <Button 
                type="submit" 
                disabled={profileLoading} 
                variant="accent"
                className="w-full py-4 mt-6 shadow-lg shadow-accent-500/20"
              >
                {profileLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Save & Continue'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
