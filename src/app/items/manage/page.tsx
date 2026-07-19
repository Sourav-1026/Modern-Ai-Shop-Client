"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/api-helper";
import { toast } from "react-toastify";
import {
  FiList,
  FiTrash2,
  FiEye,
  FiZap,
  FiPlusSquare,
  FiAlertCircle,
} from "react-icons/fi";
import { DeleteModal } from "@/components/DeleteModal";

export interface Product {
  _id: string;
  title: string;
  shortDescription: string;
  price: number;
  category: string;
  imageUrl: string;
  createdAt: string;
}

export default function ManageItemsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Clearance required. Access denied.");
      router.push("/login");
    }
  }, [session, isPending, router]);

  const fetchUserProducts = async () => {
    if (!session) return;
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      // We call the products route, passing the active user id as createdBy parameter
      const res = await fetch(
        `${backendUrl}/api/products?createdBy=${session.user.id}&limit=100`,
      );

      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      } else {
        toast.error("Failed to load custom product registry.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Telemetry server communication failure.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchUserProducts();
    }
  }, [session]);

  if (isPending || !session) {
    return (
      <div className="grow flex items-center justify-center bg-[#090d16] text-slate-400 text-xs">
        Verifying system clearance...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-[#f8fafc] py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-5 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <FiList className="text-primary-cyan" /> Operator Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage hardware configurations deployed by your operator node
          </p>
        </div>
        <Link
          href="/items/add"
          className="px-4 py-2.5 bg-primary-cyan text-[#090d16] font-bold text-xs rounded-lg hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
        >
          <FiPlusSquare /> Create New Custom Item
        </Link>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs animate-pulse">
          Retrieving hardware telemetry mappings...
        </div>
      ) : products.length === 0 ? (
        <div className="glass-panel border border-white/5 bg-white/5 rounded-2xl p-12 text-center space-y-4">
          <FiAlertCircle className="mx-auto h-12 w-12 text-slate-500" />
          <h3 className="text-base font-bold text-white">
            No Deployed Gadgets
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            You haven't customized or published any gadgets using this account
            yet. Access the Gemini AI Engine to start designing!
          </p>
          <Link
            href="/items/add"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#090d16] bg-primary-cyan hover:bg-cyan-400 rounded-lg transition-colors cursor-pointer"
          >
            <FiZap /> Launch Forge Panel
          </Link>
        </div>
      ) : (
        /* Table Grid Layout */
        <div className="glass-panel border border-white/5 rounded-2xl bg-white/5 overflow-hidden">
          {/* Table Header (Hidden on Mobile) */}
          <div className="hidden md:grid grid-cols-6 gap-4 bg-white/5 px-6 py-4 border-b border-white/5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span className="col-span-2">Gadget Details</span>
            <span>Category</span>
            <span>Ledger Cost</span>
            <span>Deployment Date</span>
            <span className="text-right">Actions</span>
          </div>

          {/* Rows List */}
          <div className="divide-y divide-white/5">
            {products.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-1 md:grid-cols-6 gap-4 px-6 py-5 items-center hover:bg-white/2 transition-colors"
              >
                {/* Image + Title */}
                <div className="col-span-1 md:col-span-2 flex items-center gap-4">
                  <div className="h-12 w-16 bg-slate-900 rounded-lg overflow-hidden border border-white/5 shrink-0 relative">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-white line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-normal font-mono">
                      {item._id.slice(0, 10)}...
                    </p>
                  </div>
                </div>

                {/* Category */}
                <div className="flex md:block items-center justify-between text-xs">
                  <span className="md:hidden text-slate-500 font-semibold uppercase text-[10px]">
                    Category:
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold text-primary-violet bg-violet-950/40 border border-primary-violet/15 rounded-full uppercase">
                    {item.category}
                  </span>
                </div>

                {/* Ledger Cost */}
                <div className="flex md:block items-center justify-between text-xs">
                  <span className="md:hidden text-slate-500 font-semibold uppercase text-[10px]">
                    Price:
                  </span>
                  <span className="font-extrabold text-primary-emerald">
                    ${item.price}
                  </span>
                </div>

                {/* Deployment Date */}
                <div className="flex md:block items-center justify-between text-xs">
                  <span className="md:hidden text-slate-500 font-semibold uppercase text-[10px]">
                    Created:
                  </span>
                  <span className="text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex md:block justify-end gap-2 text-right pt-2 md:pt-0">
                  <div className="flex justify-end gap-2.5">
                    <Link
                      href={`/items/${item._id}`}
                      className="p-2 border border-white/10 hover:border-primary-cyan/40 hover:bg-cyan-950/10 text-slate-400 hover:text-primary-cyan rounded-lg transition-all"
                      title="View Details"
                    >
                      <FiEye size={15} />
                    </Link>
                    <DeleteModal item={item} onDeleted={fetchUserProducts} />
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
