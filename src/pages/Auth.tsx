import { SiteImage } from "@/components/SiteImage";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Seo } from "@/components/Seo";
import { logoImage } from "@/data/cropImages";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

const Auth = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) navigate("/admin", { replace: true });
  }, [user, isAdmin, loading, navigate]);

  const claimAdminIfFirst = async () => {
    const { data } = await supabase.rpc("claim_first_admin");
    if (data === true) toast.success("You are now the workspace administrator.");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fe[i.path[0] as string] = i.message));
      setErrors(fe);
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm, then sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        await claimAdminIfFirst();
        navigate("/admin", { replace: true });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      toast.error(
        msg.toLowerCase().includes("invalid login")
          ? "Email or password is incorrect."
          : msg,
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-shell min-h-screen grid place-items-center bg-background px-6 py-16">
      <Seo
        title="Administrator sign in | Elgon Cooperative"
        description="Secure sign-in for Elgon Vanilla, Coffee & Cocoa Growers' Cooperative Society administrators."
        path="/auth"
      />
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-3 justify-center mb-8 text-primary">
          <span className="w-16 h-16 rounded-full neo-inset grid place-items-center">
            <SiteImage src={logoImage} loading="eager" alt="Elgon Cooperative logo" width={48} height={48} className="w-12 h-12 object-contain shrink-0" />
          </span>
          <span className="btn-label text-xs">Elgon Cooperative</span>
        </Link>

        <div className="neo-surface p-8 md:p-10">
          <p className="eyebrow mb-2">Admin area</p>
          <h1 className="font-heading font-bold text-2xl text-primary mb-6">
            {mode === "signin" ? "Sign in to the dashboard" : "Create an admin account"}
          </h1>

          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="btn-label text-xs text-primary block mb-2">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-5 rounded-md focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="btn-label text-xs text-primary block mb-2">Password</label>
              <input
                id="password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-5 rounded-md focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={busy}
              className="btn-label text-xs w-full bg-primary text-primary-foreground h-12 rounded-md neo-action hover:bg-secondary inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-6 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {mode === "signin" ? "Need an account? Create one" : "Already registered? Sign in"}
          </button>

          <p className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground flex gap-2">
            <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
            The first account to sign in becomes the workspace administrator. All later accounts must be granted the admin role.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Auth;
