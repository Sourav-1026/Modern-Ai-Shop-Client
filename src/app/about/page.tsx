"use client";

import { motion } from "framer-motion";
import { FiCpu, FiShield, FiUsers, FiClock, FiCode } from "react-icons/fi";

export default function AboutPage() {
  const values = [
    { icon: <FiShield />, title: "Secure Cryptography", desc: "Our core transactions and session architectures run on hardened cryptographic principles, with Express JWT authentications verified via jose-cjs." },
    { icon: <FiCpu />, title: "AI Guided Telemetry", desc: "We construct smart description sheets using next-generation AI integrations (Gemini AI models), automating technical documentations." },
    { icon: <FiUsers />, title: "Operator Clearance", desc: "Clear user roles managed client-side using Better Auth allow granular control over product lists and review diagnostics." }
  ];

  const team = [
    { name: "Cassius Vance", role: "Principal Hardware Architect", bio: "Former robotics lead specializing in neural feedback loop tracking systems." },
    { name: "Elena Rostova", role: "AI Systems Engineering", bio: "Led the development of prompt semantic templates and natural language filters." },
    { name: "Marcus Thorne", role: "Operations Terminal Lead", bio: "Fullstack system designer implementing secure token-exchange channels." }
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-[#f8fafc] py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="px-3 py-1 text-xs font-semibold text-primary-cyan bg-cyan-950/40 border border-primary-cyan/20 rounded-full uppercase tracking-wider">
            Terminal Profile
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white"
        >
          Forging the Interface of Tomorrow
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-400 leading-relaxed"
        >
          Modern AI Shop is a secure, state-of-the-art tech and cybernetics marketplace built in 2026. We pair cutting-edge hardware design with generative AI models to provide zero-latency smart solutions for researchers, developers, and operators worldwide.
        </motion.p>
      </section>

      {/* Grid Values Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map((val, idx) => (
          <div key={idx} className="p-6 glass-panel border border-white/5 bg-white/5 rounded-xl space-y-3">
            <div className="text-primary-cyan text-2xl bg-white/5 p-3 rounded-lg w-fit">
              {val.icon}
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{val.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{val.desc}</p>
          </div>
        ))}
      </section>

      {/* Narrative Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center border-t border-white/5 pt-16">
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Our Mission</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            As tech components become more integrated and complex, traditional specifications catalogs fail to capture the operational context of devices. We are here to bridge that gap. 
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            By enabling operators to prompt, model, and seed customized listings dynamically through AI integrations, we create an interactive sandbox of futuristic, functional hardware assets.
          </p>
        </div>
        <div className="glass-panel border border-white/5 p-6 rounded-xl bg-white/5 space-y-4 font-mono text-[11px] leading-relaxed">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2 text-slate-500">
            <FiCode /> <span>terminal_clearance_info.log</span>
          </div>
          <div>[SYSTEM OK] - Next.js 16 Client Live</div>
          <div>[DATABASE OK] - MongoDB connection active</div>
          <div>[SECURE MODULE OK] - Better Auth token listener initialized</div>
          <div>[EXPRESS BACKEND] - Express running on port 5000</div>
          <div>[JWT INTERFACE] - jose-cjs verify keys bound</div>
        </div>
      </section>

      {/* Team Section */}
      <section className="space-y-8 border-t border-white/5 pt-16">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white">System Operators</h2>
          <p className="text-xs text-slate-400">The core team executing specifications and database builds</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.name} className="p-6 glass-panel border border-white/5 bg-white/5 rounded-xl space-y-3">
              <h4 className="text-sm font-bold text-white">{member.name}</h4>
              <span className="text-[10px] font-semibold text-primary-cyan uppercase tracking-wider">{member.role}</span>
              <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-white/5">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy / Terms Anchor Hooks */}
      <section id="privacy" className="space-y-4 border-t border-white/5 pt-16">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">Privacy & Telemetry Agreement</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Operational cookies are utilized exclusively for session clearance logs managed through the Better Auth client package. Account registration credentials are encrypted locally, and user identity values are not sold, leased, or transmitted to outside networks. Standard Express JWT telemetry is encrypted using a shared HS256 secret.
        </p>
      </section>

      <section id="terms" className="space-y-4 border-t border-white/5 pt-8">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">Terms of Terminal Operations</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Operators generating custom gadgets using the Gemini AI integration are solely responsible for ensuring descriptions match ethical guidelines. Do not submit malicious telemetry records or utilize server endpoints for DDoS scripting loops. Any violation of these logs will result in immediate API credential revocation.
        </p>
      </section>

    </div>
  );
}
