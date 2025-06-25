import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createLoginRequest } from '../api/api.ts';
import { useAuth } from '../../log-in/context/AuthContext.tsx';
import { type LoginRequest } from '../../log-in/types/types.local.ts';

export const useCreateLoginRequestMutation = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const createLoginRequestMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
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
