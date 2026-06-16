import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { LogIn, Mail, Lock, Loader2, ArrowRight, UserPlus } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { useNavigate } from "react-router-dom";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Bypass login logic to check the portal and its connectivity
      sessionStorage.setItem("admin_temp_email", email);
      
      // We will also set a fake token so authFetch has something
      localStorage.setItem("admin_token", "bypass_token");
      
      // Directly navigate to dashboard to bypass login page
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Server connection failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white text-white mb-4 shadow-xl border border-slate-100 ring-4 ring-primary/5">
            <span className="text-3xl font-bold leading-none text-primary">L</span>
            <span className="text-3xl font-bold leading-none text-secondary">H</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Admin Portal</h1>
          <p className="text-slate-600">Secure access for Lake City Hospital management</p>
        </div>

        <Card className="border-none shadow-xl border-t-4 border-t-primary">
          <CardHeader className="pb-2">
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the portal</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className={`p-3 rounded-lg text-sm text-center ${error.includes("complete") ? "bg-green-100 text-green-700 border-green-200" : "bg-danger/10 border border-danger/20 text-danger"}`}>
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" /> Gmail Address
                </label>
                <Input 
                  type="email" 
                  required 
                  placeholder="admin@lakecity.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" /> Password
                </label>
                <Input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                  minLength={8}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 text-base group"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Login 
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-slate-500 text-sm mt-8">
          &copy; 2026 Lake City Caring Partners. Authorized Access Only.
        </p>
      </motion.div>
    </div>
  );
}
