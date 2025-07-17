import React, { createContext, useState, useEffect } from "react";
import { firebase } from "../services/FirebaseService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((usr) => {
      console.log("👤 Firebase auth state changed:", usr);
      setUser(usr);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email, password) =>
    firebase.auth().signInWithEmailAndPassword(email, password);

  const register = (email, password) =>
    firebase.auth().createUserWithEmailAndPassword(email, password);

  const logout = () => firebase.auth().signOut();

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
