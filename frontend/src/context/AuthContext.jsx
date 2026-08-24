import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nextgen_user');
      return saved && saved !== 'undefined' && saved !== 'null' ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn('Failed to parse nextgen_user from localStorage', e);
      localStorage.removeItem('nextgen_user');
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
        setUser(res.data.user);
        setToken(res.data.token);
        if (res.data.refreshToken) {
          setRefreshToken(res.data.refreshToken);
          localStorage.setItem('nextgen_refresh_token', res.data.refreshToken);
        }
        localStorage.setItem('nextgen_token', res.data.token);
        localStorage.setItem('token', res.data.token);
        if (res.data.user?.role === 'ADMIN' || res.data.user?.role === 'SUPER_ADMIN') {
          localStorage.setItem('adminToken', res.data.token);
        }
        localStorage.setItem('nextgen_user', JSON.stringify(res.data.user));
        return { success: true, user: res.data.user };
      }
      throw new Error(res.error?.message || 'Login failed');
    } catch (err) {
      const msg = err.message || 'Login failed';
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

  const loginWith2FA = async (tempToken, code) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authAPI.login2FA(tempToken, code);
      if (res.success && res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
        if (res.data.refreshToken) {
          setRefreshToken(res.data.refreshToken);
          localStorage.setItem('nextgen_refresh_token', res.data.refreshToken);
        }
        localStorage.setItem('nextgen_token', res.data.token);
        localStorage.setItem('token', res.data.token);
        if (res.data.user?.role === 'ADMIN' || res.data.user?.role === 'SUPER_ADMIN') {
          localStorage.setItem('adminToken', res.data.token);
        }
        localStorage.setItem('nextgen_user', JSON.stringify(res.data.user));
        return { success: true, user: res.data.user };
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

  const demoLogin = async (role) => {
    const credentials = {
      ADMIN: { email: 'Alomgir005', password: '01792818005' },
      SUPER_ADMIN: { email: 'Alomgir005', password: '01792818005' },
      TEACHER: { email: 'teacher@nextgen.edu.bd', password: 'teacher123' },
      PARENT: { email: 'parent@nextgen.edu.bd', password: 'parent123' },
      STUDENT: { email: 'student@nextgen.edu.bd', password: 'student123' }
    };
    const cred = credentials[role];
    if (cred) {
      return await login(cred.email, cred.password);
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
        demoLogin,
        logout,
        updateUserProfile,
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
