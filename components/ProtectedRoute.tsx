import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, role, loading, logOut } = useAuth();

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
            <div className="w-12 h-12 border-4 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin"></div>
        </div>
    );

    if (!user) return <Navigate to="/login" replace />;

    if (role === 'pending') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] p-4">
                <div className="bg-white border border-stone-200/80 p-8 rounded-3xl max-w-md w-full text-center shadow-xl">
                    <h2 className="text-2xl font-serif font-bold text-luxury-gold mb-4">Approval Pending</h2>
                    <p className="text-stone-600 text-sm mb-6">
                        Your account <span className="font-mono text-xs bg-stone-100 border border-stone-200 px-2 py-0.5 rounded text-stone-800">{user.email}</span>
                        has been registered but is awaiting administrator approval.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={logOut}
                            className="w-full bg-luxury-gold text-white hover:bg-luxury-gold/90 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-opacity cursor-pointer shadow-md"
                        >
                            Sign Out & Check Later
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (role !== 'admin' && role !== 'staff') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] p-4">
                <div className="bg-white border border-stone-200/80 p-8 rounded-3xl max-w-md w-full text-center shadow-xl">
                    <h2 className="text-2xl font-serif font-bold text-red-500 mb-4">Access Denied</h2>
                    <p className="text-stone-600 text-sm mb-6">
                        You are logged in as <span className="font-mono text-xs bg-stone-100 border border-stone-200 px-2 py-0.5 rounded text-stone-800">{user.email}</span>,
                        but you do not have administrative or staff privileges.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={logOut}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-colors cursor-pointer shadow-md"
                        >
                            Sign Out
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="w-full border border-stone-300 text-stone-700 hover:bg-stone-100 py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-colors cursor-pointer"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
