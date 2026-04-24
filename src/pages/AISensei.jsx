import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Card';
import { Sparkles, ArrowLeft, Send, Download, Loader2, FileText, Brain, AlertCircle, RefreshCw, UserPlus, UserCheck, MessageCircle } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import * as pdfjsLib from 'pdfjs-dist';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Configure PDF.js worker - Use a pinned version for stability
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

export function AISensei() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [material, setMaterial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [docText, setDocText] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [simulation, setSimulation] = useState(null);
    const [isScanning, setIsScanning] = useState(false);

    // ── Connect / Friend state ──
    // 'none' | 'pending' | 'incoming' | 'accepted'
    const [connectStatus, setConnectStatus] = useState('none');
    const [connectLoading, setConnectLoading] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [senderProfile, setSenderProfile] = useState(null);

    useEffect(() => {
        fetchMaterial();
    }, [id]);

    // Check friendship status + fetch sender profile once material is loaded
    useEffect(() => {
        if (material && user && material.uploaded_by && material.uploaded_by !== user.id) {
            checkFriendship(material.uploaded_by);
            fetchSenderProfile(material.uploaded_by);
        }
    }, [material, user]);

    const fetchSenderProfile = async (uploaderId) => {
        const { data: profile } = await supabase
            .from('profiles')
            .select('id, username, full_name')
            .eq('id', uploaderId)
            .maybeSingle();
        setSenderProfile({
            id: uploaderId,
            name: profile?.full_name || profile?.username || 'Unknown Student',
            username: profile?.username || '',
            university: material?.university || '—',
            subject: material?.subject || '—',
        });
    };

    const checkFriendship = async (uploaderId) => {
        if (!user) return;
        const { data } = await supabase
            .from('friendships')
            .select('status, requester_id')
            .or(
                `and(requester_id.eq.${user.id},receiver_id.eq.${uploaderId}),` +
                `and(requester_id.eq.${uploaderId},receiver_id.eq.${user.id})`
            )
            .maybeSingle();

        if (!data) { setConnectStatus('none'); return; }
        if (data.status === 'accepted') { setConnectStatus('accepted'); return; }
        if (data.status === 'pending') {
            setConnectStatus(data.requester_id === user.id ? 'pending' : 'incoming');
            return;
        }
        setConnectStatus('none');
    };

    const handleConnect = async () => {
        if (!user || !material?.uploaded_by) return;
        setConnectLoading(true);
        const { error } = await supabase.from('friendships').insert([{
            requester_id: user.id,
            receiver_id: material.uploaded_by,
            status: 'pending'
        }]);
        if (!error) {
            setConnectStatus('pending');
            setShowProfileModal(false);
        }
        setConnectLoading(false);
    };

    const extractTextFromPDF = async (url) => {
        try {
            setIsScanning(true);
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const arrayBuffer = await response.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({
                data: arrayBuffer,
                useSystemFonts: true,
                isEvalSupported: false
            });

            const pdf = await loadingTask.promise;
            let fullText = '';

            // Scan up to 15 pages for better context in Gemini 1.5 Flash
            const numPages = Math.min(pdf.numPages, 15);

            for (let i = 1; i <= numPages; i++) {
                try {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    fullText += `[Page ${i}]\n${pageText}\n\n`;
                } catch (pageErr) {
                    console.warn(`Error reading page ${i}:`, pageErr);
                }
            }
            return fullText.trim();
        } catch (error) {
            console.error('PDF extraction error:', error);
            return null;
        } finally {
            setIsScanning(false);
        }
    };

    const generateSimulation = async (text, metadata) => {
        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            if (!apiKey) return;

            const genAI = new GoogleGenerativeAI(apiKey, { apiVersion: "v1" });
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
                Analyze this study material and generate a "Simulation" or "Live Preview".
                Document Title: ${metadata.title}
                Subject: ${metadata.subject}
                
                Content:
                ${text ? text.substring(0, 20000) : "No text extracted. Use title and subject only."}
                
                Format the response as a JSON object with:
                {
                    "summary": "A 2-3 sentence high-level summary",
                    "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4"],
                    "difficulty": "Easy/Medium/Hard",
                    "estimatedStudyTime": "X mins",
                    "coreTopics": ["Topic 1", "Topic 2"]
                }
                ONLY return the JSON object, nothing else.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const simText = response.text();

            // Extract JSON from potential Markdown blocks
            const jsonStr = simText.replace(/```json|```/g, '').trim();
            setSimulation(JSON.parse(jsonStr));
        } catch (error) {
            console.error('Simulation error:', error);
            setSimulation({
                summary: "I couldn't generate a detailed simulation, but I'm ready to chat about the concepts!",
                keyPoints: ["Content extraction issues", "Likely " + metadata.subject + " related", "Ask me specific questions"],
                difficulty: "Medium",
                estimatedStudyTime: "15-30 mins",
                coreTopics: [metadata.subject]
            });
        }
    };

    const fetchMaterial = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('materials')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching material:', error);
            navigate('/explore');
        } else {
            setMaterial(data);
            setMessages([
                { role: 'ai', text: `Yo! I'm your AI Sensei. I'm scanning "${data.title}" right now... 🧠` }
            ]);

            if (data.file_url && data.file_url.toLowerCase().endsWith('.pdf')) {
                const text = await extractTextFromPDF(data.file_url);
                if (text && text.length > 50) {
                    setDocText(text);
                    setMessages(prev => [
                        ...prev,
                        { role: 'ai', text: `Scan complete! I've indexed the content. I've also generated a simulation of the document for you on the left! ⚡` }
                    ]);
                    generateSimulation(text, data);
                } else {
                    setMessages(prev => [
                        ...prev,
                        { role: 'ai', text: `I found the file, but I can't read the text inside (it might be handwritten or image-based). I'll use my general knowledge to help you with ${data.title}! 🧐` }
                    ]);
                    generateSimulation(null, data);
                }
            } else {
                setMessages(prev => [
                    ...prev,
                    { role: 'ai', text: `This isn't a PDF, but no worries! I'll use my knowledge of ${data.subject} to help you out. 📚` }
                ]);
                generateSimulation(null, data);
            }
        }
        setLoading(false);
    };

    const handleAsk = async (e) => {
        if (e) e.preventDefault();
        const query = input.trim();
        if (!query || isAiLoading) return;

        const userMsg = query;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsAiLoading(true);

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

            if (!apiKey || apiKey === 'your_gemini_api_key_here') {
                setMessages(prev => [...prev, {
                    role: 'ai',
                    text: "❌ **API Key Missing!** Check your `.env` file! 😭"
                }]);
                setIsAiLoading(false);
                return;
            }

            const genAI = new GoogleGenerativeAI(apiKey, { apiVersion: "v1" });
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
                Role: You are "AI Sensei", a cool, genius-level tutor for college students.
                
                Document Information:
                - Title: ${material.title || 'Unknown'}
                - Subject: ${material.subject || 'Unknown'}
                - Description: ${material.description || 'No description provided.'}
                
                Context from Document:
                ${docText ? docText.substring(0, 30000) : 'NO_TEXT_EXTRACTED'}

                ---
                Student's Query: "${userMsg}"
                ---

                Instructions:
                1. If NO_TEXT_EXTRACTED, say: "I haven't read the text (it might be handwritten), but let's talk about ${material.title} based on my knowledge!"
                2. Be concise, use emoji, and bold key terms.
                3. Use the document context primarily if available.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            setMessages(prev => [...prev, { role: 'ai', text: text }]);
        } catch (error) {
            console.error('AI Error:', error);
            setMessages(prev => [...prev, { role: 'ai', text: `My brain hit a roadblock! 🧠 Details: ${error.message}` }]);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!material?.file_url) return;
        await supabase.from('materials').update({ downloads: (material.downloads || 0) + 1 }).eq('id', id);
        window.open(material.file_url, '_blank');
    };

    if (loading) {
        return (
            <div className="h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                    <Loader2 className="animate-spin text-primary-500 relative z-10" size={64} />
                </div>
                <p className="text-slate-400 font-bold animate-pulse">Syncing with AI Sensei...</p>
            </div>
        );
    }

    return (
        <div className="h-screen bg-slate-900 flex flex-col font-body overflow-hidden">
            {/* Header */}
            <div className="h-20 px-6 bg-slate-900 border-b border-white/5 flex items-center justify-between z-50">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-white font-display font-bold text-lg truncate max-w-md">
                            {material?.title}
                        </h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] uppercase tracking-widest font-black text-primary-400">{material?.subject}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-[10px] uppercase tracking-widest font-black text-slate-500">{material?.university}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Badge variant="blue" className="bg-primary-500/10 text-primary-400 border-primary-500/20 px-3 py-1">
                        <Sparkles size={12} className="mr-1.5" />
                        GEN-AI 1.5 FLASH ACTIVE
                    </Badge>
                    <div className="h-8 w-px bg-white/5 mx-2" />

                    {/* ── Connect with Sender ── */}
                    {user && material?.uploaded_by && material.uploaded_by !== user.id && (
                        connectStatus === 'accepted' ? (
                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1.5 text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
                                    <UserCheck size={14} /> Friends
                                </span>
                                <Link to="/community">
                                    <button className="flex items-center gap-1.5 text-xs font-black text-primary-400 bg-primary-500/10 border border-primary-500/20 rounded-xl px-3 py-2 hover:bg-primary-500/20 transition-all">
                                        <MessageCircle size={14} /> DM
                                    </button>
                                </Link>
                            </div>
                        ) : connectStatus === 'pending' ? (
                            <span className="flex items-center gap-1.5 text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
                                <UserPlus size={14} /> Request Sent
                            </span>
                        ) : connectStatus === 'incoming' ? (
                            <span className="flex items-center gap-1.5 text-xs font-black text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-xl px-3 py-2">
                                <UserPlus size={14} /> Accept in Chill Zone
                            </span>
                        ) : (
                            <button
                                onClick={() => setShowProfileModal(true)}
                                className="flex items-center gap-1.5 text-xs font-black text-white bg-primary-600 hover:bg-primary-500 rounded-xl px-4 py-2.5 transition-all shadow-lg shadow-primary-900/30 active:scale-95"
                            >
                                <UserPlus size={14} />
                                Connect with Sender
                            </button>
                        )
                    )}

                    <div className="h-8 w-px bg-white/5 mx-1" />
                    <Button variant="accent" size="sm" className="gap-2 rounded-xl h-11" onClick={handleDownload}>
                        <Download size={18} /> Download
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left: Document Simulation View */}
                <div className="w-[60%] bg-[#0f172a] p-8 overflow-y-auto hidden md:block border-r border-white/5 custom-scrollbar">
                    {isScanning ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
                            <RefreshCw className="animate-spin" size={32} />
                            <p className="font-bold">Extracting document DNA...</p>
                        </div>
                    ) : simulation ? (
                        <div className="max-w-3xl mx-auto space-y-8 pb-20">
                            {/* Paper Simulation Card */}
                            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-primary-900/20 overflow-hidden text-slate-800">
                                <div className="h-3 bg-primary-600 w-full" />
                                <div className="p-12">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="bg-slate-100 p-4 rounded-3xl">
                                            <FileText size={32} className="text-primary-600" />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-black uppercase tracking-tighter text-slate-400 mb-1">Document Simulation</div>
                                            <div className="flex items-center gap-2 justify-end">
                                                <Badge className="bg-slate-100 text-slate-600 border-none font-bold">{simulation.difficulty}</Badge>
                                                <Badge className="bg-green-100 text-green-700 border-none font-bold">{simulation.estimatedStudyTime}</Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <h2 className="text-4xl font-black mb-6 font-display text-slate-900 leading-tight">
                                        {material.title}
                                    </h2>

                                    <div className="p-6 bg-primary-50 rounded-3xl mb-10 border border-primary-100">
                                        <h3 className="text-sm font-black text-primary-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Brain size={16} /> Executive Summary
                                        </h3>
                                        <p className="text-lg text-primary-800 leading-relaxed font-medium">
                                            {simulation.summary}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8 mb-10">
                                        <div>
                                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Core Concepts</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {simulation.coreTopics.map(topic => (
                                                    <span key={topic} className="px-4 py-2 bg-slate-100 rounded-2xl text-sm font-bold text-slate-700">
                                                        {topic}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Key Takeaways</h3>
                                            <ul className="space-y-3">
                                                {simulation.keyPoints.map((point, i) => (
                                                    <li key={i} className="flex gap-3 text-sm font-bold text-slate-600">
                                                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 shrink-0" />
                                                        {point}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                                        <p className="text-xs font-bold text-slate-400 italic">
                                            Simulation generated by AI Sensei based on {docText ? 'document content' : 'metadata'}.
                                        </p>
                                        <Button variant="outline" size="sm" onClick={handleDownload} className="rounded-xl font-bold">
                                            View Original Source
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Pro Tip Card */}
                            <div className="bg-linear-to-br from-primary-900 to-indigo-950 rounded-4xl p-8 text-white border border-white/10">
                                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                                    <Sparkles size={20} className="text-accent-400" />
                                    AI Sensei Pro Tip
                                </h3>
                                <p className="text-primary-100 font-medium opacity-90">
                                    "I recommend starting with the <b>Quiz Me</b> button on the right. Testing your knowledge on {material.subject} is 2x more effective than just re-reading notes!"
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-4">
                            <AlertCircle size={48} />
                            <p className="font-bold">Unable to simulate this document texture.</p>
                            <Button variant="ghost" onClick={fetchMaterial}>Retry Scan</Button>
                        </div>
                    )}
                </div>

                {/* Right: AI Chat */}
                <div className="w-full md:w-[40%] bg-[#080e1e] flex flex-col relative">
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                                <Sparkles size={48} className="mb-4" />
                                <p className="font-bold">Ready to drop some knowledge?</p>
                            </div>
                        )}
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'ai'
                                    ? 'bg-linear-to-br from-primary-500 to-primary-700 text-white shadow-primary-900/20'
                                    : 'bg-slate-800 text-slate-400'
                                    }`}>
                                    {msg.role === 'ai' ? <Sparkles size={18} /> : <span className="text-sm font-black">YU</span>}
                                </div>
                                <div className={`p-5 rounded-3xl text-sm font-medium leading-relaxed max-w-[85%] ${msg.role === 'ai'
                                    ? 'bg-slate-900 text-slate-200 rounded-tl-none border border-white/5 shadow-xl'
                                    : 'bg-primary-600 text-white rounded-tr-none shadow-xl shadow-primary-900/20'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isAiLoading && (
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center animate-pulse">
                                    <div className="w-5 h-5 bg-primary-500/50 rounded-full animate-ping" />
                                </div>
                                <div className="p-5 bg-slate-900/50 rounded-3xl rounded-tl-none border border-white/5 w-24">
                                    <div className="flex gap-1 justify-center">
                                        <div className="w-1 h-1 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-1 h-1 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-1 h-1 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-slate-900 border-t border-white/5">
                        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
                            {['Summarize 📄', 'Key concepts 🧠', 'Quiz me 📝', 'Exam Prep 🔥'].map(action => (
                                <button key={action} onClick={() => { setInput(action); handleAsk(); }} className="px-4 py-2 bg-white/5 border border-white/5 rounded-2xl text-xs font-black text-slate-400 hover:bg-primary-500 hover:text-white hover:border-primary-400 transition-all whitespace-nowrap uppercase tracking-wider">
                                    {action}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleAsk} className="relative">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full bg-[#0f172a] text-white placeholder:text-slate-600 rounded-2xl py-5 pl-6 pr-14 border border-white/5 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all font-bold"
                                placeholder="Type your query here..."
                            />
                            <button type="submit" disabled={isAiLoading} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-3 bg-primary-600 text-white rounded-[1.25rem] hover:bg-primary-500 transition-all shadow-xl shadow-primary-900/40 disabled:opacity-50">
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            ` }} />
        </div>
    );
}
