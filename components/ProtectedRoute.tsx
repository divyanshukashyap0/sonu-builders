import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                if (currentUser.email) {
                    try {
                        console.log('🔍 Checking admin status for:', currentUser.email);
                        const adminDocRef = doc(db, 'admins', currentUser.email);
                        const adminDoc = await getDoc(adminDocRef);

                        console.log('📄 Admin doc exists?', adminDoc.exists());
                        if (adminDoc.exists() && adminDoc.data()?.role === 'admin') {
                            console.log('✅ Access GRANTED - User is admin');
                            setIsAuthorized(true);
                            setIsPending(false);
                        } else {
                            // Check if they are a registered active staff member
                            console.log('🔍 Checking staff directory for:', currentUser.email);
                            const staffRef = collection(db, 'staff');
                            const q = query(staffRef, where('email', '==', currentUser.email), where('status', '==', 'active'));
                            const staffSnap = await getDocs(q);

                            if (!staffSnap.empty) {
                                console.log('✅ Access GRANTED - User is active staff');
                                setIsAuthorized(true);
                                setIsPending(false);
                            } else if (adminDoc.exists()) {
                                console.log('⏳ Access PENDING - Role is:', adminDoc.data()?.role);
                                setIsPending(true);
                                setIsAuthorized(false);
                            } else {
                                console.log('➕ Creating new pending admin entry');
                                await setDoc(adminDocRef, {
                                    email: currentUser.email,
                                    role: 'pending',
                                    createdAt: new Date().toISOString()
                                });
                                setIsPending(true);
                                setIsAuthorized(false);
                            }
                        }
                    } catch (error) {
                        console.error("❌ Error checking access status:", error);
                        setIsAuthorized(false);
                        setIsPending(false);
                    }
                }
            } else {
                setUser(null);
                setIsAuthorized(false);
                setIsPending(false);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!user) return <Navigate to="/admin-portal" replace />;

    if (isPending) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-orange-600 mb-4">Approval Pending</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Your account <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-1 rounded">{user.email}</span>
                        has been registered but is awaiting admin approval.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => signOut(auth)}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded transition-colors"
                        >
                            Sign Out & Check Later
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        You are logged in as <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-1 rounded">{user.email}</span>,
                        but you do not have administrator privileges.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => signOut(auth)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                        >
                            Sign Out
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 px-4 rounded transition-colors"
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
