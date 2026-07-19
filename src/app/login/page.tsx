"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { FiMail, FiLock, FiCpu, FiUserCheck, FiLogIn } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Failed to sign in. Please check your credentials.");
      } else {
        toast.success("Welcome back!");
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    const demoEmail = "demo@modernaishop.com";
    const demoPassword = "password123";
    const demoName = "Demo Commander";

    try {
      // Attempt sign in
      const signInRes = await authClient.signIn.email({
        email: demoEmail,
        password: demoPassword,
      });

      if (signInRes.error) {
        // If user doesn't exist, sign them up first
        const signUpRes = await authClient.signUp.email({
          email: demoEmail,
          password: demoPassword,
          name: demoName,
        });

        if (signUpRes.error) {
          toast.error("Failed to set up demo user session.");
          setDemoLoading(false);
          return;
        }

        // Try sign in again after signup
        const retrySignIn = await authClient.signIn.email({
          email: demoEmail,
          password: demoPassword,
        });

        if (retrySignIn.error) {
          toast.error("Demo login error: " + retrySignIn.error.message);
          setDemoLoading(false);
          return;
        }
      }

      toast.success("Logged in as Demo User!");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      toast.error("Failed to initialize Demo Login.");
    } finally {
      setDemoLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Better Auth redirects to Google
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/"
      });
    } catch (err) {
      console.error(err);
      toast.error("Google OAuth error. Please ensure GOOGLE_CLIENT_ID is configured in environment variables.");
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#090d16]">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-cyan/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary-violet/10 rounded-full blur-3xl -z-10 animate-pulse delay-75"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 glass-panel p-8 rounded-2xl glow-cyan/10 border border-white/5"
      >
        <div className="text-center">
          <FiCpu className="mx-auto h-12 w-12 text-primary-cyan animate-pulse" />
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white">
            Access Terminal
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to unlock AI customization features
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiMail />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2.5 border border-white/10 bg-white/5 placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-transparent text-sm transition-all duration-200"
                  placeholder="Terminal Email ID"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiLock />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2.5 border border-white/10 bg-white/5 placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-transparent text-sm transition-all duration-200"
                  placeholder="Security Password"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-[#090d16] bg-primary-cyan hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-cyan transition-all duration-200 glow-cyan cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#090d16] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center gap-1.5">
                  <FiLogIn /> Sign In
                </span>
              )}
            </button>

            {/* Demo Login Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-white/10 rounded-lg text-sm font-semibold text-primary-cyan bg-cyan-950/20 hover:bg-cyan-950/40 hover:border-primary-cyan/40 transition-all duration-200 cursor-pointer"
            >
              {demoLoading ? (
                <div className="w-5 h-5 border-2 border-primary-cyan border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center gap-1.5">
                  <FiUserCheck /> Quick Demo Login (One-click)
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#090d16] px-2 text-slate-500">Or continue with</span>
          </div>
        </div>

        {/* Google OAuth Button */}
        <div>
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all duration-200 cursor-pointer"
          >
            <FcGoogle className="text-xl" />
            <span>Google Account</span>
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          Not registered?{" "}
          <Link href="/register" className="font-semibold text-primary-cyan hover:underline">
            Initialize Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
