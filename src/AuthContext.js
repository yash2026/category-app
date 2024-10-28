// AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        // Retrieve isVerified status based on user email from localStorage
        const storedIsVerified = JSON.parse(
          localStorage.getItem(`isVerified_${user.email}`)
        );
        setIsVerified(!!storedIsVerified);
      }
    });
    return unsubscribe;
  }, []);

  const signup = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    setIsVerified(false); // User needs verification after signup
    return userCredential;
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Check if user is already verified in localStorage
    const storedIsVerified = JSON.parse(
      localStorage.getItem(`isVerified_${email}`)
    );
    setIsVerified(!!storedIsVerified);

    // Navigate directly to Categories if the user is already verified
    if (!!storedIsVerified) {
      navigate("/categories");
    }

    return userCredential;
  };

  const logout = () => {
    signOut(auth);
    setCurrentUser(null);
    navigate("/login");
  };

  const verifyUser = () => {
    if (currentUser) {
      setIsVerified(true);
      // Save verification status in localStorage by email
      localStorage.setItem(`isVerified_${currentUser.email}`, true);
    }
  };

  const value = {
    currentUser,
    isVerified,
    signup,
    login,
    logout,
    verifyUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
