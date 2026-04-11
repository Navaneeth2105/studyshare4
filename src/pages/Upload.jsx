import React, { useState, useRef } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { UploadCloud, FileText, Tag, Loader2, School, AlignLeft } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function UploadPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        semester: '1st Sem',
        type: 'Notes',
        description: '',
        university: ''
    });

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            if (!formData.title) {
                setFormData(prev => ({ ...prev, title: selectedFile.name.split('.')[0] }));
            }
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please log in first!');
            return;
        }
        if (!file) {
            alert('Please select a file to upload!');
            return;
        }

        setLoading(true);
        try {
            // 1. Upload file to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError, data: uploadData } = await supabase.storage
                .from('materials') // Assuming a bucket named 'materials' exists
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('materials')
                .getPublicUrl(filePath);

            // 3. Save metadata to database
            const { error: dbError } = await supabase
                .from('materials')
                .insert([
                    {
                        ...formData,
                        file_url: publicUrl,
                        uploaded_by: user.id,
                        downloads: 0,
                        created_at: new Date()
                    }
                ]);

            if (dbError) throw dbError;

            alert('Material shared successfully! 🚀');
            navigate('/dashboard');
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error uploading: ' + (error.message || 'Check if "materials" bucket exists in Supabase storage.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-body">
            <Navbar />

            <main className="pt-32 pb-20 max-w-3xl mx-auto px-4">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-display font-black text-slate-900 mb-4">
                        📤 Drop Your Brain Files
                    </h1>
                    <p className="text-slate-500 text-lg font-medium">
                        Turn your messy notes into someone else's lifesaver.
                    </p>
                </div>

                <form onSubmit={handleUpload}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    <Card
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-8 md:p-12 mb-8 border-dashed border-4 transition-all cursor-pointer group rounded-[2rem] ${file ? 'border-primary-500 bg-primary-50/30' : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-primary-400'
                            }`}
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform text-4xl">
                                {file ? '✅' : '📂'}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                {file ? file.name : 'Click to select your file'}
                            </h3>
                            <p className="text-slate-400 font-medium">
                                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, DOCX, PPT, or images'}
                            </p>
                        </div>
                    </Card>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Document Title</label>
                            <Input
                                icon={FileText}
                                placeholder="e.g., The Ultimate Calculus Cheat Sheet"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Department / Subject</label>
                                <Input
                                    placeholder="e.g., Computer Science, Biology..."
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Current Semester</label>
                                <select
                                    className="w-full bg-white rounded-2xl border border-slate-200 py-3 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm font-bold"
                                    value={formData.semester}
                                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                >
                                    {['1st Sem', '2nd Sem', '3rd Sem', '4th Sem', '5th Sem', '6th Sem', '7th Sem', '8th Sem'].map(sem => (
                                        <option key={sem} value={sem}>{sem}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">University / College</label>
                                <Input
                                    icon={School}
                                    placeholder="e.g., MIT, Stanford..."
                                    value={formData.university}
                                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Material Type</label>
                                <select
                                    className="w-full bg-white rounded-2xl border border-slate-200 py-3 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm font-bold"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    {['Notes', 'Assignment', 'Exam Paper', 'Summary', 'Textbook'].map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Notes Bio / Description</label>
                            <Input
                                icon={AlignLeft}
                                placeholder="Explain what's in these notes... (e.g., Handwritten notes on thermodynamics)"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <Button variant="primary" size="lg" className="w-full" type="submit" disabled={loading}>
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Uploading to hyperspace...</span>
                                </div>
                            ) : '🚀 Share with the squad'}
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
}
