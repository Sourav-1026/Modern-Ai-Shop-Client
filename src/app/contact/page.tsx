"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { FiMail, FiUser, FiInfo, FiMessageSquare, FiSend, FiMapPin, FiPhone } from "react-icons/fi";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!name || !email || !subject || !message) {
      toast.error("Please fill in all diagnostic connection fields.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid operator email.");
      return false;
    }
    if (message.length < 10) {
      toast.error("Message must be at least 10 characters long.");
      return false;
    }
    return true;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    // Simulate API call to email transmission node
    setTimeout(() => {
      toast.success("Telemetry message transmitted successfully! HQ will review it shortly.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-[#f8fafc] py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="px-3 py-1 text-xs font-semibold text-primary-cyan bg-cyan-950/40 border border-primary-cyan/20 rounded-full uppercase tracking-wider">
          HQ Communications
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">Contact Terminal</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Need operational support, custom bulk licenses, or hardware specifications clarifications? Send us a telemetry report.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start pt-8">
        
        {/* Left Side: Contact Information Card */}
        <div className="space-y-6">
          <div className="glass-panel border border-white/5 p-6 rounded-xl bg-white/5 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Terminal Mappings</h3>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start text-xs">
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-primary-cyan text-base">
                  <FiMapPin />
                </div>
                <div className="space-y-1">
                  <h4 className="text-white font-semibold">Postal Location</h4>
                  <p className="text-slate-400 leading-normal">
                    1024 Quantum Drive, Sector 7, Cyber City, CC 94016
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start text-xs">
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-primary-cyan text-base">
                  <FiPhone />
                </div>
                <div className="space-y-1">
                  <h4 className="text-white font-semibold">Comm Lines</h4>
                  <p className="text-slate-400 leading-normal">
                    General: +1 (555) 019-2831<br />
                    Secure Link: +1 (555) 880-9921
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start text-xs">
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-primary-cyan text-base">
                  <FiMail />
                </div>
                <div className="space-y-1">
                  <h4 className="text-white font-semibold">Electronic Mail</h4>
                  <p className="text-slate-400 leading-normal">
                    Support: support@modernaishop.com<br />
                    Operators: admin@modernaishop.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Message Transmission Form */}
        <form onSubmit={handleSendMessage} className="lg:col-span-2 glass-panel border border-white/5 p-8 rounded-xl bg-white/5 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
            Diagnostics Message Form
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Operator Identity *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <FiUser />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full rounded-lg border border-white/10 bg-[#090d16] pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-cyan"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Return Email Link *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <FiMail />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@domain.com"
                  className="w-full rounded-lg border border-white/10 bg-[#090d16] pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-cyan"
                />
              </div>
            </div>

          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Subject Log Header *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <FiInfo />
              </div>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Topic of inquiry"
                className="w-full rounded-lg border border-white/10 bg-[#090d16] pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-cyan"
              />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Report Context (Min 10 chars) *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none text-slate-500">
                <FiMessageSquare />
              </div>
              <textarea
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write message details..."
                className="w-full rounded-lg border border-white/10 bg-[#090d16] pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-cyan resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-primary-cyan text-[#090d16] font-bold text-xs rounded-lg hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#090d16] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <FiSend /> Transmit Message
                </>
              )}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
