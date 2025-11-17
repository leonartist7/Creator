import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../stores/authStore';
import api from '../utils/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      setError('');

      const response = await api.post('/auth/register', {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      const { user, token, refreshToken } = response.data.data;

      setAuth(user, token, refreshToken);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Start creating digital products today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name"
                placeholder="John"
                {...register('firstName')}
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                {...register('lastName')}
              />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create Account
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
