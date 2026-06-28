import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signOut, 
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export type UserRole = 'admin' | 'staff' | 'user' | 'pending';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  phoneNumber?: string;
  createdAt: string;
  lastLogin: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  role: UserRole | null;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const determineRoleAndFetchProfile = async (firebaseUser: FirebaseUser) => {
    if (!firebaseUser.email) return;

    try {
      // 1. Check if they are Admin
      const adminDocRef = doc(db, 'admins', firebaseUser.email);
      const adminDoc = await getDoc(adminDocRef);

      if (adminDoc.exists()) {
        const adminData = adminDoc.data();
        if (adminData?.role === 'admin') {
          setRole('admin');
          setProfile({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'Administrator',
            photoURL: firebaseUser.photoURL || '',
            role: 'admin',
            createdAt: adminData.createdAt || new Date().toISOString(),
            lastLogin: new Date().toISOString()
          });
          return;
        } else if (adminData?.role === 'pending') {
          setRole('pending');
          setProfile(null);
          return;
        }
      }

      // 2. Check if they are Staff
      const staffDocRef = doc(db, 'staff', firebaseUser.email);
      const staffDoc = await getDoc(staffDocRef);

      if (staffDoc.exists() && staffDoc.data()?.status === 'active') {
        setRole('staff');
        setProfile({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: staffDoc.data()?.name || firebaseUser.displayName || 'Staff Member',
          photoURL: firebaseUser.photoURL || '',
          role: 'staff',
          phoneNumber: staffDoc.data()?.phone,
          createdAt: staffDoc.data()?.createdAt || new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
        return;
      }

      // 3. Otherwise, they are a normal client/user
      setRole('user');
      const userDocRef = doc(db, 'users', firebaseUser.email);
      const userDoc = await getDoc(userDocRef);

      let profileData: UserProfile;
      if (userDoc.exists()) {
        const data = userDoc.data();
        profileData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || data.displayName || 'Client',
          photoURL: firebaseUser.photoURL || data.photoURL || '',
          role: 'user',
          phoneNumber: firebaseUser.phoneNumber || data.phoneNumber || '',
          createdAt: data.createdAt || new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
      } else {
        // Create new user profile in Firestore
        profileData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'Client User',
          photoURL: firebaseUser.photoURL || '',
          role: 'user',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
      }

      // Save/Update in Firestore
      await setDoc(userDocRef, profileData, { merge: true });
      setProfile(profileData);

    } catch (error) {
      console.error('Error fetching role/profile:', error);
      setRole('user');
      setProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        await determineRoleAndFetchProfile(currentUser);
      } else {
        setUser(null);
        setProfile(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logOut = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, role, signInWithGoogle, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
