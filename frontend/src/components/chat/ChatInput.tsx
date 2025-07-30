import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Mic, Square } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onFileUpload?: (file: File) => void; // Add new prop for file upload
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * ChatInput - Advanced input component with auto-resize and keyboard shortcuts
 * Features: Auto-resize textarea, keyboard shortcuts, file attachment, voice input
 */
export function ChatInput({
  onSendMessage,
  onFileUpload,
  isLoading = false,
  disabled = false,
  placeholder = "Ask a question about your documents..."
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // New ref for file input

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceToggle = () => {
    // Placeholder for voice recording functionality
    setIsRecording(!isRecording);
    // In a real implementation, this would integrate with Web Speech API
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (onFileUpload) {
        onFileUpload(file);
      }
      // Clear the input so the same file can be uploaded again if needed
      event.target.value = '';
    }
  };

  const canSend = message.trim().length > 0 && !isLoading && !disabled;

  return (
    <Card className="p-4 border-t border-border bg-background/95 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        {/* File attachment button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 shrink-0 hover:bg-accent transition-colors"
          disabled={disabled}
          onClick={handleFileButtonClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.txt,.doc,.docx"
          />
          <Paperclip className="h-4 w-4" />
        </Button>

        {/* Message input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[40px] max-h-[200px] resize-none pr-12 bg-background/50 border-border focus:bg-background transition-all duration-normal focus:shadow-glow"
            rows={1}
          />
          
          {/* Character count for long messages */}
          {message.length > 200 && (
            <div className="absolute -bottom-5 right-0 text-xs text-muted-foreground">
              {message.length}/1000
            </div>
          )}
        </div>

        {/* Voice input button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-10 w-10 shrink-0 transition-all duration-normal ${
            isRecording 
              ? 'bg-destructive text-destructive-foreground animate-pulse-glow' 
              : 'hover:bg-accent'
          }`}
          onClick={handleVoiceToggle}
          disabled={disabled}
        >
          {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>

        {/* Send button */}
        <Button
          type="submit"
          size="icon"
          className={`h-10 w-10 shrink-0 transition-all duration-normal transform ${
            canSend 
              ? 'bg-gradient-primary hover:opacity-90 hover:scale-105 shadow-elegant' 
              : 'opacity-50'
          }`}
          disabled={!canSend}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>

      {/* Keyboard shortcuts hint */}
      <div className="mt-2 text-xs text-muted-foreground text-center">
        Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> to send, 
        <kbd className="px-1 py-0.5 bg-muted rounded text-xs ml-1">Shift + Enter</kbd> for new line
      </div>
    </Card>
  );
}