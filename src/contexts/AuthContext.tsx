import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Detect if we should use popup (desktop or localhost) vs redirect (mobile on production)
const shouldUsePopup = (): boolean => {
  if (typeof window === 'undefined') return true;
  
  // DEBUG: Add ?redirect=1 to URL to force redirect mode for testing
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('redirect') === '1') {
    console.log("🧪 DEBUG: Forcing redirect flow via URL param");
    return false;
  }
  
  // Always use popup on localhost (redirect doesn't work reliably locally)
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
  if (isLocalhost) {
    console.log("🏠 Localhost detected - using popup flow");
    return true;
  }
  
  // On production: use popup for desktop, redirect for mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  console.log(isMobile ? "📱 Mobile detected" : "🖥️ Desktop detected");
  return !isMobile;
};

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
  const [redirectChecked, setRedirectChecked] = useState(false);

  // Helper function to fetch/create user data in Firestore
  const fetchOrCreateUserData = async (firebaseUser: User) => {
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const newUserData: UserData = {
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          emailVerified: firebaseUser.emailVerified,
          submitted: false,
          createdAt: serverTimestamp(),
          submittedAt: null,
        };
        await setDoc(userDocRef, newUserData);
        console.log("✓ New user document created:", firebaseUser.uid);
        return newUserData;
      } else {
        const existingData = userDoc.data() as UserData;
        console.log("✓ Existing user data loaded:", firebaseUser.uid, "submitted:", existingData.submitted);
        return existingData;
      }
    } catch (error) {
      console.error('✗ Error fetching/creating user data:', error);
      return {
        name: firebaseUser.displayName || '',
        email: firebaseUser.email || '',
        emailVerified: firebaseUser.emailVerified,
        submitted: false,
        createdAt: null,
        submittedAt: null,
      };
    }
  };

  // Setup auth state listener and handle redirect results
  useEffect(() => {
    let isComponentMounted = true;
    console.log("🔄 AuthProvider mounting...");

    // STEP 1: Check for redirect result FIRST (for mobile users returning from Google)
    const checkRedirectResult = async () => {
      try {
        console.log("🔍 Checking for redirect result...");
        const result = await getRedirectResult(auth);
        
        if (result?.user) {
          console.log("✓ Redirect Login Successful:", result.user.email);
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (credential) {
            console.log("✓ Google Access Token obtained from redirect");
          }
          // User data will be handled by onAuthStateChanged
        } else {
          console.log("ℹ️ No redirect result (normal page load or popup login)");
        }
      } catch (error: any) {
        if (error?.code) {
          console.error("✗ Redirect result error:", error.code, error.message);
        }
      } finally {
        if (isComponentMounted) {
          setRedirectChecked(true);
        }
      }
    };

    // Start checking redirect result
    checkRedirectResult();

    // STEP 2: Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isComponentMounted) return;
      
      console.log("🔄 Auth state changed:", firebaseUser?.email || "No user");
      
      if (firebaseUser) {
        setUser(firebaseUser);
        const data = await fetchOrCreateUserData(firebaseUser);
        if (isComponentMounted) {
          setUserData(data);
          setLoading(false);
        }
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      isComponentMounted = false;
      unsubscribe();
    };
  }, []);

  // Sign in with Google
  // Popup: localhost + desktop | Redirect: mobile on production
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    const usePopup = shouldUsePopup();
    
    try {
      if (usePopup) {
        console.log("🖥️ Using popup flow");
        const result = await signInWithPopup(auth, provider);
        
        const credential = GoogleAuthProvider.credentialFromResult(result);
        console.log("✓ Google Sign-In Successful:", result.user.email);
        if (credential?.accessToken) {
          console.log("✓ Access token obtained");
        }
      } else {
        console.log("📱 Using redirect flow (mobile on production)");
        await signInWithRedirect(auth, provider);
        // User will be redirected to Google, then back to the app
      }
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string };
      const errorCode = firebaseError.code || 'unknown';
      const errorMessage = firebaseError.message || 'Google sign-in failed';
      
      console.error("✗ Google Sign-In Error [" + errorCode + "]:", errorMessage);
      
      if (errorCode === 'auth/popup-closed-by-user') {
        throw new Error('You closed the sign-in popup. Please try again.');
      } else if (errorCode === 'auth/cancelled-popup-request') {
        throw new Error('Sign-in was cancelled. Please try again.');
      } else if (errorCode === 'auth/popup-blocked') {
        throw new Error('Popup was blocked. Please allow popups for this site.');
      } else if (errorCode === 'auth/account-exists-with-different-credential') {
        throw new Error('An account with this email already exists.');
      } else if (errorCode === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your internet connection.');
      }
      
      throw new Error(errorMessage);
    }
  };

  // Sign out user
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserData(null);
      console.log("✓ User signed out successfully");
    } catch (error) {
      console.error("✗ Error signing out:", error);
      throw error;
    }
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
