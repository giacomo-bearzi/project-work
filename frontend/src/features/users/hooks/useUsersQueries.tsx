import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createLoginRequest } from '../api/usersApi.ts';
import { useAuth } from '../../dashboard-login/context/AuthContext.tsx';
import type { ApiCreateLoginRequest } from '../types/usersTypes.ts';

export const useCreateLoginRequestMutation = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const createLoginRequestMutation = useMutation({
    mutationFn: async (data: ApiCreateLoginRequest) => {
      return await createLoginRequest(data);
    },
    onSuccess: (response) => {
      const { user, token } = response.data;
      login(user, token);
      navigate('/overview');
    },
    onError: (error) => console.error(error),
  });

  return createLoginRequestMutation;
};
