"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { FiMail, FiLock, FiUser, FiCpu, FiUserPlus } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
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
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (error) {
        toast.error(error.message || "Failed to create account.");
      } else {
        toast.success("Account created successfully! Logging you in...");
        
        // Log in immediately after signup
        const loginRes = await authClient.signIn.email({
          email,
          password
        });
        
        if (loginRes.error) {
          toast.info("Account created. Please log in using the sign-in page.");
          window.location.href = "/login";
        } else {
          window.location.href = "/";
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
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
            Initialize Profile
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Create an account to start designing custom gadgets
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="user-name" className="sr-only">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiUser />
                </div>
                <input
                  id="user-name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2.5 border border-white/10 bg-white/5 placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-transparent text-sm transition-all duration-200"
                  placeholder="Full Name"
                />
              </div>
            </div>

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
                  placeholder="Password (Min 6 chars)"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiLock />
                </div>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2.5 border border-white/10 bg-white/5 placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-transparent text-sm transition-all duration-200"
                  placeholder="Confirm Password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-[#090d16] bg-primary-cyan hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-cyan transition-all duration-200 glow-cyan cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#090d16] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center gap-1.5">
                  <FiUserPlus /> Initialize Profile
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
          Already initialized?{" "}
          <Link href="/login" className="font-semibold text-primary-cyan hover:underline">
            Terminal Access
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
