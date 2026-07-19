import Link from "next/link";
import { FiCpu, FiGithub, FiTwitter, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaDiscord } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-[#05070c] border-t border-white/5 text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white group">
              <FiCpu className="text-primary-cyan text-xl group-hover:rotate-45 transition-transform duration-300" />
              <span>MODERN <span className="text-primary-cyan">AI</span> SHOP</span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500">
              Forging the interface of tomorrow. Discover custom cybernetics, intelligent robotics, and wearable smart integrations.
            </p>
            <div className="flex items-center gap-4 text-slate-500">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-cyan transition-colors duration-200">
                <FiGithub size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-cyan transition-colors duration-200">
                <FiTwitter size={18} />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-cyan transition-colors duration-200">
                <FaDiscord size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Shop</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-primary-cyan transition-colors duration-200">Home</Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-primary-cyan transition-colors duration-200">Explore Gadgets</Link>
              </li>
              <li>
                <Link href="/explore?category=Wearables" className="hover:text-primary-cyan transition-colors duration-200">Wearables</Link>
              </li>
              <li>
                <Link href="/explore?category=Robotics" className="hover:text-primary-cyan transition-colors duration-200">Robotics</Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Company</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-primary-cyan transition-colors duration-200">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-cyan transition-colors duration-200">Contact</Link>
              </li>
              <li>
                <Link href="/about#privacy" className="hover:text-primary-cyan transition-colors duration-200">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/about#terms" className="hover:text-primary-cyan transition-colors duration-200">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">HQ Terminal</h3>
            <ul className="space-y-3 text-xs text-slate-500">
              <li className="flex items-start gap-2">
                <FiMapPin className="text-primary-cyan mt-0.5" />
                <span>1024 Quantum Drive, Sector 7, Cyber City, CC 94016</span>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone className="text-primary-cyan" />
                <span>+1 (555) 019-2831</span>
              </li>
              <li className="flex items-center gap-2">
                <FiMail className="text-primary-cyan" />
                <span>support@modernaishop.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4">
          <p>© 2026 Modern AI Shop Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/about#privacy" className="hover:underline">Privacy</Link>
            <Link href="/about#terms" className="hover:underline">Terms</Link>
            <Link href="/contact" className="hover:underline">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
