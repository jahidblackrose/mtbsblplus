import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, User, ShieldCheck } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) { setError("Please fill in all fields"); return; }
    setLoading(true); setError("");
    setTimeout(() => {
      localStorage.setItem("sbl_auth", "1");
      localStorage.setItem("sbl_user", username);
      navigate("/dashboard");
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[960px] grid md:grid-cols-2 rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        {/* Left branding */}
        <div className="hidden md:flex flex-col justify-between bg-primary text-primary-foreground p-8">
          <div>
            <div className="w-10 h-10 rounded-md bg-primary-foreground/20 flex items-center justify-center mb-6">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-[length:var(--font-size-2xl)] font-bold">Small Business Lending</h2>
            <p className="text-[length:var(--font-size-sm)] mt-2 opacity-80">
              Structured workflow management for branch-to-CAD application processing
            </p>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {[{ l: "Avg. screening", v: "24h" }, { l: "Workflow steps", v: "12+" }, { l: "Access governance", v: "RBAC" }].map((c) => (
                <div key={c.l} className="rounded-md bg-primary-foreground/10 p-2.5 text-center">
                  <p className="text-[length:var(--font-size-lg)] font-bold">{c.v}</p>
                  <p className="text-[length:var(--font-size-xs)] opacity-70 mt-0.5">{c.l}</p>
                </div>
              ))}
            </div>
            <ul className="space-y-1.5 text-[length:var(--font-size-xs)] opacity-80">
              <li>✓ Structured branch-to-CAD workflow visibility</li>
              <li>✓ Controlled access for RM, BM, CIB, CRM, CAD teams</li>
              <li>✓ Audit-conscious approvals and checkpoints</li>
            </ul>
          </div>
          <p className="text-[length:var(--font-size-xs)] opacity-50">© 2026 Mutual Trust Bank PLC</p>
        </div>

        {/* Right form */}
        <div className="p-8 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-[length:var(--font-size-xl)] font-bold text-foreground">Sign in to SBL Portal</h1>
            <p className="text-[length:var(--font-size-sm)] text-muted-foreground mt-1">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-field">
              <label className="text-[length:var(--font-size-sm)] font-medium text-foreground/80">Username</label>
              <div className="relative">
                <User size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  className="h-[var(--control-h)] w-full rounded-md border border-input bg-background pl-8 pr-3 text-[length:var(--font-size-base)] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div className="form-field">
              <label className="text-[length:var(--font-size-sm)] font-medium text-foreground/80">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="h-[var(--control-h)] w-full rounded-md border border-input bg-background pl-8 pr-9 text-[length:var(--font-size-base)] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                  placeholder="Enter password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && <p className="text-[length:var(--font-size-sm)] text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-[length:var(--font-size-xs)] text-muted-foreground text-center mt-6">
            Mutual Trust Bank PLC — SBL Portal v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
