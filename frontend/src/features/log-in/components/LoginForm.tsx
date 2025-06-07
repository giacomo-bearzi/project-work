import { Alert, Paper, Stack, TextField, Typography } from '@mui/material';
import { useForm } from '@tanstack/react-form';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCreateLoginRequestMutation } from '../hooks/useLoginQueries.tsx';
import type { LoginRequest } from '../types/types.local.ts';
import { LoginButton } from './LoginButton.tsx';
import { ShowPasswordButton } from './ShowPasswordButton.tsx';

export const LogInForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Mutation per creare richiesta di login.
  const {
    mutate: createLoginRequest,
    isPending,
    isError,
  } = useCreateLoginRequestMutation();

  const form = useForm({
    onSubmit: async ({ value }) => {
      console.info(value);
      createLoginRequest(value);
    },
    defaultValues: {
      username: '',
      password: '',
    } as LoginRequest,
  });

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  // Stringa per gestire il tipo di input in base al valore di `showPassword`.
  const inpuType = showPassword ? 'text' : 'password';

  return (
    <Paper
      elevation={1}
      sx={{ borderRadius: 8, p: 4, mb: 6 }}
    >
      <Stack
        direction="column"
        alignItems="center"
        gap={4}
      >
        <Stack
          direction="column"
          alignItems="center"
          gap={1}
          sx={{ width: '100%' }}
        >
          <img
            src="/logo.png"
            alt="Logo TechManufacturing S.p.A."
            className="max-h-16"
          />
          <Typography
            variant="body1"
            fontWeight={600}
          >
            Accedi per continuare
          </Typography>
        </Stack>
        <Stack
          component="form"
          sx={{ width: '100%' }}
          gap={4}
          onSubmit={handleFormSubmit}
        >
          <Stack
            sx={{ width: '100%' }}
            gap={2}
          >
            <form.Field
              name="username"
              children={(field) => (
                <>
                  <TextField
                    required
                    fullWidth
                    error={isError}
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </>
              )}
            />
            <Stack
              gap={1}
              alignItems="end"
            >
              <form.Field
                name="password"
                children={(field) => (
                  <>
                    <TextField
                      required
                      fullWidth
                      error={isError}
                      name="password"
                      label="Password"
                      type={inpuType}
                      id="password"
                      autoComplete="current-password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <ShowPasswordButton
                              showPassword={showPassword}
                              setShowPassword={setShowPassword}
                            />
                          ),
                        },
                      }}
                    />
                  </>
                )}
              />
              <Link to="/reset-password">
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{ ':hover': { textDecoration: 'underline' } }}
                >
                  Non ricordi la password?
                </Typography>
              </Link>
            </Stack>
            {isError && (
              <Alert
                variant="filled"
                severity="error"
              >
                Username o password errati
              </Alert>
            )}
          </Stack>
          <LoginButton isPending={isPending} />
        </Stack>
      </Stack>
    </Paper>
  );
};
