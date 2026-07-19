"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCpu,
  FiZap,
  FiShoppingBag,
  FiShield,
  FiTrendingUp,
  FiLayers,
  FiMessageSquare,
  FiMail,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { toast } from "react-toastify";

interface Product {
  _id: string;
  title: string;
  shortDescription: string;
  price: number;
  category: string;
  imageUrl: string;
  rating: number;
}

const fallbackFeatured: Product[] = [
  {
    _id: "seed1",
    title: "AeroGlass Pro (Smart AR Glasses)",
    shortDescription:
      "Ultra-lightweight augmented reality glasses with neural gesture control.",
    price: 899,
    category: "Wearables",
    imageUrl:
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
  },
  {
    _id: "seed2",
    title: "Sentinel-X Companion Robot",
    shortDescription:
      "Interactive desktop companion with conversational AI and security monitoring.",
    price: 1499,
    category: "Robotics",
    imageUrl:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
  },
  {
    _id: "seed3",
    title: "Synapse Mood Ring v2",
    shortDescription:
      "Biometric sensor ring tracking emotional states and stress biofeedback.",
    price: 199,
    category: "Wearables",
    imageUrl:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
  },
  {
    _id: "seed5",
    title: "MyoFlow Haptic Armband",
    shortDescription:
      "High-density EMG sensory band for precise hand tracking and virtual feedback.",
    price: 429,
    category: "Neural Tech",
    imageUrl:
      "https://images.unsplash.com/photo-1558089687-f282ffcbd1d5?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
  },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>(fallbackFeatured);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        const res = await fetch(
          `${backendUrl}/api/products?limit=4&sort=rating_desc`,
        );
        if (res.ok) {
          const data = await res.json();
          if (data.products && data.products.length > 0) {
            setFeatured(data.products);
          }
        }
      } catch (err) {
        console.warn(
          "Backend not running yet, using high-quality static featured items.",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) {
      toast.error("Please enter a valid email.");
      return;
    }
    toast.success("Subscribed successfully to HQ updates!");
    setEmailInput("");
  };

  const categories = [
    {
      name: "Wearables",
      icon: <FiTrendingUp />,
      count: 3,
      desc: "AR HUDs and bio-sensor rings",
      color: "from-cyan-500/20 to-blue-600/25",
    },
    {
      name: "Robotics",
      icon: <FiCpu />,
      count: 2,
      desc: "AI assistants and tabletop companions",
      color: "from-purple-500/20 to-pink-600/25",
    },
    {
      name: "Smart Home",
      icon: <FiLayers />,
      count: 2,
      desc: "Self-correcting environment nodes",
      color: "from-emerald-500/20 to-teal-600/25",
    },
    {
      name: "Neural Tech",
      icon: <FiZap />,
      count: 2,
      desc: "Spatial inputs and thought interfaces",
      color: "from-violet-500/20 to-fuchsia-600/25",
    },
  ];

  const stats = [
    { value: "9,420+", label: "Active Nodes" },
    { value: "4.92", label: "Average Satisfaction" },
    { value: "140K+", label: "Custom Gadgets Generated" },
    { value: "<2.4ms", label: "Average Interface Latency" },
  ];

  const testimonials = [
    {
      name: "Dr. Kaelen Vance",
      role: "AI Researcher",
      quote:
        "The interface responsiveness on the MyoFlow Band is unparalleled. Absolute premium build quality.",
    },
    {
      name: "Sasha Gray",
      role: "UX Director",
      quote:
        "Designing a custom bio-tracker with the Gemini tool took less than two minutes. The details were spot-on!",
    },
    {
      name: "Marcus Chen",
      role: "Fullstack Architect",
      quote:
        "No placeholder specs, actual functional telemetry, and sleek styling. Modern AI Shop defines high-tech shopping.",
    },
  ];

  const faqs = [
    {
      q: "How does the AI Customizer work?",
      a: "By navigating to our Add Gadget page, you can type any design prompt. Our integration with Gemini AI automatically drafts technical specifications, calculates a realistic price, writes detailed documentation, and sets up a category structure.",
    },
    {
      q: "Is registration required to view items?",
      a: "No. Anyone can browse the marketplace and read specific technical specifications. Registration is only required to create, customize, manage, or review products.",
    },
    {
      q: "How is session security handled?",
      a: "We employ Better Auth on the Next.js frontend to securely track active user tokens, while the backend API routes verify requests using cryptographically signed JSON Web Tokens (JWT) via jose-cjs.",
    },
    {
      q: "Where can I set up real Google OAuth?",
      a: "Simply edit the frontend local environment variables to add your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET. The client handles the redirect automatically!",
    },
  ];

  return (
    <div className="flex flex-col w-full bg-[#090d16] text-[#f8fafc]">
      {/* 1. Hero Section (60-70% height) */}
      <section className="relative w-full h-[65vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))] -z-10"></div>
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10"></div>

        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-3 py-1 text-xs font-semibold text-primary-cyan bg-cyan-950/40 border border-primary-cyan/20 rounded-full uppercase tracking-wider">
              Gemini AI Powered Terminal
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent"
          >
            The Future of Smart Tech,{" "}
            <span className="text-primary-cyan glow-cyan">Today</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed"
          >
            Explore Next-Generation cybernetics, companion robotics, and neural
            interface hardware. Design your own gadget using generative
            intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/explore"
              className="w-full sm:w-auto px-8 py-3 text-sm font-semibold rounded-lg bg-primary-cyan text-[#090d16] hover:bg-cyan-400 transition-all duration-200 glow-cyan flex items-center justify-center gap-2"
            >
              <FiShoppingBag /> Explore Terminal
            </Link>
            <Link
              href="/items/add"
              className="w-full sm:w-auto px-8 py-3 text-sm font-semibold rounded-lg border border-white/10 hover:border-primary-cyan/40 hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <FiZap className="text-primary-cyan" /> Design Custom Item
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Categories Grid Section */}
      <section className="w-full py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            System Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Filter the shop catalog by specialized product categories
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link key={cat.name} href={`/explore?category=${cat.name}`}>
              <motion.div
                whileHover={{ y: -5 }}
                className={`p-6 rounded-xl bg-gradient-to-br ${cat.color} border border-white/5 hover:border-primary-cyan/30 transition-all duration-300 h-full flex flex-col justify-between group cursor-pointer`}
              >
                <div className="space-y-4">
                  <div className="text-primary-cyan text-2xl bg-white/5 p-3 rounded-lg w-fit group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-primary-cyan transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="text-xs text-primary-cyan font-semibold mt-4 group-hover:underline">
                  Browse items →
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. AI Innovation Hub Section */}
      <section className="w-full py-16 bg-[#06080e]/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="px-2.5 py-1 text-[10px] font-semibold text-primary-violet bg-violet-950/40 border border-primary-violet/20 rounded-full uppercase tracking-wider">
              AI Forge Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Design Tech Spec Sheets using{" "}
              <span className="text-primary-violet">Gemini AI</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Our integrated AI Customizer leverages Google Deepmind's Gemini
              LLM to draft realistic product listings instantly. Input a simple
              concept and watch the system generate descriptions, spec matrices,
              pricing models, and categorization.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-violet-500/10 text-primary-violet mt-0.5">
                  <FiShield />
                </div>
                <div className="text-xs">
                  <span className="text-white font-semibold">
                    Zero Placeholders:
                  </span>{" "}
                  Generates complete descriptions and specific numbers.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-violet-500/10 text-primary-violet mt-0.5">
                  <FiCpu />
                </div>
                <div className="text-xs">
                  <span className="text-white font-semibold">
                    Technical Precision:
                  </span>{" "}
                  Outputs exact dimensions, sensor details, and capacity bounds.
                </div>
              </div>
            </div>
            <Link
              href="/items/add"
              className="inline-block px-6 py-2.5 text-xs font-semibold rounded-lg bg-primary-violet text-white hover:bg-violet-600 transition-colors duration-200 shadow-lg shadow-violet-500/10"
            >
              Access Design Panel
            </Link>
          </div>

          {/* Mock Console UI */}
          <div className="w-full glass-panel border border-white/5 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <span className="text-[10px] text-slate-500 font-mono ml-4">
                gemini-1.5-flash:generate_product
              </span>
            </div>
            <div className="p-6 font-mono text-[11px] leading-relaxed space-y-4">
              <div className="text-slate-400">
                &gt; Prompt:{" "}
                <span className="text-primary-cyan">
                  "Solar powered micro drone"
                </span>
              </div>
              <div className="text-slate-400">
                &gt; Fetching Gemini telemetry...
              </div>
              <div className="p-3 bg-white/5 rounded border border-white/5 text-slate-300">
                <span className="text-primary-violet font-semibold">
                  "Helios Micro-Drone"
                </span>
                <br />
                Category: Robotics | Price: $349
                <br />
                Specs: 45m battery, titanium blades, solar-array skin.
                <br />
                Description: Compact camera drone that harvests ambient light
                for active recharge...
              </div>
              <div className="text-green-400 flex items-center gap-1.5">
                <FiZap /> System response parsed successfully.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Live Statistics Section */}
      <section className="w-full py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center space-y-2 p-6 glass-panel border border-white/5 rounded-xl bg-white/5"
            >
              <h3 className="text-2xl sm:text-4xl font-extrabold text-primary-cyan">
                {stat.value}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 font-semibold tracking-wider uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Featured Gadgets Section */}
      <section className="w-full py-16 bg-[#06080e]/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Featured Hardware
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Our highest rated futuristic tech catalog items
              </p>
            </div>
            <Link
              href="/explore"
              className="text-xs sm:text-sm text-primary-cyan hover:underline font-semibold flex items-center gap-1"
            >
              View All Products &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((item) => (
              <div
                key={item._id}
                className="glass-panel border border-white/5 rounded-xl overflow-hidden hover:border-primary-cyan/20 transition-all duration-300 flex flex-col h-full bg-white/5"
              >
                <div className="relative h-44 w-full bg-slate-900">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <span className="absolute top-3 left-3 bg-primary-violet/85 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                    {item.category}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-white line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.shortDescription}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-primary-emerald">
                        ${item.price}
                      </span>
                      <span className="text-xs text-yellow-400 font-semibold">
                        ★ {item.rating}
                      </span>
                    </div>
                    <Link
                      href={`/items/${item._id}`}
                      className="block text-center w-full py-2 bg-white/5 hover:bg-primary-cyan hover:text-[#090d16] border border-white/10 hover:border-transparent rounded-lg text-xs font-semibold text-white transition-all duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ Accordion Section */}
      <section className="w-full py-16 max-w-3xl mx-auto px-4">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            System FAQ
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Everything you need to know about the terminal interface
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="glass-panel border border-white/5 rounded-xl bg-white/5 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-sm text-white hover:bg-white/5 transition-colors focus:outline-none cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <FiChevronUp className="text-primary-cyan" />
                ) : (
                  <FiChevronDown className="text-slate-400" />
                )}
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-3 bg-[#0c121e]/30">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Customer Testimonials Section */}
      <section className="w-full py-16 bg-[#06080e]/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Operator Feedback
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Reviews from researchers and engineers utilizing our gear
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, idx) => (
              <div
                key={idx}
                className="p-6 glass-panel border border-white/5 bg-white/5 rounded-xl space-y-4"
              >
                <div className="text-primary-cyan text-2xl">
                  <FiMessageSquare />
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{test.quote}"
                </p>
                <div>
                  <h4 className="text-xs font-bold text-white">{test.name}</h4>
                  <p className="text-[10px] text-slate-500 font-semibold">
                    {test.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Newsletter Sign-up Section */}
      <section className="w-full py-16 bg-gradient-to-b from-[#090d16] to-[#04060b] border-t border-white/5">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center justify-center gap-2">
            <FiMail className="text-primary-cyan" /> Subscribe to Telemetry
            Updates
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Get notified of new futuristic drops, AI adapter revisions, and
            exclusive custom discount codes directly in your mailbox.
          </p>
          <form
            onSubmit={handleSubscribe}
            className="flex gap-2 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="flex-grow rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-transparent"
              placeholder="operator@domain.com"
            />
            <button
              type="submit"
              className="px-6 py-2 text-xs font-semibold rounded-lg bg-primary-cyan text-[#090d16] hover:bg-cyan-400 transition-all duration-200 glow-cyan cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
