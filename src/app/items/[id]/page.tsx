"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/api-helper";
import { toast } from "react-toastify";
import { FiCpu, FiStar, FiShoppingBag, FiLayers, FiZap, FiArrowLeft, FiMessageSquare } from "react-icons/fi";

interface Review {
  username: string;
  rating: number;
  comment: string;
  date: string;
}

interface Product {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  category: string;
  imageUrl: string;
  rating: number;
  reviews: Review[];
  createdBy: string;
}

export default function ProductDetailPage({ params }: { params: React.Usable<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Review inputs
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const { data: session } = authClient.useSession();

  const fetchDetails = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data.product);
        setRelated(data.relatedProducts || []);
      } else {
        toast.error("Telemetry node not found.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to connect to backend telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetails();
    }
  }, [id]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) {
      toast.error("Please enter a comment.");
      return;
    }

    setReviewLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const res = await fetchWithAuth(`${backendUrl}/api/products/${id}/reviews`, {
        method: "POST",
        body: JSON.stringify({
          rating: ratingInput,
          comment: commentInput
        })
      });

      if (res.ok) {
        toast.success("Review uploaded successfully!");
        setCommentInput("");
        setRatingInput(5);
        fetchDetails(); // Reload data
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to submit review.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error communicating with review node.");
    } finally {
      setReviewLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else {
        stars.push(<span key={i} className="text-slate-600">★</span>);
      }
    }
    return <div className="flex gap-0.5">{stars}</div>;
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-20 bg-[#090d16] text-slate-400 text-xs">
        Connecting to gadget node data...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-20 bg-[#090d16] gap-4">
        <h2 className="text-lg font-bold text-white">Item Telemetry Not Found</h2>
        <Link href="/explore" className="text-xs text-primary-cyan hover:underline flex items-center gap-1">
          <FiArrowLeft /> Back to Catalog
        </Link>
      </div>
    );
  }

  const specList = [
    { label: "Category Node", value: product.category },
    { label: "Signature ID", value: product._id },
    { label: "Creation Node", value: product.createdBy === "system" ? "Factory Production" : `Operator ID (${product.createdBy.slice(0, 8)}...)` }
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-[#f8fafc] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Back Button */}
      <div>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-primary-cyan transition-colors"
        >
          <FiArrowLeft /> Back to Explore Terminal
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column: Image Viewer */}
        <div className="space-y-4">
          <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden aspect-[4/3] bg-slate-950 relative glow-cyan/5">
            <Image src={product.imageUrl} alt={product.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="border border-primary-cyan/40 rounded-lg overflow-hidden aspect-[4/3] bg-slate-950 relative">
              <Image src={product.imageUrl} alt="Angle 1" fill className="object-cover opacity-80" sizes="25vw" />
            </div>
            <div className="border border-white/5 rounded-lg overflow-hidden aspect-[4/3] bg-slate-950 relative">
              <Image src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80" alt="Angle 2" fill className="object-cover opacity-40 hover:opacity-80 transition-opacity" sizes="25vw" />
            </div>
            <div className="border border-white/5 rounded-lg overflow-hidden aspect-[4/3] bg-slate-950 relative">
              <Image src="https://images.unsplash.com/photo-1558089687-f282ffcbd1d5?auto=format&fit=crop&w=400&q=80" alt="Angle 3" fill className="object-cover opacity-40 hover:opacity-80 transition-opacity" sizes="25vw" />
            </div>
            <div className="border border-white/5 rounded-lg overflow-hidden aspect-[4/3] bg-slate-950 relative">
              <Image src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80" alt="Angle 4" fill className="object-cover opacity-40 hover:opacity-80 transition-opacity" sizes="25vw" />
            </div>
          </div>
        </div>

        {/* Right Column: Spec and Options */}
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="px-3 py-1 text-xs font-semibold text-primary-cyan bg-cyan-950/40 border border-primary-cyan/20 rounded-full uppercase tracking-wider">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{product.title}</h1>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5 text-yellow-400 font-bold text-sm">
                <span>★ {product.rating}</span>
                <span className="text-slate-500 font-medium">({product.reviews.length} system reports)</span>
              </div>
              <span className="h-4 w-px bg-white/10"></span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Telemetry Operational</span>
            </div>
          </div>

          <div className="glass-panel border border-white/5 p-6 rounded-xl bg-white/5 space-y-4">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Credit Exchange</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-primary-emerald">${product.price}</span>
              <span className="text-xs text-slate-500 font-semibold">USD / Node Credits</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Immediate digital ledger authentication and delivery protocol active. Product items include 12-month hardware guarantee.
            </p>
            <button
              onClick={() => toast.success("Ledger contract simulated. Ready to dispatch!")}
              className="w-full py-3 bg-primary-cyan text-[#090d16] font-bold text-sm rounded-lg hover:bg-cyan-400 transition-all duration-200 glow-cyan cursor-pointer flex items-center justify-center gap-2"
            >
              <FiShoppingBag /> Acquire Hardware Node
            </button>
          </div>

          {/* Specifications Table */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Specifications Log</h3>
            <div className="glass-panel border border-white/5 rounded-xl overflow-hidden bg-white/5 divide-y divide-white/5">
              {specList.map((spec) => (
                <div key={spec.label} className="grid grid-cols-3 px-6 py-3 text-xs">
                  <div className="text-slate-400 font-semibold">{spec.label}</div>
                  <div className="text-white col-span-2">{spec.value}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Description / Overview Section */}
      <div className="space-y-4 border-t border-white/5 pt-12">
        <h3 className="text-lg font-bold text-white">Description / Overview</h3>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed whitespace-pre-line max-w-4xl">
          {product.fullDescription}
        </p>
      </div>

      {/* Reviews & Ratings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-white/5 pt-12">
        
        {/* Left: Star Breakdown and Form */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white">System Reports</h3>
          
          <div className="glass-panel border border-white/5 p-6 rounded-xl bg-white/5 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-extrabold text-white">{product.rating}</span>
              <div>
                {renderStars(product.rating)}
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Average score</span>
              </div>
            </div>
          </div>

          {/* Add Review Form */}
          <div className="glass-panel border border-white/5 p-6 rounded-xl bg-white/5 space-y-4">
            <h4 className="text-sm font-bold text-white">Submit Diagnostics Review</h4>
            
            {session ? (
              <form onSubmit={handleAddReview} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-semibold">Rating Score</label>
                  <select
                    value={ratingInput}
                    onChange={(e) => setRatingInput(Number(e.target.value))}
                    className="w-full rounded-lg border border-white/10 bg-[#090d16] px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-cyan focus:border-transparent"
                  >
                    <option value={5}>5 Stars - Flawless Operation</option>
                    <option value={4}>4 Stars - High Operational Quality</option>
                    <option value={3}>3 Stars - Satisfactory Performance</option>
                    <option value={2}>2 Stars - Hardware anomalies present</option>
                    <option value={1}>1 Star - Complete interface failure</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-semibold">Report Comments</label>
                  <textarea
                    required
                    rows={3}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Provide diagnostic feedback..."
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-cyan"
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="w-full py-2 bg-primary-cyan text-[#090d16] font-semibold text-xs rounded-lg hover:bg-cyan-400 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {reviewLoading ? (
                    <div className="w-4 h-4 border-2 border-[#090d16] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>Submit Report</span>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-2">
                <p className="text-xs text-slate-500">Sign in to publish diagnostic telemetry reports.</p>
                <Link
                  href="/login"
                  className="inline-block px-4 py-2 text-xs font-semibold text-primary-cyan bg-cyan-950/20 hover:bg-cyan-950/40 rounded-lg transition-colors border border-primary-cyan/20"
                >
                  Authorize Terminal
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Report Logs ({product.reviews.length})</h4>
          
          {product.reviews.length === 0 ? (
            <div className="glass-panel border border-white/5 bg-white/5 text-center py-10 rounded-xl text-xs text-slate-500">
              No diagnostic reports filed for this item node yet.
            </div>
          ) : (
            <div className="space-y-4">
              {product.reviews.map((rev, idx) => (
                <div key={idx} className="glass-panel border border-white/5 p-5 bg-white/5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white">{rev.username}</span>
                      <span className="text-[10px] text-slate-500 ml-3">{new Date(rev.date).toLocaleDateString()}</span>
                    </div>
                    {renderStars(rev.rating)}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Related Items Section */}
      {related.length > 0 && (
        <div className="space-y-6 border-t border-white/5 pt-12">
          <div>
            <h3 className="text-lg font-bold text-white">Related System Nodes</h3>
            <p className="text-xs text-slate-400">Other hardware configurations in the {product.category} system cluster</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <div key={item._id} className="glass-panel border border-white/5 rounded-xl overflow-hidden hover:border-primary-cyan/20 transition-all duration-300 flex flex-col h-full bg-white/5">
                <div className="relative h-40 w-full bg-slate-900">
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" />
                </div>
                <div className="p-4 flex flex-col flex-grow justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{item.shortDescription}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-extrabold text-primary-emerald">${item.price}</span>
                    <Link
                      href={`/items/${item._id}`}
                      onClick={() => {
                        setLoading(true);
                      }}
                      className="text-[10px] font-semibold text-primary-cyan hover:underline"
                    >
                      View Log &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
