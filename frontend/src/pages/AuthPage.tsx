import { useState } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

/**
 * AuthPage - Unified authentication page with toggle between login/signup
 * Features: Smooth transitions, form state management, elegant design
 */
export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AuthLayout>
      <div className="transition-all duration-normal">
        {isLogin ? (
          <LoginForm
            onToggleMode={() => setIsLogin(false)}
            onSuccess={onAuthSuccess}
          />
        ) : (
          <SignupForm
            onToggleMode={() => setIsLogin(true)}
            onSuccess={onAuthSuccess}
          />
        )}
      </div>
    </AuthLayout>
  );
}