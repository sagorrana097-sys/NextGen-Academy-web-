import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nextgen_user');
      return saved && saved !== 'undefined' && saved !== 'null' ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn('Failed to parse nextgen_user from localStorage', e);
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      const t = localStorage.getItem('token') || localStorage.getItem('adminToken') || localStorage.getItem('nextgen_token');
      return t && t !== 'undefined' && t !== 'null' ? t : null;
    } catch (e) {
      return null;
    }
  });

  const [refreshToken, setRefreshToken] = useState(() => {
    try {
      const rt = localStorage.getItem('nextgen_refresh_token');
      return rt && rt !== 'undefined' && rt !== 'null' ? rt : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Background Session Verification and Silent Token Refresh
  const verifySession = useCallback(async () => {
    const currentToken = localStorage.getItem('token') || localStorage.getItem('adminToken') || localStorage.getItem('nextgen_token');
    const currentRefresh = localStorage.getItem('nextgen_refresh_token');

    if (!currentToken && !currentRefresh) return;

    try {
      const res = await authAPI.getMe();
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('nextgen_user', JSON.stringify(res.data.user));
      } else if (currentRefresh) {
        // Try silent refresh
        const refreshRes = await authAPI.refreshToken(currentRefresh);
        if (refreshRes.success && refreshRes.data?.token) {
          setToken(refreshRes.data.token);
          localStorage.setItem('nextgen_token', refreshRes.data.token);
          localStorage.setItem('token', refreshRes.data.token);
          if (refreshRes.data.refreshToken) {
            setRefreshToken(refreshRes.data.refreshToken);
            localStorage.setItem('nextgen_refresh_token', refreshRes.data.refreshToken);
          }
        }
      }
    } catch (err) {
      // Silently keep local state during temporary network glitches
      console.debug('Session check background notification:', err?.message);
    }
  }, []);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authAPI.login(identifier, password);

      if (res.requires2FA) {
        return {
          success: false,
          requires2FA: true,
          tempToken: res.tempToken,
          user: res.user,
          message: res.message
        };
      }

      if (res.success && res.data) {
        const u = res.data.user;
        const tok = res.data.token || res.data.accessToken;
        const rTok = res.data.refreshToken;

        setUser(u);
        setToken(tok);
        if (rTok) {
          setRefreshToken(rTok);
          localStorage.setItem('nextgen_refresh_token', rTok);
        }
        localStorage.setItem('nextgen_token', tok);
        localStorage.setItem('token', tok);
        if (u?.role === 'ADMIN' || u?.role === 'SUPER_ADMIN') {
          localStorage.setItem('adminToken', tok);
        }
        localStorage.setItem('nextgen_user', JSON.stringify(u));
        return { success: true, user: u };
      }

      const errorMsg = res.error?.message || res.message || 'ইমেইল, ইউজার আইডি অথবা পাসওয়ার্ড সঠিক নয়';
      setError(errorMsg);
      return {
        success: false,
        error: errorMsg,
        status: res.status || 401,
        response: res
      };
    } catch (err) {
      const msg = err.message || 'ইমেইল, ইউজার আইডি অথবা পাসওয়ার্ড সঠিক নয়';
      setError(msg);
      return {
        success: false,
        error: msg,
        status: err.status || 401,
        response: err
      };
    } finally {
      setLoading(false);
    }
  };

  const loginWith2FA = async (tempToken, code) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authAPI.login2FA(tempToken, code);
      if (res.success && res.data) {
        const u = res.data.user;
        const tok = res.data.token || res.data.accessToken;
        const rTok = res.data.refreshToken;

        setUser(u);
        setToken(tok);
        if (rTok) {
          setRefreshToken(rTok);
          localStorage.setItem('nextgen_refresh_token', rTok);
        }
        localStorage.setItem('nextgen_token', tok);
        localStorage.setItem('token', tok);
        if (u?.role === 'ADMIN' || u?.role === 'SUPER_ADMIN') {
          localStorage.setItem('adminToken', tok);
        }
        localStorage.setItem('nextgen_user', JSON.stringify(u));
        return { success: true, user: u };
      }
      throw new Error(res.error?.message || '2FA verification failed');
    } catch (err) {
      const msg = err.message || '2FA verification failed';
      setError(msg);
      return {
        success: false,
        error: msg,
        status: err.status || err.response?.status,
        response: err.response
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      // ignore
    }
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    setError(null);
    localStorage.removeItem('nextgen_token');
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('nextgen_refresh_token');
    localStorage.removeItem('nextgen_user');
  };

  const clearError = () => {
    setError(null);
  };

  const updateUserProfile = (updatedData) => {
    setUser((prev) => {
      const newU = { ...prev, ...updatedData };
      localStorage.setItem('nextgen_user', JSON.stringify(newU));
      return newU;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        loading,
        error,
        clearError,
        login,
        loginWith2FA,
        logout,
        updateUserProfile,
        verifySession,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
        isSuperAdmin: user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN',
        isTeacher: user?.role === 'TEACHER',
        isParent: user?.role === 'PARENT',
        isStudent: user?.role === 'STUDENT'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
