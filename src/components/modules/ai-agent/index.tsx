'use client';

import { useState } from 'react';
import { mockChats, mockAISuggestions, getAISuggestionForChat, mockLabels } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  SparklesIcon,
  SendIcon,
  CheckIcon,
  ClockIcon,
  ZapIcon,
  TagIcon,
  RefreshIcon,
} from '@/components/icons';
import { cn, formatDistanceToNow } from '@/lib/utils';
import { toast } from 'sonner';

// Simulated intent detection
const detectIntent = (message: string): { intent: string; confidence: number; suggestedLabel: string } => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('billing')) {
    return { intent: 'pricing_inquiry', confidence: 0.92, suggestedLabel: 'Hot Lead' };
  }
  if (lowerMessage.includes('help') || lowerMessage.includes('issue') || lowerMessage.includes('problem')) {
    return { intent: 'support_request', confidence: 0.88, suggestedLabel: 'Support' };
  }
  if (lowerMessage.includes('demo') || lowerMessage.includes('trial') || lowerMessage.includes('interested')) {
    return { intent: 'sales_inquiry', confidence: 0.95, suggestedLabel: 'Hot Lead' };
  }
  if (lowerMessage.includes('cancel') || lowerMessage.includes('unsubscribe')) {
    return { intent: 'churn_risk', confidence: 0.85, suggestedLabel: 'Follow Up' };
  }
  return { intent: 'general_inquiry', confidence: 0.75, suggestedLabel: 'New' };
};

