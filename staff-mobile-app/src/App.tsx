import React, { useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  GoogleAuthProvider
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { 
  Lock, 
  Mail, 
  Loader2, 
  LogOut, 
  AlertCircle,
  ShieldCheck,
  LayoutDashboard,
  Clock,
  DollarSign,
  Menu,
  Users,
  MapPin,
  Layers,
  FileText,
  TrendingUp,
  Upload,
  Sun,
  Moon
} from 'lucide-react';

// Import our modular components
import Dashboard from './components/Dashboard';
import StaffDirectory from './components/StaffDirectory';
import AttendanceManager from './components/AttendanceManager';
import AdvancesManager from './components/AdvancesManager';
import SiteAllocationManager from './components/SiteAllocationManager';
import ExpenseLedger from './components/ExpenseLedger';
import SalaryBoard from './components/SalaryBoard';
import ReportsEngine from './components/ReportsEngine';
import BulkImporter from './components/BulkImporter';
import { clearStaffCache } from './hooks/useStaff';
import { clearSiteAllocationsCache } from './hooks/useSiteAllocations';
import { clearAdvancesCache } from './hooks/useAdvances';
import { clearExpensesCache } from './hooks/useExpenses';
import { clearAttendanceCache } from './hooks/useAttendance';

const GOLD = '#c5a059';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  
  // Navigation states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'attendance' | 'advances' | 'more'>('dashboard');
  const [activeSubModule, setActiveSubModule] = useState<'directory' | 'allocations' | 'expenses' | 'salary' | 'reports' | 'import' | null>(null);

  // Input states for Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Offline status tracking
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Theme management (defaulting to 'light')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const verifyAdminAndLoad = async (firebaseUser: FirebaseUser) => {
    try {
      console.log("Starting admin check for:", firebaseUser.email);
      setAuthError('');
      const adminDocRef = doc(db, 'admins', firebaseUser.email!);
      const adminDoc = await getDoc(adminDocRef);
      
      console.log("Admin document exists:", adminDoc.exists());
      if (adminDoc.exists()) {
        console.log("Admin document data:", adminDoc.data());
      }

      if (adminDoc.exists() && adminDoc.data()?.role === 'admin') {
        console.log("Access GRANTED for admin:", firebaseUser.email);
        setAdminProfile({
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || adminDoc.data()?.fullName || 'Administrator'
        });
      } else {
        console.warn("Access DENIED. Role is not admin or document missing.");
        setAuthError('Access Denied. Administrator privileges required.');
        await signOut(auth);
        setUser(null);
        setAdminProfile(null);
      }
    } catch (err) {
      console.error("Error verifying admin credentials:", err);
      setAuthError('Error validating admin credentials.');
      await signOut(auth);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        await verifyAdminAndLoad(currentUser);
      } else {
        setUser(null);
        setAdminProfile(null);
        clearStaffCache();
        clearSiteAllocationsCache();
        clearAdvancesCache();
        clearExpensesCache();
        clearAttendanceCache();
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setAuthError('Invalid administrator credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    
    // Call signInWithPopup synchronously as the first action
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Logged in with popup successfully:", result.user);
      })
      .catch((err: any) => {
        console.warn("Popup login failed, checking fallback:", err);
        if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
          setAuthError('Sign-in cancelled.');
          setAuthLoading(false);
          return;
        }
        
        if (err.code === 'auth/popup-blocked' || err.message?.includes('popup')) {
          setAuthError('Sign-in popup blocked. Please allow popups for this site.');
          setAuthLoading(false);
        } else {
          setAuthError(`Google authentication failed: ${err.message || err.code}`);
          setAuthLoading(false);
        }
      });

    setAuthLoading(true);
    setAuthError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white select-none">
        <Loader2 className="animate-spin w-10 h-10" style={{ color: GOLD }} />
        <p className="mt-4 text-xs uppercase tracking-widest text-neutral-400 font-bold">Verifying Admin privileges...</p>
      </div>
    );
  }

  // --- LOGIN VIEW ---
  if (!user || !adminProfile) {
    return (
      <div className="min-h-screen flex flex-col justify-center bg-neutral-950 px-6 py-12 relative overflow-hidden font-sans select-none">
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            className="p-2 bg-neutral-900 border border-white/5 text-[#c5a059] hover:bg-neutral-800 rounded-xl transition-all cursor-pointer"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
          </button>
        </div>
        <div className="absolute top-[-20%] left-[-10%] w-[350px] h-[350px] bg-[#c5a059]/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md mx-auto relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#c5a059]/10 border border-[#c5a059]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden shadow-glow-gold p-2">
              <img src="/favicon.png" alt="Sonu Enterprises" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">SE Staff Admin</h1>
            <p className="text-xs uppercase tracking-widest text-neutral-400 mt-1">Mobile Management Portal</p>
          </div>

          {authError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl text-xs mb-6 flex items-start gap-3 leading-relaxed">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <div className="bg-neutral-900 border border-white/5 p-6 rounded-2xl shadow-xl">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@sonu-builders.in"
                    className="w-full bg-neutral-950 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#c5a059]/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400">Admin Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-neutral-950 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#c5a059]/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-[#c5a059] text-black font-bold py-3.5 rounded-xl uppercase tracking-widest text-xs shadow-lg mt-6 flex items-center justify-center gap-2 cursor-pointer"
              >
                {authLoading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Access Command'}
              </button>
            </form>

            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink-0 mx-4 text-[9px] uppercase tracking-widest text-neutral-500">Or Link With</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={authLoading}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/5 py-3 rounded-xl flex items-center justify-center gap-3 text-xs uppercase tracking-widest font-bold text-white cursor-pointer"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
              Google Workspace
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle module routing
  const navigateToModule = (module: 'directory' | 'attendance' | 'advances' | 'allocations' | 'expenses' | 'salary' | 'reports' | 'import') => {
    if (module === 'attendance') {
      setActiveTab('attendance');
      setActiveSubModule(null);
    } else if (module === 'advances') {
      setActiveTab('advances');
      setActiveSubModule(null);
    } else {
      setActiveSubModule(module);
    }
  };

  const handleSubModuleBack = () => {
    setActiveSubModule(null);
  };

  // Render sub-modules if active
  if (activeSubModule) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col select-none">
        {!isOnline && (
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-black text-[10px] uppercase font-black py-2.5 px-4 text-center tracking-wider flex items-center justify-center gap-1.5 z-[100] border-b border-black/10">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Offline Mode — Running on local database cache. Edits sync automatically.</span>
          </div>
        )}
        <div className="flex-grow p-5 overflow-y-auto">
          {activeSubModule === 'directory' && <StaffDirectory onBack={handleSubModuleBack} />}
          {activeSubModule === 'allocations' && <SiteAllocationManager onBack={handleSubModuleBack} adminName={adminProfile.displayName} />}
          {activeSubModule === 'expenses' && <ExpenseLedger onBack={handleSubModuleBack} adminEmail={adminProfile.email} />}
          {activeSubModule === 'salary' && <SalaryBoard onBack={handleSubModuleBack} adminName={adminProfile.displayName} />}
          {activeSubModule === 'reports' && <ReportsEngine onBack={handleSubModuleBack} />}
          {activeSubModule === 'import' && <BulkImporter onBack={handleSubModuleBack} />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col pb-20 select-none">
      {!isOnline && (
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-black text-[10px] uppercase font-black py-2.5 px-4 text-center tracking-wider flex items-center justify-center gap-1.5 z-[100] border-b border-black/10">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Offline Mode — Running on local database cache. Edits sync automatically.</span>
        </div>
      )}
      {/* Header bar */}
      <header className="bg-neutral-900 border-b border-white/5 py-4 px-6 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center overflow-hidden shadow-glow-gold p-1">
            <img src="/favicon.png" alt="Sonu Enterprises" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-sm font-bold m-0 leading-none">Staff Control</h1>
            <span className="text-[9px] text-[#c5a059] uppercase tracking-wider font-semibold">Admin Panel</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            className="p-2 bg-white/5 hover:bg-white/10 text-[#c5a059] rounded-lg transition-colors cursor-pointer border border-white/5"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => signOut(auth)}
            className="p-2 bg-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors cursor-pointer border border-white/5"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Tab Panels */}
      <main className="flex-grow p-5 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <Dashboard onNavigate={navigateToModule} adminName={adminProfile.displayName} />
        )}
        
        {activeTab === 'attendance' && (
          <AttendanceManager onBack={() => setActiveTab('dashboard')} />
        )}

        {activeTab === 'advances' && (
          <AdvancesManager onBack={() => setActiveTab('dashboard')} adminName={adminProfile.displayName} />
        )}

        {activeTab === 'more' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold font-serif text-white">More Options</h2>
              <p className="text-xs text-neutral-400 mt-1">Access administrative settings and ledgers</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'directory' as const, label: 'Staff Roster', icon: Users, desc: 'Profiles & salaries' },
                { id: 'allocations' as const, label: 'Allocations', icon: MapPin, desc: 'Assign crew to sites' },
                { id: 'expenses' as const, label: 'Expenses Ledger', icon: Layers, desc: 'Site cash logs' },
                { id: 'salary' as const, label: 'Salary/Payroll', icon: FileText, desc: 'Generate payslips' },
                { id: 'reports' as const, label: 'Reports Hub', icon: TrendingUp, desc: 'Excel & PDF exports' },
                { id: 'import' as const, label: 'Bulk Import', icon: Upload, desc: 'Upload spreadsheets' }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateToModule(item.id)}
                    className="bg-neutral-900 border border-white/5 p-4 rounded-xl text-left flex flex-col justify-between h-28 hover:border-white/10 active:scale-98 transition-all cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center text-[#c5a059]">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block leading-none">{item.label}</span>
                      <span className="text-[8px] text-neutral-500 block mt-1 uppercase font-bold">{item.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Navigation footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-white/5 h-16 flex items-center justify-around px-6 z-50">
        <button
          onClick={() => { setActiveTab('dashboard'); setActiveSubModule(null); }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-[#c5a059]' : 'text-neutral-500'} cursor-pointer`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Dashboard</span>
        </button>
        
        <button
          onClick={() => { setActiveTab('attendance'); setActiveSubModule(null); }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'attendance' ? 'text-[#c5a059]' : 'text-neutral-500'} cursor-pointer`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Attendance</span>
        </button>
        
        <button
          onClick={() => { setActiveTab('advances'); setActiveSubModule(null); }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'advances' ? 'text-[#c5a059]' : 'text-neutral-500'} cursor-pointer`}
        >
          <DollarSign className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Advances</span>
        </button>
        
        <button
          onClick={() => { setActiveTab('more'); setActiveSubModule(null); }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'more' ? 'text-[#c5a059]' : 'text-neutral-500'} cursor-pointer`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">More</span>
        </button>
      </footer>
    </div>
  );
}
