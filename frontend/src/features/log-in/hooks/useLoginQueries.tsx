import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.tsx';
import { createLoginRequest } from '../api/api.ts';
import type { LoginRequest } from '../types/types.local.ts';
import type { User } from '../../../components/Login.tsx';

export const useCreateLoginRequestMutation = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const navigateToPage = (role: User['role']) => {
    switch (role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'manager':
        navigate('/manager');
        break;
      case 'operator':
        navigate('/operator');
        break;
    }
  };

  const createLoginRequestMutation = useMutation({
    mutationFn: async (data: LoginRequest) => createLoginRequest(data),
    onSuccess: async (response) => {
      const { user, token } = response.data;
      login(user, token);

      navigateToPage(user.role);
    },
    onError: (error) => console.error(error),
  });

  return createLoginRequestMutation;
};
