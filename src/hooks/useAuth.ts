import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { setUser, logout, setLoading, clearError } from '../store/authSlice';
import type { RootState } from '../store';
import type { User } from '../domain/auth';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      dispatch(setLoading(true));
      
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('auth_token');
        
        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          dispatch(setUser(userData));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
      } finally {
        dispatch(setLoading(false));
      }
    };

    initializeAuth();
  }, [dispatch]);

  const login = (user: User, token: string) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('auth_token', token);
    dispatch(setUser(user));
    navigate('/dashboard', { replace: true });
  };

  const logoutUser = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    ...authState,
    login,
    logout: logoutUser,
    clearError: clearAuthError,
  };
};
