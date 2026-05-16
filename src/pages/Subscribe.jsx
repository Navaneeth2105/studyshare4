import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import {
  Star, Clock, CheckCircle2, Loader2, Zap, ShieldCheck,
  ExternalLink, Copy, AlertCircle, ArrowRight, Sparkles
} from 'lucide-react';

// ── UPI Configuration ─────────────────────────────────────────────────────
// Replace with your real UPI ID before going live
const UPI_ID = import.meta.env.VITE_UPI_ID || 'studyshare@upi';
const PAYEE_NAME = 'StudyShare';

function buildUpiLink(amount, note) {
  return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
}

// ── QR Code via Google Charts ─────────────────────────────────────────────
function QRCode({ value, size = 200 }) {
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&bgcolor=ffffff&color=1e293b&margin=10`;
  return (
    <img
      src={url}
      alt="UPI QR Code"
      className="rounded-2xl border-4 border-white shadow-2xl"
      width={size}
      height={size}
    />
  );
}

export function Subscribe() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { karma, price, planName, trialDaysLeft, isTrialActive, isPendingVerification, isSubscribed, refetch } = useSubscription();

  const [step, setStep] = useState('plan');   // 'plan' | 'pay' | 'confirm' | 'done'
  const [utrNumber, setUtrNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // Already subscribed? Go home
  if (isSubscribed) {
    navigate('/home', { replace: true });
    return null;
  }

  const upiLink = buildUpiLink(price, `StudyShare ${planName} - ${user?.email}`);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenUpi = () => {
    // Deep-link opens any installed UPI app (GPay, PhonePe, Paytm, etc.)
    window.location.href = upiLink;
  };

  const handleSubmitUtr = async (e) => {
    e.preventDefault();
    if (!utrNumber.trim()) { setError('Please enter your UPI transaction ID (UTR).'); return; }
    setError('');
    setSubmitting(true);
    try {
      // Upsert subscription row with pending status
      const { error: dbErr } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          subscription_status: 'pending_verification',
          subscription_plan: planName,
          payment_ref: utrNumber.trim(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (dbErr) throw dbErr;
      await refetch();
      setStep('done');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Already pending verification ─────────────────────────────────────────
  if (isPendingVerification || step === 'done') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          {/* Ambient glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/10 blur-[160px] rounded-full" />
          </div>

          <div className="relative z-10 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
            <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock size={36} className="text-amber-400" />
            </div>
            <h1 className="text-3xl font-black text-white mb-3">Payment Under Review</h1>
            <p className="text-slate-400 font-medium mb-8 leading-relaxed">
              Your payment is being verified. We'll activate your account within <span className="text-amber-400 font-bold">24 hours</span>. Thanks for your patience! 🙏
            </p>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-8 text-left">
              <p className="text-xs font-black text-amber-400 uppercase tracking-widest mb-1">What happens next?</p>
              <ul className="text-sm text-slate-300 space-y-1 font-medium">
                <li>✅ Admin verifies your UPI transaction</li>
                <li>✅ Account gets activated</li>
                <li>✅ You get 30 days of full access</li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/home')}
              className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-bold transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step: Plan Selection ─────────────────────────────────────────────────
  if (step === 'plan') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white overflow-x-hidden">
        {/* Ambient blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary-600/8 blur-[180px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-600/6 blur-[180px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 pt-20 pb-32">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-5 py-2 mb-6">
              {isTrialActive ? (
                <>
                  <Clock size={14} className="text-amber-400" />
                  <span className="text-amber-400 font-black text-sm uppercase tracking-widest">
                    {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} left in trial
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle size={14} className="text-red-400" />
                  <span className="text-red-400 font-black text-sm uppercase tracking-widest">Trial Expired</span>
                </>
              )}
            </div>

            <h1 className="text-5xl font-black mb-4 leading-tight">
              {isTrialActive
                ? 'Your trial is ending soon 🎓'
                : 'Unlock StudyShare 🚀'}
            </h1>
            <p className="text-slate-400 text-lg font-medium">
              {isTrialActive
                ? 'Subscribe now and never lose access to your notes, AI Sensei, and the community.'
                : 'Your free trial has ended. Pick a plan to keep grinding.'}
            </p>
          </div>

          {/* Karma badge */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl px-5 py-3">
              <Star size={18} className="text-yellow-400" />
              <span className="text-yellow-400 font-black">{karma} Karma</span>
            </div>
            <div className={`flex items-center gap-2 rounded-2xl px-5 py-3 border ${karma >= 100
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-slate-700/40 border-white/10 text-slate-400'}`}>
              {karma >= 100
                ? <><Sparkles size={16} /><span className="font-black text-sm">Scholar Discount Applied!</span></>
                : <><span className="font-bold text-sm">Earn 100 Karma for ₹29 rate</span></>}
            </div>
          </div>

          {/* Plan Card */}
          <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden mb-8">
            {/* Glow accent */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary-600/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs font-black text-primary-400 uppercase tracking-widest mb-2">Your Plan</p>
                  <h2 className="text-2xl font-black text-white">{planName}</h2>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-black text-white">₹{price}</div>
                  <div className="text-slate-400 font-bold text-sm">/month</div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  'Full access to all study materials',
                  'AI Sensei — unlimited queries',
                  'Upload & share notes, earn Karma',
                  'Chill Zone community access',
                  'Career Skills tracks',
                  'Priority support',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                    <span className="text-slate-300 font-medium text-sm">{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep('pay')}
                className="w-full py-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 rounded-2xl font-black text-white text-lg transition-all shadow-lg shadow-primary-900/30 active:scale-95 flex items-center justify-center gap-2"
              >
                Pay ₹{price} via UPI <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* How pricing works */}
          <div className="bg-white/3 border border-white/6 rounded-2xl p-5 text-center">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">How Karma Pricing Works</p>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-black text-white">₹39</div>
                <div className="text-xs text-slate-500 font-bold">Karma &lt; 100</div>
              </div>
              <Zap size={18} className="text-yellow-400" />
              <div className="text-center">
                <div className="text-2xl font-black text-green-400">₹29</div>
                <div className="text-xs text-slate-500 font-bold">Karma ≥ 100</div>
              </div>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-3">Upload more notes → get more downloads → earn Karma → pay less!</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Step: Payment ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-600/8 blur-[180px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 pt-16 pb-32">
        {/* Back */}
        <button
          onClick={() => setStep('plan')}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-bold mb-8 transition-colors"
        >
          ← Back to Plans
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={28} className="text-green-400" />
          </div>
          <h1 className="text-3xl font-black mb-2">Pay via UPI</h1>
          <p className="text-slate-400 font-medium">
            Send <span className="text-white font-black">₹{price}</span> to complete your {planName}
          </p>
        </div>

        {/* Payment Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl mb-6">

          {/* QR Code */}
          <div className="flex flex-col items-center mb-8">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-5">Scan QR Code with any UPI App</p>
            <QRCode value={upiLink} size={200} />
            <p className="text-xs text-slate-500 font-bold mt-4 uppercase tracking-widest">
              GPay · PhonePe · Paytm · Any UPI
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* UPI ID + Open App Button */}
          <div className="space-y-3 mb-8">
            {/* UPI ID copy */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-0.5">UPI ID</p>
                <p className="font-black text-white text-base truncate">{UPI_ID}</p>
              </div>
              <button
                onClick={handleCopyUpi}
                className="shrink-0 p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all active:scale-95"
                title="Copy UPI ID"
              >
                {copied
                  ? <CheckCircle2 size={18} className="text-green-400" />
                  : <Copy size={18} className="text-slate-400" />}
              </button>
            </div>

            {/* Open UPI App */}
            <button
              onClick={handleOpenUpi}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-2xl font-black text-white text-base transition-all shadow-lg shadow-green-900/30 active:scale-95 flex items-center justify-center gap-2"
            >
              <ExternalLink size={18} />
              Open UPI App — Pay ₹{price}
            </button>
            <p className="text-center text-xs text-slate-600 font-medium">
              Opens GPay / PhonePe / Paytm automatically
            </p>
          </div>

          {/* Amount display */}
          <div className="bg-primary-500/10 border border-primary-500/20 rounded-2xl p-4 text-center mb-6">
            <p className="text-xs font-black text-primary-400 uppercase tracking-widest mb-1">Amount to Pay</p>
            <p className="text-4xl font-black text-white">₹{price}</p>
            <p className="text-xs text-slate-500 font-bold mt-1">{planName} · 30 days</p>
          </div>

          {/* UTR Form */}
          <form onSubmit={handleSubmitUtr}>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
              After paying, enter your Transaction ID (UTR)
            </p>
            <input
              type="text"
              placeholder="e.g. 324567891234 (12-digit UTR)"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 rounded-2xl px-5 py-4 text-white font-bold placeholder-slate-600 outline-none transition-all mb-3"
            />
            {error && (
              <p className="text-red-400 text-sm font-bold mb-3 flex items-center gap-2">
                <AlertCircle size={14} /> {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 disabled:opacity-60 rounded-2xl font-black text-white text-base transition-all shadow-lg shadow-primary-900/30 active:scale-95 flex items-center justify-center gap-2"
            >
              {submitting
                ? <><Loader2 size={18} className="animate-spin" /> Submitting…</>
                : <><CheckCircle2 size={18} /> I've Paid — Verify My Payment</>}
            </button>
          </form>
        </div>

        {/* Help note */}
        <div className="text-center">
          <p className="text-xs text-slate-600 font-medium">
            🔒 Your payment is safe. Access is activated within 24 hours after verification.
            <br />Need help? Contact us at support.
          </p>
        </div>
      </div>
    </div>
  );
}
