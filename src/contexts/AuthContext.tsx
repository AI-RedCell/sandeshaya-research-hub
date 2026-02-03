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
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectHandled, setRedirectHandled] = useState(false);

  // FIX 2: Set persistence to LOCAL (REQUIRED for mobile redirect auth)
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log("Persistence set to LOCAL");
      })
      .catch((error) => {
        console.error("Error setting persistence:", error);
      });
  }, []);

  // FIX 3: Handle redirect result ON APP LOAD
  useEffect(() => {
    let isComponentMounted = true;

    // This MUST run when app starts to handle redirect auth result
    getRedirectResult(auth)
      .then(async (result) => {
        if (isComponentMounted) {
          if (result?.user) {
            console.log("Redirect login success:", result.user.email);
            // User will be set by onAuthStateChanged
          }
          setRedirectHandled(true);
        }
      })
      .catch((error) => {
        if (isComponentMounted) {
          console.error("Redirect result error:", error.code, error.message);
          setRedirectHandled(true);
        }
      });

    return () => {
      isComponentMounted = false;
    };
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    let isComponentMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isComponentMounted) return;
      
      console.log("Auth state changed:", firebaseUser?.email || "No user");
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          // Check if user document exists in Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            // Create new user document for first-time users
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
            console.log("New user document created:", firebaseUser.uid);
          } else {
            const existingData = userDoc.data() as UserData;
            setUserData(existingData);
            console.log("Existing user data loaded:", firebaseUser.uid, "submitted:", existingData.submitted);
          }
        } catch (error) {
          console.error('Error fetching/creating user data:', error);
          // Still allow user to proceed even if Firestore fails
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
      isComponentMounted = false;
      unsubscribe();
    };
  }, []);

  // Combined loading: wait for BOTH auth state AND redirect result
  const isFullyLoaded = !loading && redirectHandled;

  // FIX 1: Sign in with Google - REDIRECT on mobile, POPUP on desktop
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    // Check if mobile device
    const isMobile = isMobileDevice();
    
    try {
      if (isMobile) {
        // MOBILE: Use redirect (NEVER use popup on mobile)
        console.log("Mobile detected - using redirect flow");
        await signInWithRedirect(auth, provider);
        // After redirect, getRedirectResult will handle the result
        return;
      } else {
        // DESKTOP: Use popup (better UX)
        console.log("Desktop detected - using popup flow");
        const result = await signInWithPopup(auth, provider);
        
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const signedInUser = result.user;
        
        console.log("Google Sign-In Successful:", signedInUser.email);
        if (credential?.accessToken) {
          console.log("Access token obtained");
        }
      }
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string };
      const errorCode = firebaseError.code || 'unknown';
      const errorMessage = firebaseError.message || 'Google sign-in failed';
      
      console.error("Google Sign-In Error [" + errorCode + "]:", errorMessage);
      
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
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  // Debug log
  console.log("AuthContext:", { loading, redirectHandled, isFullyLoaded, hasUser: !!user });

  const value: AuthContextType = {
    user,
    userData,
    loading: !isFullyLoaded, // Loading until BOTH checks complete
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
