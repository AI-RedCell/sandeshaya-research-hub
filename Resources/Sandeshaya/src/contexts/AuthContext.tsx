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

// Helper to detect mobile devices
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes & Redirect Results
  useEffect(() => {
    // 1. Check for Redirect Result (Mobile flow)
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("Redirect Login Successful:", result.user.email);
          // User state will be updated by onAuthStateChanged, but checks can be done here if needed
        }
      })
      .catch((error) => {
        console.error("Redirect Login Error:", error);
      });

    // 2. Listen for realtime auth changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth State Changed:", firebaseUser ? `User detected: ${firebaseUser.email}` : "No user");
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

    return () => unsubscribe();
  }, []);

  // Hybrid Sign-in: Redirect (Mobile) / Popup (Desktop)
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      if (isMobileDevice()) {
        // Mobile: Use Redirect to avoid popup blocking issues
        console.log("Mobile device detected. Using signInWithRedirect.");
        await signInWithRedirect(auth, provider);
        // Page will redirect; no further code execution here
      } else {
        // Desktop: Use Popup for better UX
        console.log("Desktop detected. Using signInWithPopup.");
        const result = await signInWithPopup(auth, provider);
        console.log("Popup Login Successful:", result.user.email);
      }
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
