import { useState } from "react";
import { motion } from "motion/react";
import { Lock, Mail, HeartPulse } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Link } from "react-router-dom";

export function PatientPortal() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img 
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop" 
          alt="Patient using mobile app" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-primary-dark/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-12 text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mb-6">
            <HeartPulse className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Your Health, In Your Hands.</h2>
          <p className="text-lg text-blue-100 max-w-md leading-relaxed">
            Access your medical records, view test results, and manage your appointments securely from anywhere.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 xl:p-24 pt-32 lg:pt-0">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center lg:text-left mb-8">
              <div className="lg:hidden inline-flex items-center justify-center w-16 h-16 bg-primary text-white rounded-2xl mb-6 shadow-lg shadow-primary/20">
                <HeartPulse className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Patient Portal</h1>
              <p className="text-slate-600">
                {isLogin ? "Welcome back! Please enter your details." : "Create an account to manage your health."}
              </p>
            </div>

            <Card className="border-none shadow-xl bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-center">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </CardTitle>
                <CardDescription className="text-center">
                  {isLogin ? "Enter your credentials to access your account." : "Register to access the patient portal."}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  {!isLogin && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Full Name</label>
                      <Input required placeholder="John Doe" className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary" />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <Input required type="email" placeholder="john@example.com" className="pl-12 h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">Password</label>
                      {isLogin && (
                        <a href="#" className="text-sm text-primary hover:underline font-medium">
                          Forgot password?
                        </a>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <Input required type="password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" className="pl-12" />
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full h-12 text-base shadow-md shadow-primary/20">
                    {isLogin ? "Sign In" : "Create Account"}
                  </Button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-600">
                  {isLogin ? (
                    <p>
                      Don't have an account?{" "}
                      <button onClick={() => setIsLogin(false)} className="text-primary font-semibold hover:underline">
                        Register here
                      </button>
                    </p>
                  ) : (
                    <p>
                      Already have an account?{" "}
                      <button onClick={() => setIsLogin(true)} className="text-primary font-semibold hover:underline">
                        Sign in
                      </button>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center lg:text-left">
              <Link to="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center">
                &larr; Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
