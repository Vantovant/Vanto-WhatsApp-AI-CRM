'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SearchIcon, FilterIcon, PinIcon, ChevronDownIcon } from '@/components/icons';
import { cn, formatDistanceToNow } from '@/lib/utils';

const filterOptions = [
  { id: 'all', label: 'All Chats' },
  { id: 'unread', label: 'Unread' },
  { id: 'groups', label: 'Groups' },
  { id: 'scheduled', label: 'Scheduled' },
];

export function ChatList() {
  const { chats, selectedChatId, setSelectedChatId, chatFilter, setChatFilter, labels } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter((chat) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!chat.contact_name.toLowerCase().includes(query) &&
          !chat.phone_number.toLowerCase().includes(query)) {
        return false;
      }
    }
    if (chatFilter.type === 'unread' && chat.unread_count === 0) return false;
    if (chatFilter.type === 'groups' && !chat.is_group) return false;
    if (chatFilter.labels.length > 0) {
      if (!chat.labels.some((l) => chatFilter.labels.includes(l))) return false;
    }
    return true;
  }).sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime();
  });

  const activeFilter = filterOptions.find((f) => f.id === chatFilter.type) || filterOptions[0];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Inbox</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <FilterIcon className="w-4 h-4" />
                {activeFilter.label}
                <ChevronDownIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {filterOptions.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  onClick={() => setChatFilter({ ...chatFilter, type: option.id as typeof chatFilter.type })}
                  className={cn(chatFilter.type === option.id && 'bg-secondary')}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-9 bg-secondary/50 border-0"
          />
        </div>

        {/* Label Filters */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {labels.slice(0, 4).map((label) => (
            <button
              key={label.id}
              type="button"
              onClick={() => {
                const newLabels = chatFilter.labels.includes(label.name)
                  ? chatFilter.labels.filter((l) => l !== label.name)
                  : [...chatFilter.labels, label.name];
                setChatFilter({ ...chatFilter, labels: newLabels });
              }}
              className={cn(
                'px-2 py-1 text-xs rounded-full border transition-colors',
                chatFilter.labels.includes(label.name)
                  ? 'bg-primary/20 border-primary/50 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/30'
              )}
            >
              {label.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>No conversations found</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <button
              key={chat.id}
              type="button"
              onClick={() => setSelectedChatId(chat.id)}
              className={cn(
                'chat-item w-full text-left border-b border-border/50',
                selectedChatId === chat.id && 'active bg-secondary'
              )}
            >
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.contact_name}`} alt={chat.contact_name} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {chat.contact_name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {chat.is_pinned && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
                    <PinIcon className="w-3 h-3 text-primary" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium truncate">{chat.contact_name}</span>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatDistanceToNow(new Date(chat.last_message_time))}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.last_message || 'No messages yet'}
                  </p>
                  {chat.unread_count > 0 && (
                    <Badge className="bg-primary text-primary-foreground text-xs px-1.5 min-w-[20px] h-5">
                      {chat.unread_count}
                    </Badge>
                  )}
                </div>
                {chat.labels.length > 0 && (
                  <div className="flex gap-1 mt-1.5">
                    {chat.labels.slice(0, 2).map((label) => (
                      <span
                        key={label}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
