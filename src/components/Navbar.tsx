"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { FiMenu, FiX, FiCpu, FiZap, FiLogOut, FiList, FiPlusSquare, FiUser } from "react-icons/fi";
import { toast } from "react-toastify";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Successfully logged out!");
            // Redirect or refresh
            window.location.href = "/";
          }
        }
      });
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Failed to log out.");
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" }
  ];

  const loggedInLinks = [
    { name: "Add Gadget", href: "/items/add", icon: <FiPlusSquare className="inline mr-1" /> },
    { name: "Manage", href: "/items/manage", icon: <FiList className="inline mr-1" /> }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#090d16]/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white group">
              <FiCpu className="text-primary-cyan text-2xl group-hover:rotate-45 transition-transform duration-300" />
              <span>
                MODERN <span className="text-primary-cyan">AI</span> SHOP
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary-cyan duration-200 ${
                  pathname === link.href ? "text-primary-cyan border-b-2 border-primary-cyan pb-1" : "text-slate-300"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {session &&
              loggedInLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary-cyan duration-200 ${
                    pathname === link.href ? "text-primary-cyan border-b-2 border-primary-cyan pb-1" : "text-slate-300"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
          </div>

          {/* Desktop Right Side Auth Options */}
          <div className="hidden md:flex items-center gap-4">
            {isPending ? (
              <div className="w-16 h-8 bg-white/5 rounded animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white">
                  <FiUser className="text-primary-cyan" />
                  <span>{session.user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/20 text-red-400 text-xs font-semibold transition-all duration-200 cursor-pointer"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary-cyan text-[#090d16] hover:bg-cyan-400 transition-all duration-200 glow-cyan"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2 focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#090d16]/95 border-b border-white/5 px-2 pt-2 pb-4 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                pathname === link.href ? "bg-white/5 text-primary-cyan" : "text-slate-300 hover:bg-white/5"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {session && (
            <>
              <div className="h-px bg-white/5 my-2"></div>
              {loggedInLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    pathname === link.href ? "bg-white/5 text-primary-cyan" : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </>
          )}

          <div className="h-px bg-white/5 my-2"></div>

          {/* Mobile Auth Options */}
          <div className="px-3 py-2">
            {session ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-300 font-semibold">
                  <FiUser className="text-primary-cyan" />
                  <span>Logged in as {session.user.name}</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-950/40 border border-red-500/20 text-red-400 text-sm font-semibold transition-all duration-200 cursor-pointer"
                >
                  <FiLogOut />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-md text-slate-300 hover:bg-white/5 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-md bg-primary-cyan text-[#090d16] font-semibold hover:bg-cyan-400 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
