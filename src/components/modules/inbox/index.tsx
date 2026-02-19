'use client';

import { useState } from 'react';
import { ChatList } from './chat-list';
import { ChatThread } from './chat-thread';
import { ContactPanel } from './contact-panel';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';

export function InboxModule() {
  const { selectedChatId, contactPanelOpen } = useApp();

  return (
    <div className="flex h-full">
      {/* Chat List Panel */}
      <div className="w-[320px] lg:w-[360px] flex-shrink-0 border-r border-border bg-card/30">
        <ChatList />
      </div>

      {/* Chat Thread Panel */}
      <div className={cn(
        'flex-1 flex flex-col min-w-0',
        !selectedChatId && 'items-center justify-center'
      )}>
        {selectedChatId ? (
          <ChatThread />
        ) : (
          <div className="text-center p-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
            <p className="text-sm text-muted-foreground max-w-[300px]">
              Choose a chat from the list to start messaging or view conversation history.
            </p>
          </div>
        )}
      </div>

      {/* Contact Panel */}
      {selectedChatId && contactPanelOpen && (
        <div className="w-[320px] lg:w-[360px] flex-shrink-0 border-l border-border bg-card/30">
          <ContactPanel />
        </div>
      )}
    </div>
  );
}
