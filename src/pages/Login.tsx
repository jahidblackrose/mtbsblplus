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
    // Simulated login — replace with real API call
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[1040px] grid md:grid-cols-[1.1fr_1fr] rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        {/* Left branding panel — dark */}
        <div className="hidden md:flex flex-col justify-between bg-[hsl(215,30%,14%)] text-white p-8">
          <div>
            {/* Logo */}
            <div className="bg-white rounded-lg px-4 py-3 inline-flex items-center gap-3 mb-8">
              <img src={mtbLogo} alt="Mutual Trust Bank PLC" className="h-10 object-contain" />
            </div>

            <p className="text-[length:var(--font-size-xs)] font-semibold uppercase tracking-[0.15em] text-blue-300 mb-2">
              Small Business Loan Portal
            </p>
            <h2 className="text-[1.55rem] font-bold leading-snug mb-3">
              Corporate credit operations<br />
              with a cleaner, more<br />
              disciplined workspace.
            </h2>
            <p className="text-[length:var(--font-size-sm)] text-white/60 leading-relaxed max-w-[26rem]">
              Review applications, coordinate internal stages, and maintain control over
              documents and approvals in one secure operational flow.
            </p>
          </div>

          {/* Stats row */}
          <div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { v: "24h", l: "Average screening target" },
                { v: "12+", l: "Workflow checkpoints" },
                { v: "Role based", l: "Access governance" },
              ].map((c) => (
                <div key={c.l} className="rounded-lg border border-white/10 bg-white/5 px-3 py-3">
                  <p className="text-[length:var(--font-size-lg)] font-bold">{c.v}</p>
                  <p className="text-[length:var(--font-size-xs)] text-white/50 mt-0.5">{c.l}</p>
                </div>
              ))}
            </div>

            {/* Feature bullets */}
            <div className="space-y-2">
              {[
                "Structured branch-to-CAD workflow visibility",
                "Controlled access for RM, BM, CIB, CRM, and CAD teams",
                "Audit-conscious approvals, remarks, and document checkpoints",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2 rounded-lg bg-white/5 px-3 py-2">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-blue-400 shrink-0" />
                  <p className="text-[length:var(--font-size-xs)] text-white/70">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[length:var(--font-size-xs)] text-white/30 mt-4">© 2026 Mutual Trust Bank PLC</p>
        </div>

        {/* Right form panel */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          {/* Secure login badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 w-fit mb-5">
            <ShieldCheck size={13} className="text-primary" />
            <span className="text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wider text-muted-foreground">
              Secure Login
            </span>
          </div>

          <h1 className="text-[length:var(--font-size-2xl)] font-bold text-foreground mb-1">Sign in to continue</h1>
          <p className="text-[length:var(--font-size-sm)] text-muted-foreground mb-6 max-w-[22rem]">
            Access the operational workspace for application tracking,
            workflow reviews, reporting, and approvals.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div className="form-field">
              <label className="text-[length:var(--font-size-sm)] font-medium text-foreground/80">Username</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  className="h-[var(--control-h-lg)] w-full rounded-lg border border-input bg-background pl-9 pr-3 text-[length:var(--font-size-base)] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-field">
              <div className="flex items-center justify-between">
                <label className="text-[length:var(--font-size-sm)] font-medium text-foreground/80">Password</label>
                <span className="text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wider text-muted-foreground/60">Protected</span>
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="h-[var(--control-h-lg)] w-full rounded-lg border border-input bg-background pl-9 pr-10 text-[length:var(--font-size-base)] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Keep signed in */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                  className="h-4 w-4 rounded border-input accent-primary"
                />
                <span className="text-[length:var(--font-size-sm)] text-foreground">Keep me signed in</span>
              </label>
              <span className="text-[length:var(--font-size-xs)] text-muted-foreground/60">Authorized users only</span>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2">
                <p className="text-[length:var(--font-size-sm)] text-destructive">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full h-[var(--control-h-lg)] rounded-full text-[length:var(--font-size-base)] font-semibold" disabled={loading}>
              {loading ? "Signing in..." : (
                <span className="flex items-center gap-2">
                  Access dashboard <ArrowRight size={15} />
                </span>
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 rounded-lg border border-border bg-muted/30 px-4 py-3 flex items-start gap-3">
            <CheckCircle2 size={18} className="text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-[length:var(--font-size-sm)] font-semibold text-foreground">Demo credentials</p>
              <p className="text-[length:var(--font-size-xs)] text-muted-foreground">
                Username: <strong className="text-foreground">admin</strong>
                <span className="mx-3">Password: <strong className="text-foreground">password123</strong></span>
              </p>
            </div>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="rounded-lg border border-border p-3">
              <p className="text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wider text-primary mb-1">Operations</p>
              <p className="text-[length:var(--font-size-xs)] text-muted-foreground leading-relaxed">
                Applications, workflow queues, and branch review activity.
              </p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wider text-primary mb-1">Control</p>
              <p className="text-[length:var(--font-size-xs)] text-muted-foreground leading-relaxed">
                Role-based access, secure sessions, and protected internal actions.
              </p>
            </div>
          </div>

          <p className="text-[length:var(--font-size-xs)] text-muted-foreground text-center mt-5 uppercase tracking-wider">
            © 2026 Mutual Trust Bank PLC
          </p>
        </div>
      </div>
    </div>
  );
}
