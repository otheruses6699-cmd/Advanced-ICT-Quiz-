import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Trophy, User as UserIcon, Settings } from "lucide-react";
import { useAuth } from "@/src/lib/auth";

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-violet-800/50 bg-violet-950/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400 group-hover:text-glow transition-all duration-300">
                &lt; ICT Quiz /&gt;
              </span>
            </Link>

            {user && (
              <div className="flex items-center gap-4 sm:gap-6">
                <Link
                  to="/"
                  className="text-violet-200 hover:text-pink-400 transition-colors hidden sm:flex items-center gap-2 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/leaderboard"
                  className="text-violet-200 hover:text-pink-400 transition-colors flex items-center gap-2 font-medium"
                >
                  <Trophy className="w-4 h-4" />
                  <span className="hidden sm:inline">Leaderboard</span>
                </Link>

                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="text-pink-400 border border-pink-500/50 bg-pink-500/10 px-3 py-1.5 rounded-full hover:bg-pink-500/20 box-glow-hover transition-all flex items-center gap-2 text-sm font-semibold"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                <div className="h-8 w-px bg-violet-800/50 hidden sm:block"></div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 text-sm">
                    <UserIcon className="w-4 h-4 text-violet-400" />
                    <span className="text-violet-200">Welcome, {user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-violet-400 hover:text-pink-400 transition-colors p-2 rounded-full hover:bg-violet-900/50"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      
      <footer className="py-6 border-t border-violet-900/50 text-center text-violet-500 text-sm">
        <p>Developed by <span className="text-pink-400/80">Abir Hossain Efad</span> &copy; {new Date().getFullYear()}</p>
        <p className="mt-1">Bepza Public School And College, Chittagong</p>
      </footer>
    </div>
  );
}
