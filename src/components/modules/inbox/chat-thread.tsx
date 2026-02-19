'use client';

import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { getChatById, getMessagesForChat, getAISuggestionForChat } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SendIcon,
  AttachmentIcon,
  MicIcon,
  MoreVerticalIcon,
  CheckCheckIcon,
  CheckIcon,
  SparklesIcon,
  TagIcon,
  UserIcon,
  ClockIcon,
  ChevronRightIcon,
} from '@/components/icons';
import { cn, formatTime } from '@/lib/utils';
import type { Message } from '@/lib/database.types';

export function ChatThread() {
  const { selectedChatId, setContactPanelOpen, contactPanelOpen } = useApp();
  const [message, setMessage] = useState('');
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chat = selectedChatId ? getChatById(selectedChatId) : null;
  const messages = selectedChatId ? getMessagesForChat(selectedChatId) : [];
  const aiSuggestion = selectedChatId ? getAISuggestionForChat(selectedChatId) : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChatId]);

  if (!chat) return null;

  const handleSend = () => {
    if (!message.trim()) return;
    // In real app, would send message
    setMessage('');
  };

  const handleUseSuggestion = (suggestion: string) => {
    setMessage(suggestion);
    setShowAISuggestions(false);
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'read':
        return <CheckCheckIcon className="w-4 h-4 text-primary" />;
      case 'delivered':
        return <CheckCheckIcon className="w-4 h-4 text-muted-foreground" />;
      case 'sent':
        return <CheckIcon className="w-4 h-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
        <button
          type="button"
          onClick={() => setContactPanelOpen(!contactPanelOpen)}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.contact_name}`} alt={chat.contact_name} />
            <AvatarFallback className="bg-primary/20 text-primary">
              {chat.contact_name.split(' ').map((n) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <h3 className="font-medium">{chat.contact_name}</h3>
            <p className="text-xs text-muted-foreground">{chat.phone_number}</p>
          </div>
          <ChevronRightIcon className={cn(
            'w-4 h-4 text-muted-foreground transition-transform',
            contactPanelOpen && 'rotate-180'
          )} />
        </button>

        <div className="flex items-center gap-2">
          {chat.labels.slice(0, 2).map((label) => (
            <Badge key={label} variant="outline" className="text-xs">
              {label}
            </Badge>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <MoreVerticalIcon className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <TagIcon className="w-4 h-4 mr-2" />
                Add Label
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserIcon className="w-4 h-4 mr-2" />
                Assign Agent
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ClockIcon className="w-4 h-4 mr-2" />
                Schedule Follow-up
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Block Contact
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex animate-fade-in',
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[70%] px-4 py-2.5',
                msg.sender === 'user'
                  ? 'message-bubble-sent'
                  : 'message-bubble-received'
              )}
            >
              <p className="text-sm">{msg.content}</p>
              <div className={cn(
                'flex items-center gap-1 mt-1',
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              )}>
                <span className="text-[10px] opacity-70">
                  {formatTime(new Date(msg.created_at || ''))}
                </span>
                {msg.sender === 'user' && getStatusIcon(msg.status)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* AI Suggestions */}
      {aiSuggestion && showAISuggestions && (
        <div className="px-4 py-3 border-t border-border bg-primary/5 animate-slide-up">
          <div className="flex items-center gap-2 mb-2">
            <SparklesIcon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI Suggestions</span>
          </div>
          <div className="space-y-2">
            {aiSuggestion.suggestions.map((suggestion, idx) => (
              <button
                key={`suggestion-${idx}`}
                type="button"
                onClick={() => handleUseSuggestion(suggestion)}
                className="w-full text-left p-2 text-sm rounded-lg bg-card hover:bg-secondary/50 transition-colors border border-border/50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Composer */}
      <div className="px-4 py-3 border-t border-border bg-card/50">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground flex-shrink-0">
            <AttachmentIcon className="w-5 h-5" />
          </Button>

          {aiSuggestion && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAISuggestions(!showAISuggestions)}
              className={cn(
                'flex-shrink-0',
                showAISuggestions ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              )}
            >
              <SparklesIcon className="w-5 h-5" />
            </Button>
          )}

          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-secondary/50 border-0"
          />

          {message ? (
            <Button
              onClick={handleSend}
              size="icon"
              className="flex-shrink-0 bg-primary hover:bg-primary/90"
            >
              <SendIcon className="w-5 h-5" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="text-muted-foreground flex-shrink-0">
              <MicIcon className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
