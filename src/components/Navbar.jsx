import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  IdentificationIcon, 
  UserPlusIcon,
  PhotoIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/');
  };

  // Don't show navbar on login/register pages
  if (['/', '/register'].includes(location.pathname)) {
    return null;
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Aadhaar', path: '/aadhaar', icon: IdentificationIcon },
    { name: 'Students', path: '/add-student', icon: UserPlusIcon },
    { name: 'Background', path: '/change-background', icon: PhotoIcon },
  ];

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${scrolled ? 'pt-4' : 'pt-6'}`}>
        <nav 
          className={`
            mx-4 w-full max-w-7xl rounded-2xl border border-white/10 
            bg-slate-900/90 backdrop-blur-md shadow-lg shadow-black/40 backdrop-saturate-150
            transition-all duration-300 ${scrolled ? 'py-2 px-4' : 'py-3 px-6'}
          `}
        >
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer group" 
              onClick={() => navigate('/dashboard')}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-pink-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
                <span className="relative text-xl font-bold bg-linear-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                  SmartApp
                </span>
              </div>
            </div>

            {/* Desktop Navigation - HIDDEN */}
            <div className="hidden space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                      isActive
                        ? 'text-white bg-white/10 shadow-inner'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                    <span>{item.name}</span>
                  </div>
                </NavLink>
              ))}
            </div>

            {/* Desktop Right Side - HIDDEN */}
            <div className="hidden items-center">
              <button
                onClick={handleLogout}
                className="ml-4 flex items-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>

            {/* Mobile Menu Button - VISIBLE ALWAYS */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 z-60 backdrop-blur-sm transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer (Right Side) */}
      <div 
        className={`fixed top-0 right-0 h-full w-72 bg-slate-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-70 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-bold bg-linear-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
              Menu
            </span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-2 flex-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                  }`
                }
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10">
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-base font-medium text-white bg-red-500/80 hover:bg-red-500 transition-all duration-200 shadow-lg shadow-red-500/20"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
