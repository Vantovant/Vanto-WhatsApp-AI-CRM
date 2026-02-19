'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { mockPipeline, getContactsByStage } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  LayoutGridIcon,
  TableIcon,
  PlusIcon,
  MoreVerticalIcon,
} from '@/components/icons';
import { cn, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import type { Contact } from '@/lib/types';

interface SortableCardProps {
  contact: Contact;
}

function SortableCard({ contact }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: contact.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'kanban-card p-3',
        isDragging && 'opacity-50 shadow-2xl ring-2 ring-primary'
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={contact.avatar} />
            <AvatarFallback className="bg-primary/20 text-primary text-xs">
              {contact.name.split(' ').map((n) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{contact.name}</p>
            <p className="text-xs text-muted-foreground">
              {contact.customProperties.company || contact.phone}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <MoreVerticalIcon className="w-3 h-3" />
        </Button>
      </div>

      {contact.customProperties.budget && (
        <p className="text-sm font-medium text-primary mb-2">
          ${Number(contact.customProperties.budget).toLocaleString()}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {contact.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={cn(
                'text-[10px] px-1.5 py-0.5 rounded border',
                tag === 'Hot Lead' && 'badge-hot',
                tag === 'VIP' && 'badge-vip',
                tag === 'New' && 'badge-new'
              )}
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="text-[10px] text-muted-foreground">
          {formatDate(contact.lastInteraction)}
        </span>
      </div>
    </div>
  );
}

function ContactCard({ contact }: { contact: Contact }) {
  return (
    <div className="kanban-card p-3">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={contact.avatar} />
            <AvatarFallback className="bg-primary/20 text-primary text-xs">
              {contact.name.split(' ').map((n) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{contact.name}</p>
            <p className="text-xs text-muted-foreground">
              {contact.customProperties.company || contact.phone}
            </p>
          </div>
        </div>
      </div>

      {contact.customProperties.budget && (
        <p className="text-sm font-medium text-primary mb-2">
          ${Number(contact.customProperties.budget).toLocaleString()}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {contact.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={cn(
                'text-[10px] px-1.5 py-0.5 rounded border',
                tag === 'Hot Lead' && 'badge-hot',
                tag === 'VIP' && 'badge-vip',
                tag === 'New' && 'badge-new'
              )}
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="text-[10px] text-muted-foreground">
          {formatDate(contact.lastInteraction)}
        </span>
      </div>
    </div>
  );
}

export function CRMModule() {
  const { crmView, setCrmView, contacts, setContacts } = useApp();
  const [activeContact, setActiveContact] = useState<Contact | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const contact = contacts.find((c) => c.id === event.active.id);
    if (contact) {
      setActiveContact(contact);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveContact(null);

    if (!over) return;

    const activeContact = contacts.find((c) => c.id === active.id);
    if (!activeContact) return;

    // Check if dropped on a stage
    const targetStage = mockPipeline.stages.find((s) => s.id === over.id);
    if (targetStage && activeContact.pipelineStage !== targetStage.id) {
      // Update contact's stage
      const updatedContacts = contacts.map((c) =>
        c.id === active.id ? { ...c, pipelineStage: targetStage.id } : c
      );
      setContacts(updatedContacts);
      toast.success(`Moved ${activeContact.name} to ${targetStage.name}`, {
        description: 'Pipeline stage updated successfully.',
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-semibold">CRM Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Drag and drop cards to update stages
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-secondary/50 rounded-lg p-1">
            <Button
              variant={crmView === 'kanban' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setCrmView('kanban')}
              className="gap-2"
            >
              <LayoutGridIcon className="w-4 h-4" />
              Kanban
            </Button>
            <Button
              variant={crmView === 'table' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setCrmView('table')}
              className="gap-2"
            >
              <TableIcon className="w-4 h-4" />
              Table
            </Button>
          </div>
          <Button size="sm">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Deal
          </Button>
        </div>
      </div>

      {/* Content */}
      {crmView === 'kanban' ? (
        <KanbanView
          contacts={contacts}
          sensors={sensors}
          activeContact={activeContact}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      ) : (
        <TableView />
      )}
    </div>
  );
}

interface KanbanViewProps {
  contacts: Contact[];
  sensors: ReturnType<typeof useSensors>;
  activeContact: Contact | null;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

function KanbanView({ contacts, sensors, activeContact, onDragStart, onDragEnd }: KanbanViewProps) {
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 h-full min-w-max">
          {mockPipeline.stages.map((stage) => {
            const stageContacts = contacts.filter((c) => c.pipelineStage === stage.id);
            const totalValue = stageContacts.reduce(
              (sum, c) => sum + (Number(c.customProperties.budget) || 0),
              0
            );

            return (
              <div key={stage.id} className="kanban-column w-[300px] flex flex-col">
                {/* Column Header */}
                <div className="p-4 border-b border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      />
                      <h3 className="font-medium">{stage.name}</h3>
                      <Badge variant="secondary" className="ml-1">
                        {stageContacts.length}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  {totalValue > 0 && (
                    <p className="text-sm text-muted-foreground">
                      ${totalValue.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Cards - Droppable area */}
                <SortableContext
                  id={stage.id}
                  items={stageContacts.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <ScrollArea className="flex-1 p-2">
                    <div className="space-y-2 min-h-[200px]" data-stage={stage.id}>
                      {stageContacts.map((contact) => (
                        <SortableCard key={contact.id} contact={contact} />
                      ))}
                    </div>
                  </ScrollArea>
                </SortableContext>
              </div>
            );
          })}
        </div>
      </div>

      <DragOverlay>
        {activeContact && <ContactCard contact={activeContact} />}
      </DragOverlay>
    </DndContext>
  );
}

function TableView() {
  return (
    <div className="flex-1 p-6">
      <div className="bg-card rounded-xl border border-border p-6">
        <p className="text-muted-foreground text-center py-12">
          Table view - Same as Contacts module with pipeline focus
        </p>
      </div>
    </div>
  );
}
