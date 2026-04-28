import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Home, UserPlus, LogIn, Package, LayoutDashboard, LogOut, Users, Wallet, Settings, Shield, ChevronDown, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const publicLinks = [
    { path: '/', label: 'Beranda', icon: Home },
    { path: '/plans', label: 'Paket Investasi', icon: Package },
    { path: '/register', label: 'Daftar', icon: UserPlus },
    { path: '/login', label: 'Masuk', icon: LogIn },
  ];

  const memberLinks = [
    { path: '/member', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/member/deposit', label: 'Deposit', icon: Wallet },
    { path: '/member/reinvest', label: 'Re-Invest', icon: RefreshCw },
    { path: '/member/withdraw', label: 'Withdraw', icon: Wallet },
    { path: '/member/referral', label: 'Referral', icon: Users },
    { path: '/member/bank', label: 'Rekening', icon: Settings },
  ];

  const adminLinks = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/deposits', label: 'Deposit', icon: Wallet },
    { path: '/admin/withdrawals', label: 'Withdraw', icon: Wallet },
    { path: '/admin/plans', label: 'Plan', icon: Package },
    { path: '/admin/referral', label: 'Referral', icon: Users },
    { path: '/admin/bank', label: 'Rekening', icon: Settings },
  ];

  const navLinks = user ? (isAdmin ? adminLinks : memberLinks) : publicLinks;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-slate-900 font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Dana Masa Depan
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                  }`}
                >
                  <link.icon size={16} />
                  {link.label}
                </Link>
              ))}
              {user && (
                <div className="relative ml-2">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    <div className="w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-xs">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[100px] truncate">{user.fullName}</span>
                    <ChevronDown size={14} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1">
                      <Link
                        to={isAdmin ? '/admin/profile' : '/member/profile'}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                      >
                        <UserPlus size={14} /> Edit Profil
                      </Link>
                      <Link
                        to={isAdmin ? '/admin/password' : '/member/password'}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                      >
                        <Shield size={14} /> Edit Kata Sandi
                      </Link>
                      <button
                        onClick={() => { logout(); setDropdownOpen(false); navigate('/'); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300"
                      >
                        <LogOut size={14} /> Keluar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}
            {user && (
              <>
                <Link
                  to={isAdmin ? '/admin/profile' : '/member/profile'}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                >
                  <UserPlus size={18} /> Edit Profil
                </Link>
                <Link
                  to={isAdmin ? '/admin/password' : '/member/password'}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                >
                  <Shield size={18} /> Edit Kata Sandi
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false); navigate('/'); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-slate-800"
                >
                  <LogOut size={18} /> Keluar
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-amber-500 rounded-md flex items-center justify-center">
                <span className="text-slate-900 font-bold text-sm">P</span>
              </div>
              <span className="font-bold text-slate-200">Dana Masa Depan</span>
            </div>
            <p className="text-slate-500 text-sm text-center">
              &copy; {new Date().getFullYear()} Dana Masa Depan adalah Platform investasi terpercaya.
            </p>
            <div className="flex gap-4 text-sm text-slate-500">
              <Link to="/" className="hover:text-amber-400 transition-colors">Beranda</Link>
              <Link to="/plans" className="hover:text-amber-400 transition-colors">Plan</Link>
              <Link to="/login" className="hover:text-amber-400 transition-colors">Masuk</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
