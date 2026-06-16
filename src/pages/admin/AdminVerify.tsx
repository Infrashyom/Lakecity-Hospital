import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ShieldCheck, Mail, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { useNavigate } from "react-router-dom";

export function AdminVerify() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const tempEmail = sessionStorage.getItem("admin_temp_email");
    if (!tempEmail) {
      navigate("/admin/login");
    } else {
      setEmail(tempEmail);
    }
  }, [navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("admin_token", data.token);
        sessionStorage.removeItem("admin_temp_email");
        navigate("/admin/dashboard");
      } else {
        setError(data.message || "Invalid or expired verification code");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white text-white mb-4 shadow-xl border border-slate-100 ring-4 ring-secondary/5">
            <span className="text-3xl font-bold leading-none text-primary">L</span>
            <span className="text-3xl font-bold leading-none text-secondary">H</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">2-Factor Authentication</h1>
          <p className="text-slate-600">Verification code sent to your Gmail</p>
        </div>

        <Card className="border-none shadow-xl border-t-4 border-t-secondary">
          <CardHeader className="pb-2">
            <CardTitle>Verify Your Identity</CardTitle>
            <CardDescription>
              We've sent a 6-digit code to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleVerify} className="space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm text-center">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <Input 
                  type="text" 
                  required 
                  maxLength={6}
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="h-16 text-center text-3xl font-bold tracking-widest border-2 focus-visible:border-secondary transition-all"
                  autoFocus
                />
                <p className="text-xs text-slate-400 text-center">
                  Expect the email within a minute. Check your spam folder if it doesn't appear.
                </p>
              </div>

              <Button 
                type="submit" 
                variant="secondary"
                disabled={isLoading || code.length !== 6}
                className="w-full h-12 text-base group"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Verify & Access Dashboard <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <button 
              onClick={() => navigate("/admin/login")}
              className="w-full mt-6 text-sm text-slate-500 hover:text-primary font-medium transition-colors"
            >
              Back to Sign In
            </button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
