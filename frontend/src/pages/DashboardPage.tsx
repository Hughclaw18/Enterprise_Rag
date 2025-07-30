import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MessageSquare, 
  FileText, 
  Upload, 
  BarChart3,
  Users,
  Clock,
  TrendingUp,
  Zap,
  ArrowRight,
  Activity
} from 'lucide-react';
import { formatDistance } from 'date-fns';

/**
 * DashboardPage - Modern dashboard with analytics and quick actions
 * Features: Real-time stats, recent activity, quick actions, beautiful charts
 */
export function DashboardPage() {
  // Mock data for demonstration
  const stats = {
    totalChats: 127,
    documentsProcessed: 45,
    weeklyQueries: 89,
    avgResponseTime: 1.2,
    storageUsed: 67,
    activeUsers: 12
  };

  const recentActivity = [
    {
      id: '1',
      type: 'chat',
      title: 'New chat session started',
      description: 'Q3 Financial Analysis discussion',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      user: 'John Doe'
    },
    {
      id: '2',
      type: 'upload',
      title: 'Document uploaded',
      description: 'Employee_Handbook_v3.pdf (2.4 MB)',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      user: 'Jane Smith'
    },
    {
      id: '3',
      type: 'processed',
      title: 'Document processing completed',
      description: 'Marketing_Strategy_2024.docx',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      user: 'System'
    },
    {
      id: '4',
      type: 'chat',
      title: 'Knowledge query resolved',
      description: 'Policy clarification request',
      timestamp: new Date(Date.now() - 1000 * 60 * 180),
      user: 'Mike Johnson'
    }
  ];

  const quickActions = [
    {
      title: 'Start New Chat',
      description: 'Ask questions about your documents',
      icon: MessageSquare,
      href: '/chat',
      color: 'bg-gradient-primary'
    },
    {
      title: 'Upload Documents',
      description: 'Add new files to your knowledge base',
      icon: Upload,
      href: '/upload',
      color: 'bg-gradient-to-r from-green-500 to-emerald-600'
    },
    {
      title: 'View Analytics',
      description: 'Analyze usage patterns and insights',
      icon: BarChart3,
      href: '/analytics',
      color: 'bg-gradient-to-r from-blue-500 to-cyan-600'
    },
    {
      title: 'Manage Files',
      description: 'Organize and manage your documents',
      icon: FileText,
      href: '/files',
      color: 'bg-gradient-to-r from-purple-500 to-violet-600'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'chat': return MessageSquare;
      case 'upload': return Upload;
      case 'processed': return Zap;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your Enterprise RAG system.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-status-ready/10 text-status-ready">
            System Healthy
          </Badge>
          <Badge className="bg-primary/10 text-primary">
            {stats.activeUsers} Active Users
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-elegant transition-all duration-normal group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Conversations</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalChats}</p>
              <div className="flex items-center space-x-2 mt-2">
                <TrendingUp className="h-4 w-4 text-status-ready" />
                <span className="text-sm text-status-ready">+23% this week</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-elegant transition-all duration-normal group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Documents Processed</p>
              <p className="text-3xl font-bold text-foreground">{stats.documentsProcessed}</p>
              <div className="flex items-center space-x-2 mt-2">
                <TrendingUp className="h-4 w-4 text-status-ready" />
                <span className="text-sm text-status-ready">+12% this week</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <FileText className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-elegant transition-all duration-normal group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Weekly Queries</p>
              <p className="text-3xl font-bold text-foreground">{stats.weeklyQueries}</p>
              <div className="flex items-center space-x-2 mt-2">
                <TrendingUp className="h-4 w-4 text-status-ready" />
                <span className="text-sm text-status-ready">+18% vs last week</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-elegant transition-all duration-normal group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
              <p className="text-3xl font-bold text-foreground">{stats.avgResponseTime}s</p>
              <div className="flex items-center space-x-2 mt-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-muted-foreground">Lightning fast</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Card key={action.title} className="p-6 hover:shadow-elegant transition-all duration-normal group cursor-pointer">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                </div>
                <Button variant="ghost" size="sm" className="group-hover:bg-accent transition-colors">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Storage Usage */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Storage Usage</h3>
            <Badge variant="outline">{stats.storageUsed}% used</Badge>
          </div>
          <Progress value={stats.storageUsed} className="mb-4" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Documents</span>
              <span className="font-medium">245 MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Indexes</span>
              <span className="font-medium">89 MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cache</span>
              <span className="font-medium">34 MB</span>
            </div>
          </div>
        </Card>

        {/* System Status */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-status-ready rounded-full"></div>
                <span className="text-sm">AI Engine</span>
              </div>
              <Badge className="bg-status-ready/10 text-status-ready">Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-status-ready rounded-full"></div>
                <span className="text-sm">Database</span>
              </div>
              <Badge className="bg-status-ready/10 text-status-ready">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-status-processing rounded-full"></div>
                <span className="text-sm">Processing Queue</span>
              </div>
              <Badge className="bg-status-processing/10 text-status-processing">3 jobs</Badge>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.slice(0, 4).map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistance(activity.timestamp, new Date(), { addSuffix: true })} • {activity.user}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-4">
            View All Activity
          </Button>
        </Card>
      </div>
    </div>
  );
}