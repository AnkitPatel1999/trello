import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser, logout, clearError } from '../store/authSlice';
import type { RootState } from '../store';
import type { User } from '../domain/auth';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth);

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
