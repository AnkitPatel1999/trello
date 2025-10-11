import { useDispatch, useSelector } from 'react-redux';
import { apiService } from '../services/api';
import { setSuperUser } from '../store/authSlice';
import type { RootState } from '../store';

export const useSuperUser = () => {
  const dispatch = useDispatch();
  const isSuperUser = useSelector((state: RootState) => state.auth.isSuperUser);

  const toggleSuperUser = async (password: string): Promise<boolean> => {
    try {
      if (!isSuperUser && password) {
        // Verify password when turning ON
        const result = await apiService.verifySuperUserPassword(password);
        if (result.success) {
          dispatch(setSuperUser(true));
          return true;
        } else {
          return false;
        }
      } else {
        // Turn OFF without password
        dispatch(setSuperUser(false));
        return true;
      }
    } catch (error) {
      console.error('Failed to toggle super user mode:', error);
      return false;
    }
  };

  return {
    isSuperUser,
    toggleSuperUser,
  };
};
