import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Settings, Home, Sparkles, BookOpen } from 'lucide-react';
import '../../styles/glassmorphism.css';

export const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="glass sticky top-0 z-40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg glow-sm group-hover:glow transition-all" />
            <span className="text-xl font-bold gradient-text">Digital Creator</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${isActive('/')
                  ? 'bg-purple-500 text-white glow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
            >
              <span>Dashboard</span>
            </Link>

            <Link
              to="/knowledge-vault"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${isActive('/knowledge-vault')
                  ? 'bg-purple-500 text-white glow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
            >
              <BookOpen size={18} />
              <span>Knowledge Vault</span>
            </Link>

            <Link
              to="/resources"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${isActive('/resources')
                  ? 'bg-purple-500 text-white glow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
            >
              <BookOpen size={18} />
              <span>Resources</span>
            </Link>

            <Link
              to="/settings"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${isActive('/settings')
                  ? 'bg-purple-500 text-white glow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
            >
              <Settings size={18} />
              <span>Settings</span>
            </Link>

            <div className="ml-3 pl-3 border-l border-white/20">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                <Sparkles size={14} className="text-purple-400" />
                <span className="text-xs font-semibold text-white">Premium</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
