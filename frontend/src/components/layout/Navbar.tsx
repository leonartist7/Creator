import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/Button';
import { LogOut, User, Settings } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg" />
            <span className="text-xl font-bold text-gray-900">Digital Creator</span>
          </Link>

          {/* Navigation */}
          {user && (
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                Dashboard
              </Link>
              <Link to="/projects" className="text-gray-700 hover:text-primary-600 transition-colors">
                Projects
              </Link>
              <Link to="/analytics" className="text-gray-700 hover:text-primary-600 transition-colors">
                Analytics
              </Link>

              {/* User menu */}
              <div className="flex items-center gap-3 ml-6 pl-6 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.subscriptionTier}</p>
                </div>

                <Link to="/settings">
                  <Button variant="ghost" size="sm">
                    <Settings size={18} />
                  </Button>
                </Link>

                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut size={18} />
                </Button>
              </div>
            </div>
          )}

          {/* Auth buttons for logged out users */}
          {!user && (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
