"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FiSearch,
  FiSliders,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
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

function ExploreTerminal() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State initialized from URL queries or default
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All",
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minRating, setMinRating] = useState(
    searchParams.get("minRating") || "",
  );
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  // Apply filters on Submit or input change
  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

      // Build query string
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category && category !== "All") params.append("category", category);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (minRating) params.append("minRating", minRating);
      if (sort) params.append("sort", sort);
      params.append("page", page.toString());
      params.append("limit", "8"); // 8 per page (perfect for 4 columns desktop layout)

      // Sync url parameters
      router.replace(`/explore?${params.toString()}`, { scroll: false });

      const res = await fetch(
        `${backendUrl}/api/products?${params.toString()}`,
      );
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalProducts(data.pagination?.totalProducts || 0);
      } else {
        toast.error("Failed to query catalog.");
      }
    } catch (err) {
      console.error("Explore Fetch Error:", err);
      toast.error("Unable to reach backend service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [category, sort, page]); // Re-fetch on filter selection changes, manual search requires click/enter

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchFilteredProducts();
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setSort("newest");
    setPage(1);
    router.push("/explore");
  };

  // Render Stars helper
  const renderStars = (rating: number) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(
          <span key={i} className="text-yellow-400">
            ★
          </span>,
        );
      } else {
        stars.push(
          <span key={i} className="text-slate-600">
            ★
          </span>,
        );
      }
    }
    return <div className="flex gap-0.5">{stars}</div>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full grow flex flex-col lg:flex-row gap-8 bg-[#090d16]">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-64 shrink-0 space-y-6">
        <div className="glass-panel border border-white/5 bg-white/5 p-6 rounded-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5 uppercase tracking-wider">
              <FiSliders className="text-primary-cyan" /> Filters
            </h3>
            <button
              onClick={handleClearFilters}
              className="text-[10px] font-semibold text-primary-cyan hover:underline cursor-pointer"
            >
              Reset All
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-cyan focus:border-transparent"
            >
              <option value="All" className="bg-[#090d16]">
                All Categories
              </option>
              <option value="Wearables" className="bg-[#090d16]">
                Wearables
              </option>
              <option value="Robotics" className="bg-[#090d16]">
                Robotics
              </option>
              <option value="Smart Home" className="bg-[#090d16]">
                Smart Home
              </option>
              <option value="Neural Tech" className="bg-[#090d16]">
                Neural Tech
              </option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Price Limits ($)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                className="w-1/2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-cyan"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                className="w-1/2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-cyan"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Minimum Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-cyan focus:border-transparent"
            >
              <option value="" className="bg-[#090d16]">
                Any Rating
              </option>
              <option value="4.5" className="bg-[#090d16]">
                4.5 ★ & above
              </option>
              <option value="4.0" className="bg-[#090d16]">
                4.0 ★ & above
              </option>
              <option value="3.0" className="bg-[#090d16]">
                3.0 ★ & above
              </option>
            </select>
          </div>

          {/* Sort Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Sort Telemetry
            </label>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-cyan focus:border-transparent"
            >
              <option value="newest" className="bg-[#090d16]">
                Newest Added
              </option>
              <option value="price_asc" className="bg-[#090d16]">
                Price: Low to High
              </option>
              <option value="price_desc" className="bg-[#090d16]">
                Price: High to Low
              </option>
              <option value="rating_desc" className="bg-[#090d16]">
                Top Rated
              </option>
              <option value="name_asc" className="bg-[#090d16]">
                Alphabetical (A-Z)
              </option>
            </select>
          </div>

          <button
            onClick={() => {
              setPage(1);
              fetchFilteredProducts();
            }}
            className="w-full py-2 bg-primary-cyan text-[#090d16] font-semibold text-xs rounded-lg hover:bg-cyan-400 transition-colors cursor-pointer text-center"
          >
            Apply Filters
          </button>
        </div>
      </aside>

      {/* Main Listing Area */}
      <main className="grow space-y-6">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <FiSearch />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search gadgets (e.g. AeroGlass, companion, ring...)"
              className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>
            Found <span className="text-white font-bold">{totalProducts}</span>{" "}
            telemetry listings
          </span>
          <span className="flex items-center gap-1">
            <FiGrid /> Grid view active
          </span>
        </div>

        {/* Catalog Grid */}
        {loading ? (
          /* Skeleton Loader (4 per row desktop) */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, idx) => (
              <div
                key={idx}
                className="glass-panel border border-white/5 bg-white/5 rounded-xl h-96 overflow-hidden flex flex-col justify-between p-5 space-y-4"
              >
                <div className="w-full h-40 bg-white/5 rounded-lg animate-pulse"></div>
                <div className="space-y-2 grow">
                  <div className="h-4 bg-white/10 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-white/5 rounded animate-pulse w-full"></div>
                  <div className="h-3 bg-white/5 rounded animate-pulse w-5/6"></div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-4 bg-white/10 rounded animate-pulse w-1/4"></div>
                  <div className="h-4 bg-white/10 rounded animate-pulse w-1/4"></div>
                </div>
                <div className="h-8 bg-white/5 rounded-lg animate-pulse w-full"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="glass-panel border border-white/5 bg-white/5 text-center py-20 rounded-xl space-y-3">
            <h3 className="text-lg font-bold text-white">
              No Telemetry Listings Found
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try clearing search parameters or adjusting active filter limits.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-white/5 rounded border border-white/10 text-xs font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer mt-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {products.map((item) => (
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

                <div className="p-5 flex flex-col grow justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-white line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.shortDescription}
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-primary-emerald">
                        ${item.price}
                      </span>
                      {renderStars(item.rating)}
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
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-8">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 border border-white/10 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
            >
              <FiChevronLeft />
            </button>
            <span className="text-xs text-slate-400">
              Terminal Page <span className="text-white font-bold">{page}</span>{" "}
              of <span className="text-white font-bold">{totalPages}</span>
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-2 border border-white/10 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="grow flex items-center justify-center bg-[#090d16] py-20 text-slate-400 text-xs">
          Initializing terminal catalog...
        </div>
      }
    >
      <ExploreTerminal />
    </Suspense>
  );
}
