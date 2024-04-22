import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({ user: null, isAuthenticated: false });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('https://healthmate-backend.onrender.com/user', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setAuthState({ user: res.data, isAuthenticated: true });
        })
        .catch((err) => {
          console.error(err);
          localStorage.removeItem('token');
        });
    }
  }, []);

  return <AuthContext.Provider value={{ authState, setAuthState }}>{children}</AuthContext.Provider>;
};
