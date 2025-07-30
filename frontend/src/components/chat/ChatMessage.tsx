import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Copy, ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Source {
  id: string;
  title: string;
  excerpt: string;
  url?: string;
}

interface ChatMessageProps {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  sources?: Source[];
  isLoading?: boolean;
}

/**
 * ChatMessage - Elegant message component with source citations
 * Features: User/AI distinction, source links, copy functionality, smooth animations
 */
export function ChatMessage({
  content,
  isUser,
  timestamp,
  sources = [],
  isLoading = false
}: ChatMessageProps) {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: "Message content has been copied",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy message content",
        variant: "destructive",
      });
    }
  };

  const TypingIndicator = () => (
    <div className="flex items-center space-x-1">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
      </div>
      <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
    </div>
  );

  return (
    <div className={`flex w-full mb-6 animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <Avatar className="h-8 w-8 mt-1">
          {isUser ? (
            <AvatarFallback className="bg-gradient-primary text-white text-sm">
              U
            </AvatarFallback>
          ) : (
            <AvatarFallback className="bg-gradient-subtle border text-sm">
              AI
            </AvatarFallback>
          )}
        </Avatar>

        {/* Message content */}
        <div className="flex-1">
          <Card className={`p-4 transition-all duration-normal ${
            isUser 
              ? 'bg-chat-user text-chat-user-foreground shadow-elegant' 
              : 'bg-chat-ai text-chat-ai-foreground hover:shadow-elegant'
          }`}>
            {isLoading ? (
              <TypingIndicator />
            ) : (
              <>
                {/* Message text */}
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {typeof content === 'string' ? content : ''}
                  </ReactMarkdown>
                </div>

                {/* Sources section */}
                {sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center space-x-2 mb-3">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Sources</span>
                    </div>
                    <div className="space-y-2">
                      {sources.map((source, index) => (
                        <div
                          key={source.id}
                          className="flex items-start space-x-3 p-3 bg-background/50 rounded-lg border border-border/30 hover:border-border transition-colors group"
                        >
                          <Badge variant="secondary" className="mt-0.5">
                            {index + 1}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                              {source.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {source.excerpt}
                            </p>
                          </div>
                          {source.url && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              asChild
                            >
                              <a href={source.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message actions */}
                {!isUser && !isLoading && (
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={handleCopy}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Helpful
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                        <ThumbsDown className="h-3 w-3 mr-1" />
                        Not helpful
                      </Button>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}