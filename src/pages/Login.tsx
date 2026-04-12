import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, User, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import mtbLogo from "@/assets/mtb-logo-full.png";

const loginSchema = {
  validate(username: string, password: string): string | null {
    if (!username.trim()) return "Username is required";
    if (username.trim().length < 3) return "Username must be at least 3 characters";
    if (!password.trim()) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  },
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  const [showPw, setShowPw] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = loginSchema.validate(username, password);
    if (err) { setError(err); return; }
    setLoading(true);
    setError("");
    setTimeout(() => {
      login(
        { username, role: "Admin", branch: "Head Office", displayName: "System Admin" },
        "demo-jwt-token-" + Date.now()
      );
      const from = (location.state as any)?.from || "/dashboard";
      navigate(from, { replace: true });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[hsl(220,20%,94%)] flex items-center justify-center p-6">
      <div className="w-full max-w-[1100px] grid md:grid-cols-[1.1fr_1fr] rounded-2xl bg-white shadow-xl overflow-hidden min-h-[680px]">
        
        {/* Left branding panel — dark navy */}
        <div className="hidden md:flex flex-col justify-between bg-[hsl(215,35%,16%)] text-white p-10 rounded-2xl m-2">
          {/* Top content */}
          <div>
            {/* Logo bar */}
            <div className="bg-white rounded-xl px-5 py-3.5 inline-flex items-center gap-3 mb-10">
              <img src={mtbLogo} alt="Mutual Trust Bank PLC" className="h-12 object-contain" />
            </div>

            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[hsl(215,60%,70%)] mb-3">
              Small Business Loan Portal
            </p>
            <h2 className="text-[1.75rem] font-bold leading-[1.25] mb-4">
              Corporate credit operations<br />
              with a cleaner, more<br />
              disciplined workspace.
            </h2>
            <p className="text-[15px] text-white/55 leading-relaxed max-w-[28rem]">
              Review applications, coordinate internal stages, and maintain control over
              documents and approvals in one secure operational flow.
            </p>
          </div>

          {/* Stats row */}
          <div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { v: "24h", l: "Average screening target" },
                { v: "12+", l: "Workflow checkpoints" },
                { v: "Role based", l: "Access governance" },
              ].map((c) => (
                <div key={c.l} className="rounded-xl border border-white/10 bg-white/5 px-4 py-4">
                  <p className="text-[18px] font-bold">{c.v}</p>
                  <p className="text-[12px] text-white/45 mt-1">{c.l}</p>
                </div>
              ))}
            </div>

            {/* Feature bullets */}
            <div className="space-y-2.5">
              {[
                "Structured branch-to-CAD workflow visibility",
                "Controlled access for RM, BM, CIB, CRM, and CAD teams",
                "Audit-conscious approvals, remarks, and document checkpoints",
              ].map((text) => (
                <div key={text} className="flex items-center gap-3 rounded-xl bg-white/[0.06] px-4 py-3">
                  <span className="h-2 w-2 rounded-full bg-[hsl(215,60%,65%)] shrink-0" />
                  <p className="text-[13px] text-white/65">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[12px] text-white/25 mt-5 uppercase tracking-[0.12em]">© 2026 Mutual Trust Bank PLC</p>
        </div>

        {/* Right form panel */}
        <div className="px-10 py-10 md:px-12 md:py-10 flex flex-col justify-center">
          {/* Secure login badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(215,20%,88%)] px-4 py-1.5 w-fit mb-6">
            <ShieldCheck size={15} className="text-[hsl(215,60%,38%)]" />
            <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[hsl(215,15%,50%)]">
              Secure Login
            </span>
          </div>

          <h1 className="text-[28px] font-bold text-[hsl(215,30%,15%)] mb-2">Sign in to continue</h1>
          <p className="text-[15px] text-[hsl(215,10%,52%)] mb-8 leading-relaxed max-w-[24rem]">
            Access the operational workspace for application tracking,
            workflow reviews, reporting, and approvals.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div>
              <label className="text-[14px] font-semibold text-[hsl(215,30%,15%)] mb-2 block">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(215,10%,65%)]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  className="h-[48px] w-full rounded-xl border border-[hsl(215,20%,88%)] bg-white pl-11 pr-4 text-[15px] text-[hsl(215,30%,15%)] placeholder:text-[hsl(215,10%,70%)] focus:outline-none focus:ring-2 focus:ring-[hsl(215,60%,50%)] focus:border-transparent transition-shadow"
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[14px] font-semibold text-[hsl(215,30%,15%)]">Password</label>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[hsl(215,10%,70%)]">Protected</span>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(215,10%,65%)]" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="h-[48px] w-full rounded-xl border border-[hsl(215,20%,88%)] bg-white pl-11 pr-12 text-[15px] text-[hsl(215,30%,15%)] placeholder:text-[hsl(215,10%,70%)] focus:outline-none focus:ring-2 focus:ring-[hsl(215,60%,50%)] focus:border-transparent transition-shadow"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[hsl(215,10%,65%)] hover:text-[hsl(215,30%,30%)] transition-colors">
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Keep signed in */}
            <div className="flex items-center justify-between rounded-xl border border-[hsl(215,20%,88%)] px-4 py-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                  className="h-[18px] w-[18px] rounded border-[hsl(215,20%,82%)] accent-[hsl(215,60%,38%)]"
                />
                <span className="text-[14px] font-medium text-[hsl(215,30%,15%)]">Keep me signed in</span>
              </label>
              <span className="text-[12px] text-[hsl(215,10%,65%)]">Authorized users only</span>
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3">
                <p className="text-[14px] text-destructive">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-[50px] rounded-xl text-[15px] font-semibold bg-[hsl(215,30%,15%)] hover:bg-[hsl(215,30%,20%)] text-white"
              disabled={loading}
            >
              {loading ? "Signing in..." : (
                <span className="flex items-center gap-2">
                  Access dashboard <ArrowRight size={16} />
                </span>
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 rounded-xl border border-[hsl(215,20%,88%)] bg-[hsl(215,20%,97%)] px-5 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-[hsl(215,20%,88%)] flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} className="text-[hsl(215,60%,38%)]" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[hsl(215,30%,15%)]">Demo credentials</p>
              <p className="text-[13px] text-[hsl(215,10%,50%)] mt-0.5">
                Username: <strong className="text-[hsl(215,30%,15%)]">admin</strong>
                <span className="mx-4">Password: <strong className="text-[hsl(215,30%,15%)]">password123</strong></span>
              </p>
            </div>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="rounded-xl border border-[hsl(215,20%,88%)] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[hsl(215,60%,45%)] mb-1.5">Operations</p>
              <p className="text-[13px] text-[hsl(215,10%,45%)] leading-relaxed">
                Applications, workflow queues, and branch review activity.
              </p>
            </div>
            <div className="rounded-xl border border-[hsl(215,20%,88%)] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[hsl(215,60%,45%)] mb-1.5">Control</p>
              <p className="text-[13px] text-[hsl(215,10%,45%)] leading-relaxed">
                Role-based access, secure sessions, and protected internal actions.
              </p>
            </div>
          </div>

          <p className="text-[12px] text-[hsl(215,10%,60%)] text-center mt-6 uppercase tracking-[0.14em]">
            © 2026 Mutual Trust Bank PLC
          </p>
        </div>
      </div>
    </div>
  );
}
