'use client';

import { useApp } from '@/lib/store';
import { getChatById, getNotesForContact, getActivitiesForContact, mockPipeline } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  PhoneIcon,
  MailIcon,
  BuildingIcon,
  TagIcon,
  ClockIcon,
  PlusIcon,
  EditIcon,
  XIcon,
} from '@/components/icons';
import { cn, formatDate } from '@/lib/utils';
import { useState } from 'react';

export function ContactPanel() {
  const { selectedChatId, setContactPanelOpen } = useApp();
  const [newNote, setNewNote] = useState('');

  const chat = selectedChatId ? getChatById(selectedChatId) : null;
  if (!chat) return null;

  const contact = chat.contact;
  const notes = getNotesForContact(contact.id);
  const activities = getActivitiesForContact(contact.id);
  const currentStage = mockPipeline.stages.find((s) => s.id === contact.pipelineStage);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="font-semibold">Contact Info</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setContactPanelOpen(false)}
          className="text-muted-foreground"
        >
          <XIcon className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Profile */}
          <div className="text-center">
            <Avatar className="w-20 h-20 mx-auto mb-3">
              <AvatarImage src={contact.avatar} alt={contact.name} />
              <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                {contact.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <h4 className="font-semibold text-lg">{contact.name}</h4>
            <p className="text-sm text-muted-foreground">{contact.phone}</p>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <PhoneIcon className="w-4 h-4 text-muted-foreground" />
              <span>{contact.phone}</span>
            </div>
            {contact.email && (
              <div className="flex items-center gap-3 text-sm">
                <MailIcon className="w-4 h-4 text-muted-foreground" />
                <span>{contact.email}</span>
              </div>
            )}
            {contact.customProperties.company && (
              <div className="flex items-center gap-3 text-sm">
                <BuildingIcon className="w-4 h-4 text-muted-foreground" />
                <span>{String(contact.customProperties.company)}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* CRM Stage */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Pipeline Stage
            </label>
            <Select defaultValue={contact.pipelineStage}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockPipeline.stages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      />
                      {stage.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Tags
              </label>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                <PlusIcon className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {contact.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={cn(
                    'text-xs',
                    tag === 'Hot Lead' && 'badge-hot',
                    tag === 'VIP' && 'badge-vip',
                    tag === 'New' && 'badge-new',
                    tag === 'Support' && 'badge-support'
                  )}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Custom Properties */}
          {Object.keys(contact.customProperties).length > 0 && (
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Properties
              </label>
              <div className="mt-2 space-y-2">
                {Object.entries(contact.customProperties).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-muted-foreground capitalize">{key}</span>
                    <span className="font-medium">
                      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Notes */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Notes
            </label>
            <Textarea
              placeholder="Add a note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="mt-2 min-h-[80px] bg-secondary/50 border-0"
            />
            <Button size="sm" className="mt-2 w-full" disabled={!newNote.trim()}>
              Add Note
            </Button>

            {notes.length > 0 && (
              <div className="mt-4 space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="p-3 rounded-lg bg-secondary/50 text-sm">
                    <p>{note.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDate(note.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Activity History */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Activity
            </label>
            <div className="mt-3 space-y-3">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div>
                      <p>{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No activity recorded</p>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
