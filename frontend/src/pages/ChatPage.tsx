import { useState, useEffect } from 'react';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  sources?: Array<{
    id: string;
    title: string;
    excerpt: string;
    url?: string;
  }>;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
  messages: Message[];
}

/**
 * ChatPage - Main RAG chat interface with sidebar and message history
 * Features: Session management, real-time chat, source citations, responsive design
 */
export function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  useEffect(() => {
    const mockSessions: ChatSession[] = [
      {
        id: '1',
        title: 'Q3 Financial Analysis',
        lastMessage: 'What were the key revenue drivers in Q3?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        messageCount: 5,
        messages: [
          {
            id: '1',
            content: 'What were the key revenue drivers in Q3?',
            isUser: true,
            timestamp: new Date(Date.now() - 1000 * 60 * 30)
          },
          {
            id: '2',
            content: 'Based on the Q3 financial report, the key revenue drivers were:\n\n1. **Product Sales Growth** - 15% increase in core product revenue\n2. **Service Expansion** - 22% growth in professional services\n3. **New Market Entry** - Successfully launched in 3 new markets\n4. **Customer Retention** - 94% retention rate, up from 89% in Q2\n\nThe strongest performance came from our enterprise segment, which saw a 28% year-over-year increase.',
            isUser: false,
            timestamp: new Date(Date.now() - 1000 * 60 * 29),
            sources: [
              {
                id: '1',
                title: 'Q3 2024 Financial Report',
                excerpt: 'Revenue increased 15% year-over-year driven by strong product sales...',
                url: '#'
              },
              {
                id: '2',
                title: 'Market Analysis - Q3 Performance',
                excerpt: 'Enterprise segment showed exceptional growth with 28% increase...',
                url: '#'
              }
            ]
          }
        ]
      },
      {
        id: '2',
        title: 'Employee Handbook Updates',
        lastMessage: 'What are the new remote work policies?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        messageCount: 3,
        messages: []
      }
    ];
    
    setSessions(mockSessions);
    setActiveSessionId(mockSessions[0].id);
  }, []);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const handleSendMessage = async (content: string) => {
    if (!activeSessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date()
    };

    // Add user message
    setSessions(prev => prev.map(session => 
      session.id === activeSessionId 
        ? { 
            ...session, 
            messages: [...session.messages, userMessage],
            lastMessage: content,
            timestamp: new Date(),
            messageCount: session.messageCount + 1
          }
        : session
    ));

    // Simulate AI response
    setIsLoading(true);
    
    try {
      const res = await fetch('http://127.0.0.1:8006/query', { // <--- Change this line
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: content }),
      });
      const data = await res.json();

      let aiMessageContent = '';
      if (data.response) {
        aiMessageContent = data.response;
      } else if (data.error) {
        aiMessageContent = `Error: ${data.error}`;
      } else {
        aiMessageContent = 'An unknown error occurred.';
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiMessageContent,
        isUser: false,
        timestamp: new Date(),
        sources: [] // You might want to parse sources from the backend response if available
      };

      setSessions(prev => prev.map(session => 
        session.id === activeSessionId 
          ? { 
              ...session, 
              messages: [...session.messages, aiMessage],
              messageCount: session.messageCount + 1
            }
          : session
      ));
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Failed to connect to the RAG backend. Please ensure the backend server is running. Error: ${error}`,
        isUser: false,
        timestamp: new Date(),
      };
      setSessions(prev => prev.map(session => 
        session.id === activeSessionId 
          ? { 
              ...session, 
              messages: [...session.messages, errorMessage],
              messageCount: session.messageCount + 1
            }
          : session
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Conversation',
      lastMessage: '',
      timestamp: new Date(),
      messageCount: 0,
      messages: []
    };
    
    setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
    };

  const handleFileUpload = async (file: File) => {
    if (!activeSessionId) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://127.0.0.1:8006/upload-document', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        toast({
          title: "File Uploaded",
          description: `${file.name} has been successfully uploaded and processed.`,
        });
        // Optionally, add a message to the chat indicating the file upload
        const uploadMessage: Message = {
          id: Date.now().toString(),
          content: `Document '${file.name}' uploaded successfully.`,
          isUser: false,
          timestamp: new Date(),
        };
        setSessions(prev => prev.map(session => 
          session.id === activeSessionId 
            ? { 
                ...session, 
                messages: [...session.messages, uploadMessage],
                messageCount: session.messageCount + 1
              }
            : session
        ));
      } else {
        const errorData = await res.json();
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}: ${errorData.detail || res.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: `An error occurred during upload: ${error}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      const remainingSessions = sessions.filter(s => s.id !== sessionId);
      setActiveSessionId(remainingSessions.length > 0 ? remainingSessions[0].id : null);
    }
  };

  return (
    <div className="h-full flex">
      {/* Chat Sidebar */}
      <ChatSidebar
        sessions={sessions}
        activeSessionId={activeSessionId || undefined}
        onSessionSelect={setActiveSessionId}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        isCollapsed={sidebarCollapsed}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gradient-subtle">
        {activeSession ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-background/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-foreground">
                    {activeSession.title}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {activeSession.messageCount} messages • Last active {
                      activeSession.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })
                    }
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="lg:hidden"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="max-w-4xl mx-auto">
                {activeSession.messages.length === 0 ? (
                  <Card className="p-8 text-center bg-background/50 backdrop-blur-sm">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
                    <p className="text-muted-foreground mb-4">
                      Ask questions about your documents and get intelligent, source-backed answers.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        "Summarize the Q3 financial report",
                        "What are the new company policies?",
                        "Analyze customer feedback trends"
                      ].map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendMessage(suggestion)}
                          className="transition-all duration-normal hover:shadow-elegant"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {activeSession.messages.map((message) => (
                      <ChatMessage
                        key={message.id}
                        {...message}
                      />
                    ))}
                    {isLoading && (
                      <ChatMessage
                        id="loading"
                        content=""
                        isUser={false}
                        timestamp={new Date()}
                        isLoading={true}
                      />
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4">
              <div className="max-w-4xl mx-auto">
                <ChatInput
                  onSendMessage={handleSendMessage}
                  onFileUpload={handleFileUpload}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Card className="p-8 text-center max-w-md">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
              <p className="text-muted-foreground mb-4">
                Select a conversation from the sidebar or start a new one.
              </p>
              <Button onClick={handleNewChat} className="bg-gradient-primary">
                Start New Chat
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}