import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ChatPage } from "./pages/ChatPage";
import { FilesPage } from "./pages/FilesPage";
import { AppLayout } from "./components/layout/AppLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/**
 * App - Main application component with authentication and routing
 * Features: Protected routes, authentication state, responsive layout
 */
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar?: string;
  } | null>(null);

  // Simulate checking authentication state on app load
  useEffect(() => {
    // In a real app, this would check for stored auth tokens/session
    const checkAuth = () => {
      const storedAuth = localStorage.getItem('rag_auth');
      if (storedAuth) {
        try {
          const authData = JSON.parse(storedAuth);
          setIsAuthenticated(true);
          setUser(authData.user);
        } catch (error) {
          console.error('Failed to parse stored auth data:', error);
          localStorage.removeItem('rag_auth');
        }
      }
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = () => {
    // Simulate successful authentication
    const userData = {
      name: 'Demo User',
      email: 'demo@enterpriserag.com',
      avatar: undefined
    };
    
    setUser(userData);
    setIsAuthenticated(true);
    
    // Store auth state (in real app, this would be JWT tokens)
    localStorage.setItem('rag_auth', JSON.stringify({
      user: userData,
      timestamp: Date.now()
    }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('rag_auth');
  };

  // Mock data for file and chat counts
  const fileCount = 12;
  const chatCount = 8;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/auth" 
              element={
                isAuthenticated ? 
                  <Navigate to="/dashboard" replace /> : 
                  <AuthPage onAuthSuccess={handleAuthSuccess} />
              } 
            />
            
            {/* Protected Routes */}
            {isAuthenticated ? (
              <Route 
                path="/*" 
                element={
                  <AppLayout 
                    user={user || undefined}
                    onLogout={handleLogout}
                    fileCount={fileCount}
                    chatCount={chatCount}
                  >
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/chat" element={<ChatPage />} />
                      <Route path="/files" element={<FilesPage />} />
                      <Route path="/upload" element={<FilesPage />} />
                      <Route path="/analytics" element={<DashboardPage />} />
                      <Route path="/settings" element={<DashboardPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AppLayout>
                }
              />
            ) : (
              <>
                <Route path="/" element={<Navigate to="/auth" replace />} />
                <Route path="*" element={<Navigate to="/auth" replace />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
