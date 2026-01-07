import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
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
  sendEmailLink: (email: string, name: string) => Promise<void>;
  completeSignIn: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  hasSubmitted: boolean;
  isEmailLinkSignIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ActionCodeSettings following Firebase documentation
// https://firebase.google.com/docs/auth/web/email-link-auth
const getActionCodeSettings = () => ({
  // URL you want to redirect back to. The domain for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: `${window.location.origin}/survey`,
  // This must be true for email link sign-in
  handleCodeInApp: true,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailLinkSignIn, setIsEmailLinkSignIn] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[Auth] onAuthStateChanged:', firebaseUser?.email || 'null');
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // If we have a user, auth is complete - reset email link sign-in state
        setIsEmailLinkSignIn(false);
        
        try {
          // Fetch user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Check if returning from email link (on page load)
  useEffect(() => {
    const handleEmailLinkSignIn = async () => {
      // Check if the URL is a sign-in with email link
      if (isSignInWithEmailLink(auth, window.location.href)) {
        console.log('[Auth] Email link detected, starting sign-in flow');
        setIsEmailLinkSignIn(true);
        setLoading(true); // Keep loading state true
        
        // Get the email if available. This should be available if the user completes
        // the flow on the same device where they started it.
        let email = localStorage.getItem('emailForSignIn');
        
        if (!email) {
          // User opened the link on a different device. To prevent session fixation
          // attacks, ask the user to provide the associated email again.
          email = window.prompt('Please provide your email for confirmation');
        }
        
        if (email) {
          try {
            console.log('[Auth] Completing sign-in for:', email);
            await completeSignIn(email);
            console.log('[Auth] Sign-in completed successfully');
            // Don't set isEmailLinkSignIn to false here - let onAuthStateChanged handle it
          } catch (error) {
            console.error('[Auth] Error during auto sign-in:', error);
            // On error, reset states so user can retry
            setIsEmailLinkSignIn(false);
            setLoading(false);
          }
        } else {
          // User cancelled the email prompt
          console.log('[Auth] User cancelled email prompt');
          setIsEmailLinkSignIn(false);
          setLoading(false);
          // Redirect to login since we can't complete sign-in
          window.location.href = '/login';
        }
      }
    };

    handleEmailLinkSignIn();
  }, []);

  // Send the authentication link to the user's email
  const sendEmailLink = async (email: string, name: string) => {
    const actionCodeSettings = getActionCodeSettings();
    
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    
    // Save the email locally so you don't need to ask the user for it again
    // if they open the link on the same device.
    localStorage.setItem('emailForSignIn', email);
    localStorage.setItem('nameForSignIn', name);
  };

  // Complete sign-in with the email link
  const completeSignIn = async (email: string) => {
    try {
      // The client SDK will parse the code from the link for you.
      const result = await signInWithEmailLink(auth, email, window.location.href);
      const name = localStorage.getItem('nameForSignIn') || '';
      
      // Check if user document exists
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create new user document
        const newUserData: UserData = {
          name,
          email,
          emailVerified: true,
          submitted: false,
          createdAt: serverTimestamp(),
          submittedAt: null,
        };
        await setDoc(userDocRef, newUserData);
        setUserData(newUserData);
      } else {
        setUserData(userDoc.data() as UserData);
      }
      
      // Clear email from storage (following Firebase docs)
      localStorage.removeItem('emailForSignIn');
      localStorage.removeItem('nameForSignIn');
      
      // Clean up URL (remove the sign-in code from URL)
      window.history.replaceState(null, '', '/survey');
    } catch (error) {
      console.error('Error completing sign in:', error);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
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
      
      // Redirect to survey after successful sign-in
      window.location.href = '/survey';
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
    sendEmailLink,
    completeSignIn,
    signInWithGoogle,
    signOut,
    hasSubmitted: userData?.submitted ?? false,
    isEmailLinkSignIn,
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
