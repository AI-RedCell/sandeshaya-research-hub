import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserData {
  name: string;
  email: string;
  emailVerified: boolean;
  submitted: boolean;
  createdAt: unknown;
  submittedAt: unknown | null;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  hasSubmitted: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          // Check if user document exists
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            // Create new user document
            const newUserData: UserData = {
              name: firebaseUser.displayName || '',
              email: firebaseUser.email || '',
              emailVerified: firebaseUser.emailVerified,
              submitted: false,
              createdAt: serverTimestamp(),
              submittedAt: null,
            };
            await setDoc(userDocRef, newUserData);
            setUserData(newUserData);
          } else {
            setUserData(userDoc.data() as UserData);
          }
        } catch (error) {
          console.error('Error fetching/creating user data:', error);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    // Handle Redirect Result
    import('firebase/auth').then(({ getRedirectResult }) => {
      getRedirectResult(auth)
        .then((result) => {
          if (result?.user) {
            console.log("Redirect Login Successful:", result.user.email);
          }
        })
        .catch((error) => {
          console.error("Redirect Login Error:", error);
        });
    });

    return () => unsubscribe();
  }, []);

  // Sign in with Google (Switched to Redirect for better stability)
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // We use Redirect instead of Popup to avoid "popup-closed-by-user" errors
      await import('firebase/auth').then(({ signInWithRedirect }) => {
        return signInWithRedirect(auth, provider);
      });
      // Logic continues in onAuthStateChanged after redirect
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setUserData(null);
  };

  const value: AuthContextType = {
    user,
    userData,
    loading,
    signInWithGoogle,
    signOut,
    hasSubmitted: userData?.submitted ?? false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
