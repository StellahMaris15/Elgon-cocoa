import { SiteImage } from "@/components/SiteImage";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Seo } from "@/components/Seo";
import { logoImage } from "@/data/cropImages";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

const DEFAULT_ADMIN_EMAIL = "elgon@gmail.com";

const Auth = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState(DEFAULT_ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        noindex
      />
      <div className="w-full max-w-md">
        <Link to="/" className="flex flex-col items-center gap-3 justify-center mb-8 text-primary">
          <span className="grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-primary-foreground/80 p-1 shadow-[10px_10px_24px_hsl(var(--clay-shadow-outer)/0.18),-10px_-10px_24px_hsl(0_0%_100%/0.96)]">
            <SiteImage src={logoImage} loading="eager" alt="Elgon Cooperative logo" width={104} height={104} className="h-full w-full shrink-0 rounded-full object-cover" />
          </span>
          <span className="btn-label text-sm">Elgon Cooperative</span>
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
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-5 pr-24 rounded-md focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="btn-label absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground hover:text-primary transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={busy}
              className="btn-label text-xs w-full bg-primary text-primary-foreground h-12 rounded-md neo-action hover:bg-secondary inline-flex items-center justify-center disabled:opacity-60"
            >
              {busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-6 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {mode === "signin" ? "Need an account? Create one" : "Already registered? Sign in"}
          </button>

          <Link
            to="/"
            className="btn-label mt-6 inline-flex items-center gap-2 border-t border-border pt-6 text-xs text-primary transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Auth;
