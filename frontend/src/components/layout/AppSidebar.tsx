import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Upload, 
  FileText, 
  BarChart3, 
  Settings,
  ChevronLeft,
  Home
} from 'lucide-react';

interface AppSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  fileCount?: number;
  chatCount?: number;
}

/**
 * AppSidebar - Main navigation sidebar with clean, modern design
 * Features: Active state highlighting, collapsible, smooth animations
 */
export function AppSidebar({ 
  isCollapsed = false, 
  onToggle,
  fileCount = 0,
  chatCount = 0 
}: AppSidebarProps) {
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Overview and analytics'
    },
    {
      name: 'Chat',
      href: '/chat',
      icon: MessageSquare,
      description: 'AI conversations',
      badge: chatCount > 0 ? chatCount.toString() : undefined
    },
    {
      name: 'Documents',
      href: '/files',
      icon: FileText,
      description: 'File management',
      badge: fileCount > 0 ? fileCount.toString() : undefined
    },
    {
      name: 'Upload',
      href: '/upload',
      icon: Upload,
      description: 'Add new documents'
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      description: 'Usage insights'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      description: 'App configuration'
    }
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href || 
           (href === '/chat' && location.pathname.startsWith('/chat'));
  };

  if (isCollapsed) {
    return (
      <aside className="w-16 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col">
        {/* Toggle button */}
        <div className="p-3 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="w-10 h-10 hover:bg-accent transition-colors"
          >
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </Button>
        </div>
        
        {/* Navigation items */}
        <nav className="flex-1 p-2 space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => `
                relative group block p-3 rounded-lg transition-all duration-normal
                ${isActive || isActiveRoute(item.href)
                  ? 'bg-primary text-primary-foreground shadow-elegant' 
                  : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <item.icon className="h-5 w-5 mx-auto" />
              {item.badge && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {item.badge}
                </Badge>
              )}
              
              {/* Tooltip */}
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-popover border border-border rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>
            </NavLink>
          ))}
        </nav>
      </aside>
    );
  }

  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Navigation</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8 hover:bg-accent transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) => `
              flex items-center space-x-3 p-3 rounded-lg transition-all duration-normal group
              ${isActive || isActiveRoute(item.href)
                ? 'bg-primary text-primary-foreground shadow-elegant' 
                : 'hover:bg-accent text-muted-foreground hover:text-foreground'
              }
            `}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium truncate">{item.name}</span>
                {item.badge && (
                  <Badge className="ml-2">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <p className="text-xs opacity-75 truncate">{item.description}</p>
            </div>
          </NavLink>
        ))}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Card className="p-3 bg-gradient-subtle">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Enterprise Ready</p>
              <p className="text-xs text-muted-foreground">Secure • Scalable • Smart</p>
            </div>
          </div>
        </Card>
      </div>
    </aside>
  );
}