"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/api-helper";
import { toast } from "react-toastify";
import {
  FiPlusSquare,
  FiZap,
  FiEdit3,
  FiArrowLeft,
  FiImage,
  FiGrid,
} from "react-icons/fi";

const isValidImageUrl = (url: string) => {
  if (!url) return false;
  try {
    new URL(url);
    return url.startsWith("http");
  } catch (e) {
    return false;
  }
};

export default function AddItemPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Wearables");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // AI customizer state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiTone, setAiTone] = useState("Professional");
  const [aiLength, setAiLength] = useState("Medium");
  const [aiLoading, setAiLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Authentication required. Redirecting to access terminal...");
      router.push("/login");
    }
  }, [session, isPending, router]);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please describe your custom gadget concept first.");
      return;
    }

    setAiLoading(true);
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const res = await fetchWithAuth(`${backendUrl}/api/ai/generate`, {
        method: "POST",
        body: JSON.stringify({
          concept: aiPrompt,
          tone: aiTone,
          length: aiLength,
        }),
      });

      if (res.ok) {
        const data = await res.json();

        // Auto fill form with generated data
        setTitle(data.title || "");
        setCategory(data.category || "Wearables");
        setShortDescription(data.shortDescription || "");
        setFullDescription(data.fullDescription || "");
        setPrice(data.price ? data.price.toString() : "");

        // Pick category default image if not returned or fallback
        const defaultImages: Record<string, string> = {
          Wearables:
            "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80",
          Robotics:
            "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=800&q=80",
          "Smart Home":
            "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
          "Neural Tech":
            "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80",
        };
        setImageUrl(data.imageUrl || defaultImages[data.category] || "");

        toast.success("AI specifications generated successfully!");
      } else {
        toast.error("Failed to generate details. Backend AI module error.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error communicating with Gemini AI route.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !shortDescription || !fullDescription || !price) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitLoading(true);
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const res = await fetchWithAuth(`${backendUrl}/api/products`, {
        method: "POST",
        body: JSON.stringify({
          title,
          category,
          shortDescription,
          fullDescription,
          price: Number(price),
          imageUrl,
        }),
      });

      if (res.ok) {
        toast.success("Futuristic Gadget registered successfully!");
        router.push("/items/manage");
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Failed to register custom item.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit product data.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (isPending || !session) {
    return (
      <div className="flex-grow flex items-center justify-center bg-[#090d16] text-slate-400 text-xs">
        Checking clearance levels...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-[#f8fafc] py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <FiPlusSquare className="text-primary-cyan" /> Item Customizer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Deploy custom smart hardware to the Modern AI Shop catalog
          </p>
        </div>
        <Link
          href="/items/manage"
          className="text-xs text-slate-400 hover:text-primary-cyan transition-colors"
        >
          Manage Custom Items &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: AI Prompt Creator */}
        <div className="space-y-6 lg:col-span-1">
          <div className="glass-panel border border-white/5 p-6 rounded-xl bg-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <FiZap className="text-primary-cyan" /> Gemini AI Engine
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Describe a futuristic tech concept (e.g. "a smartwatch that
              projects a hologram of a garden"). The Gemini engine will write
              details and specifications instantly.
            </p>

            <div className="space-y-3">
              <textarea
                rows={4}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe product concept here..."
                className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-cyan focus:border-transparent resize-none"
              />
              <div className="flex gap-3">
                <select
                  value={aiTone}
                  onChange={(e) => setAiTone(e.target.value)}
                  className="flex-1 rounded-lg border border-white/10 bg-slate-900 p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-cyan cursor-pointer"
                >
                  <option value="Professional">Professional</option>
                  <option value="Marketing">Marketing / Sales</option>
                  <option value="Technical">Technical</option>
                  <option value="Cyberpunk">Cyberpunk / Sci-Fi</option>
                </select>
                <select
                  value={aiLength}
                  onChange={(e) => setAiLength(e.target.value)}
                  className="flex-1 rounded-lg border border-white/10 bg-slate-900 p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-cyan cursor-pointer"
                >
                  <option value="Short">Short</option>
                  <option value="Medium">Medium</option>
                  <option value="Detailed">Detailed</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={aiLoading}
                className="w-full py-2.5 bg-primary-violet text-white font-bold text-xs rounded-lg hover:bg-violet-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {aiLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <FiZap />{" "}
                    {title ? "Regenerate Specs" : "Forge Specs with AI"}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Form Image Preview */}
          {isValidImageUrl(imageUrl) && (
            <div className="glass-panel border border-white/5 p-6 rounded-xl bg-white/5 space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                <FiImage className="text-primary-cyan" /> Item Renders
              </h4>
              <div className="aspect-4/3 rounded-lg overflow-hidden bg-slate-900 border border-white/5 relative">
                <Image
                  src={imageUrl}
                  alt="AI product concept preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 30vw"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Columns: Main Creation Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 space-y-6 glass-panel border border-white/5 p-8 rounded-xl bg-white/5"
        >
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5 border-b border-white/5 pb-3">
            <FiEdit3 className="text-primary-cyan" /> Specifications Worksheet
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">
                Gadget Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product name"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-cyan"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">
                Category Cluster *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#090d16] px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-cyan focus:border-transparent"
              >
                <option value="Wearables">Wearables</option>
                <option value="Robotics">Robotics</option>
                <option value="Smart Home">Smart Home</option>
                <option value="Neural Tech">Neural Tech</option>
              </select>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">
                Ledger Price ($ USD) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Exchange cost"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-cyan"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">
                Telemetry Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Optional telemetry URL override"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-cyan"
              />
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">
              Telemetry Log Summary *
            </label>
            <input
              type="text"
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Sleek, catchphrase style summary details"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-cyan"
            />
          </div>

          {/* Full Description */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">
              Detailed Diagnostic Overview *
            </label>
            <textarea
              required
              rows={6}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="Elaborated hardware functionalities, dimensions, operating states..."
              className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-cyan"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              type="submit"
              disabled={submitLoading}
              className="px-6 py-2.5 bg-primary-cyan text-[#090d16] font-bold text-xs rounded-lg hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10"
            >
              {submitLoading ? (
                <div className="w-4 h-4 border-2 border-[#090d16] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <FiPlusSquare /> Dispatch Custom Gadget
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
