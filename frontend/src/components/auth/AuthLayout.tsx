import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * AuthLayout - Elegant, centered layout for authentication pages
 * Features: Gradient background, responsive design, subtle animations
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-primary opacity-5" />
      
      {/* Main content container */}
      <div className="relative w-full max-w-md">
        {/* Brand section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl shadow-glow mb-4">
            <span className="text-white text-2xl font-bold">R</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Enterprise RAG</h1>
          <p className="text-muted-foreground mt-2">
            Intelligent Document Analysis Platform
          </p>
        </div>
        
        {/* Auth form container */}
        <div className="bg-card border border-border rounded-xl shadow-elegant p-8 animate-scale-in">
          {children}
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          Secure • Private • Enterprise Ready
        </div>
      </div>
    </div>
  );
}