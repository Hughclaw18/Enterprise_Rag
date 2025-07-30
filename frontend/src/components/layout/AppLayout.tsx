import { useState, ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';

interface AppLayoutProps {
  children: ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout: () => void;
  fileCount?: number;
  chatCount?: number;
}

/**
 * AppLayout - Main application layout with header and sidebar
 * Features: Responsive design, collapsible sidebar, modern styling
 */
export function AppLayout({ 
  children, 
  user, 
  onLogout,
  fileCount = 0,
  chatCount = 0 
}: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <AppHeader
        user={user}
        onLogout={onLogout}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        showSidebarToggle={true}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <AppSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          fileCount={fileCount}
          chatCount={chatCount}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gradient-subtle">
          {children}
        </main>
      </div>
    </div>
  );
}