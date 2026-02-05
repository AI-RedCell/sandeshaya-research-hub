import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { isMobileDevice } from '@/hooks/use-mobile';

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
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectHandled, setRedirectHandled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set persistence for mobile redirect flow
  useEffect(() => {
    const setupPersistence = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (err) {
        console.error('[Auth] Persistence error:', err);
      }
    };

    setupPersistence();
  }, []);

  // Handle OAuth redirect result (mobile flow)
  useEffect(() => {
    let isMounted = true;

    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);

        if (!isMounted) return;

        setRedirectHandled(true);
      } catch (err: unknown) {
        if (!isMounted) return;

        const error = err as { code?: string; message?: string };
        console.error('[Auth] Redirect error:', error.code, error.message);

        // Handle specific errors
        if (error.code === 'auth/popup-blocked') {
          setError('Popup was blocked. Please enable popups for this site.');
        } else if (error.code === 'auth/cancelled-popup-request') {
          setError('Sign-in was cancelled. Please try again.');
        } else {
          setError(error.message || 'Authentication error occurred');
        }

        setRedirectHandled(true);
      }
    };

    handleRedirectResult();

    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isMounted) return;

      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          // Check if user document exists
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            // First-time user: create document
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
            // Existing user: load document
            const existingData = userDoc.data() as UserData;
            setUserData(existingData);
          }
        } catch (err) {
          console.error('[Auth] Firestore error:', err);
          // Allow user to proceed even if Firestore fails
          setUserData({
            name: firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            emailVerified: firebaseUser.emailVerified,
            submitted: false,
            createdAt: null,
            submittedAt: null,
          });
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Google Sign-In with mobile/desktop detection
  const signInWithGoogle = async () => {
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');

      // Add prompt to force consent screen
      provider.setCustomParameters({
        'prompt': 'consent'
      });

      const isMobile = isMobileDevice();

      if (isMobile) {
        // MOBILE: Use redirect (required for mobile browsers)
        await signInWithRedirect(auth, provider);
        // getRedirectResult will handle the result when page loads
      } else {
        // DESKTOP: Use popup (better UX)
        await signInWithPopup(auth, provider);
      }
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      const errorCode = error.code || 'unknown';
      const errorMessage = error.message || 'Google sign-in failed';

      console.error('[Auth] SignIn error:', errorCode, errorMessage);

      // User-friendly error messages
      let userMessage = errorMessage;

      switch (errorCode) {
        case 'auth/popup-closed-by-user':
          userMessage = 'You closed the sign-in popup. Please try again.';
          break;
        case 'auth/popup-blocked':
          userMessage = 'Popup was blocked. Please enable popups and try again.';
          break;
        case 'auth/cancelled-popup-request':
          userMessage = 'Sign-in was cancelled. Please try again.';
          break;
        case 'auth/account-exists-with-different-credential':
          userMessage = 'This email is already registered with a different method.';
          break;
        case 'auth/network-request-failed':
          userMessage = 'Network error. Please check your internet connection.';
          break;
        case 'auth/operation-not-allowed':
          userMessage = 'Google sign-in is not enabled. Please contact support.';
          break;
      }

      setError(userMessage);
      throw new Error(userMessage);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserData(null);
      setError(null);
    } catch (err) {
      console.error('[Auth] Sign out error:', err);
      throw err;
    }
  };

  const isFullyLoaded = !loading && redirectHandled;

  const value: AuthContextType = {
    user,
    userData,
    loading: !isFullyLoaded,
    signInWithGoogle,
    signOut,
    hasSubmitted: userData?.submitted ?? false,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
