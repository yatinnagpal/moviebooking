// import React, { createContext, useState, useEffect } from 'react';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [accessToken, setAccessToken] = useState(null);
//   const [refreshToken, setRefreshToken] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     const storedAccessToken = localStorage.getItem('accessToken');
//     const storedRefreshToken = localStorage.getItem('refreshToken');
//     if (storedUser && storedAccessToken && storedRefreshToken) {
//       setUser(JSON.parse(storedUser));
//       setAccessToken(storedAccessToken);
//       setRefreshToken(storedRefreshToken);
//     }
//   }, []);

//   const login = (access, refresh, userData) => {
//     setAccessToken(access);
//     setRefreshToken(refresh);
//     setUser(userData);
//     localStorage.setItem('accessToken', access);
//     localStorage.setItem('refreshToken', refresh);
//     localStorage.setItem('user', JSON.stringify(userData));
//   };

//   const logout = () => {
//     setAccessToken(null);
//     setRefreshToken(null);
//     setUser(null);
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('user');
//   };

//   return (
//     <AuthContext.Provider value={{ user, accessToken, refreshToken, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  // --- Load tokens and user from localStorage ---
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (storedUser && storedAccessToken && storedRefreshToken) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
    }
  }, []);

  // --- Login function ---
  const login = (access, refresh, userData) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    setUser(userData);
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // --- Logout function ---
  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }, []);

  // --- Auto refresh token function ---
  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) return;

    try {
      const response = await axios.post('http://localhost:8000/api/token/refresh/', {
        refresh: refreshToken,
      });
      const newAccess = response.data.access;

      // Save new access token
      setAccessToken(newAccess);
      localStorage.setItem('accessToken', newAccess);
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout(); // If refresh fails, logout the user
    }
  }, [refreshToken, logout]);

  // --- Periodically refresh access token ---
  useEffect(() => {
    if (!refreshToken) return;

    // Refresh every 4 minutes (JWT default expiry is usually 5 min)
    const interval = setInterval(() => {
      refreshAccessToken();
    }, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, refreshAccessToken]);

  // --- Axios interceptor to attach access token automatically ---
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