export function AIAgentModule() {
  const [autoSendEnabled, setAutoSendEnabled] = useState(false);
  const [autoLabelEnabled, setAutoLabelEnabled] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [processedChats, setProcessedChats] = useState<Set<string>>(new Set());

  // Get unreplied chats (chats with unread messages)
  const unrepliedChats = mockChats.filter((c) => c.unreadCount > 0);

  const selectedChat = unrepliedChats.find((c) => c.id === selectedChatId);
  const aiSuggestion = selectedChatId ? getAISuggestionForChat(selectedChatId) : null;

  // Handle sending a suggestion
  const handleSendSuggestion = (suggestion: string) => {
    toast.success('Message sent', {
      description: 'AI-generated reply has been sent.',
    });
    setProcessedChats((prev) => new Set([...prev, selectedChatId!]));
  };

  // Handle applying a label
  const handleApplyLabel = (label: string) => {
    toast.success('Label applied', {
      description: `Added "${label}" label to the conversation.`,
    });
  };

  // Handle auto-labeling all chats
  const handleAutoLabelAll = () => {
    const count = unrepliedChats.length;
    toast.success('Auto-labeling complete', {
      description: `Processed ${count} conversations based on intent detection.`,
    });
  };

  // Handle processing all unreplied chats
  const handleProcessAll = () => {
    if (!autoSendEnabled) {
      toast.error('Auto-send disabled', {
        description: 'Enable auto-send to process all chats automatically.',
      });
      return;
    }

    const count = unrepliedChats.length;
    setProcessedChats(new Set(unrepliedChats.map((c) => c.id)));
    toast.success('Batch processing complete', {
      description: `Sent AI responses to ${count} conversations.`,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-semibold">AI Agent</h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered chat assistance and automation
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
            <Switch
              checked={autoLabelEnabled}
              onCheckedChange={setAutoLabelEnabled}
            />
            <span className="text-sm">Auto-label</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
            <Switch
              checked={autoSendEnabled}
              onCheckedChange={setAutoSendEnabled}
            />
            <span className="text-sm">Auto-send</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 p-6 border-b border-border bg-card/30">
        <Card className="bg-transparent border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <ClockIcon className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{unrepliedChats.length}</p>
                <p className="text-xs text-muted-foreground">Unreplied Chats</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-transparent border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{mockAISuggestions.length}</p>
                <p className="text-xs text-muted-foreground">AI Suggestions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-transparent border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <CheckIcon className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold">94%</p>
                <p className="text-xs text-muted-foreground">Accuracy Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-transparent border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <ZapIcon className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold">2</p>
                <p className="text-xs text-muted-foreground">Need Escalation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Unreplied Chats List */}
        <div className="w-[350px] border-r border-border overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-medium">Unreplied Conversations</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAutoLabelAll}
                className="text-xs"
              >
                <TagIcon className="w-3 h-3 mr-1" />
                Auto-label All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleProcessAll}
                className="text-xs"
              >
                <RefreshIcon className="w-3 h-3 mr-1" />
                Process All
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1">
            {unrepliedChats.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <CheckIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>All caught up!</p>
                <p className="text-sm mt-1">No unreplied messages</p>
              </div>
            ) : (
              unrepliedChats.map((chat) => {
                const suggestion = getAISuggestionForChat(chat.id);
                const isProcessed = processedChats.has(chat.id);
                const intent = chat.lastMessage
                  ? detectIntent(chat.lastMessage.content)
                  : null;

                return (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => setSelectedChatId(chat.id)}
                    className={cn(
                      'w-full p-4 text-left border-b border-border/50 hover:bg-secondary/50 transition-colors',
                      selectedChatId === chat.id && 'bg-secondary',
                      isProcessed && 'opacity-50'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={chat.contact.avatar} />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {chat.contact.name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{chat.contact.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(chat.updatedAt)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-0.5">
                          {chat.lastMessage?.content}
                        </p>

                        {/* Intent Detection */}
                        {intent && autoLabelEnabled && (
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-primary/10 border-primary/30 text-primary"
                            >
                              {intent.intent.replace('_', ' ')} ({Math.round(intent.confidence * 100)}%)
                            </Badge>
                            <Badge variant="secondary" className="text-[10px]">
                              {intent.suggestedLabel}
                            </Badge>
                          </div>
                        )}

                        <div className="flex items-center gap-1 mt-2">
                          {suggestion && (
                            <>
                              <SparklesIcon className="w-3 h-3 text-primary" />
                              <span className="text-xs text-primary">AI ready</span>
                            </>
                          )}
                          {suggestion?.escalationRequired && (
                            <Badge variant="destructive" className="ml-2 text-[10px] h-4">
                              Escalate
                            </Badge>
                          )}
                          {isProcessed && (
                            <Badge variant="secondary" className="ml-2 text-[10px] h-4">
                              Processed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </ScrollArea>
        </div>

        {/* AI Suggestions Panel */}
        <div className="flex-1 overflow-auto p-6">
          {selectedChat && aiSuggestion ? (
            <div className="max-w-2xl mx-auto">
              <Tabs defaultValue="suggestions" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="suggestions">Suggested Replies</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>

                {/* Suggestions Tab */}
                <TabsContent value="suggestions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <SparklesIcon className="w-5 h-5 text-primary" />
                        AI-Generated Replies
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {aiSuggestion.suggestions.map((suggestion, idx) => (
                        <div
                          key={`reply-${idx}`}
                          className="p-4 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/50 transition-colors"
                        >
                          <p className="text-sm">{suggestion}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              size="sm"
                              className="gap-2"
                              onClick={() => handleSendSuggestion(suggestion)}
                            >
                              <SendIcon className="w-4 h-4" />
                              Send
                            </Button>
                            <Button size="sm" variant="outline">
                              Edit & Send
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Analysis Tab */}
                <TabsContent value="analysis" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Conversation Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{aiSuggestion.summary}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Sentiment Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            'w-16 h-16 rounded-full flex items-center justify-center text-2xl',
                            aiSuggestion.sentiment === 'positive' && 'bg-emerald-500/20',
                            aiSuggestion.sentiment === 'negative' && 'bg-red-500/20',
                            aiSuggestion.sentiment === 'neutral' && 'bg-gray-500/20'
                          )}
                        >
                          {aiSuggestion.sentiment === 'positive' && '😊'}
                          {aiSuggestion.sentiment === 'negative' && '😟'}
                          {aiSuggestion.sentiment === 'neutral' && '😐'}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{aiSuggestion.sentiment}</p>
                          <p className="text-sm text-muted-foreground">
                            Based on message tone and content
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Intent Detection */}
                  {selectedChat.lastMessage && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Intent Detection</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {(() => {
                          const intent = detectIntent(selectedChat.lastMessage!.content);
                          return (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Detected Intent</span>
                                <Badge variant="outline" className="capitalize">
                                  {intent.intent.replace('_', ' ')}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Confidence</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-primary rounded-full"
                                      style={{ width: `${intent.confidence * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium">
                                    {Math.round(intent.confidence * 100)}%
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Suggested Label</span>
                                <Badge variant="secondary">{intent.suggestedLabel}</Badge>
                              </div>
                            </div>
                          );
                        })()}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Actions Tab */}
                <TabsContent value="actions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recommended Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {aiSuggestion.suggestedLabel && (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                          <div className="flex items-center gap-2">
                            <TagIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Add label: {aiSuggestion.suggestedLabel}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApplyLabel(aiSuggestion.suggestedLabel!)}
                          >
                            Apply
                          </Button>
                        </div>
                      )}
                      {aiSuggestion.suggestedFollowUp && (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                          <div className="flex items-center gap-2">
                            <ClockIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Schedule follow-up</span>
                          </div>
                          <Button size="sm" variant="outline">Schedule</Button>
                        </div>
                      )}
                      {aiSuggestion.suggestedStage && (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                          <div className="flex items-center gap-2">
                            <ZapIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Move to pipeline stage</span>
                          </div>
                          <Button size="sm" variant="outline">Update Stage</Button>
                        </div>
                      )}
                      {aiSuggestion.escalationRequired && (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-destructive">
                              Escalation Required
                            </span>
                          </div>
                          <Button size="sm" variant="destructive">Escalate Now</Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="justify-start">
                        <SendIcon className="w-4 h-4 mr-2" />
                        Send Best Reply
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <TagIcon className="w-4 h-4 mr-2" />
                        Auto-apply Labels
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <ClockIcon className="w-4 h-4 mr-2" />
                        Set Reminder
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <RefreshIcon className="w-4 h-4 mr-2" />
                        Regenerate Replies
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <SparklesIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-sm">Choose an unreplied chat to view AI suggestions</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
