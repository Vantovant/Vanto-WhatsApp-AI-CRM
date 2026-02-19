'use client';

import { useState } from 'react';
import { mockWorkflows } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  PlusIcon,
  SearchIcon,
  MoreVerticalIcon,
  PlayIcon,
  PauseIcon,
  ZapIcon,
  EditIcon,
  TrashIcon,
} from '@/components/icons';
import { cn, formatDate } from '@/lib/utils';

export function AutomationsModule() {
  const [searchQuery, setSearchQuery] = useState('');
  const [workflows, setWorkflows] = useState(mockWorkflows);

  const filteredWorkflows = workflows.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isActive: !w.isActive } : w))
    );
  };

  const getTriggerLabel = (nodeType: string) => {
    const labels: Record<string, string> = {
      incoming_message: 'Incoming Message',
      new_contact: 'New Contact',
      label_added: 'Label Added',
      stage_changed: 'Stage Changed',
      webhook_event: 'Webhook Event',
      manual: 'Manual Trigger',
    };
    return labels[nodeType] || nodeType;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-semibold">Automations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build automated workflows to save time
          </p>
        </div>
        <Button size="sm">
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Automation
        </Button>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 border-b border-border bg-card/30">
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search automations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-secondary/50 border-0"
          />
        </div>
      </div>

      {/* Workflow Cards */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorkflows.map((workflow) => {
            const triggerNode = workflow.nodes.find((n) => n.type === 'trigger');
            const actionCount = workflow.nodes.filter((n) => n.type === 'action').length;

            return (
              <Card
                key={workflow.id}
                className={cn(
                  'transition-all duration-200 hover:border-primary/50',
                  workflow.isActive && 'border-primary/30 bg-primary/5'
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center',
                          workflow.isActive ? 'bg-primary/20' : 'bg-secondary'
                        )}
                      >
                        <ZapIcon
                          className={cn(
                            'w-5 h-5',
                            workflow.isActive ? 'text-primary' : 'text-muted-foreground'
                          )}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-base">{workflow.name}</CardTitle>
                        {workflow.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {workflow.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVerticalIcon className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <EditIcon className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <TrashIcon className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Trigger */}
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-muted-foreground">Trigger:</span>
                      <span>{triggerNode ? getTriggerLabel(triggerNode.nodeType) : '-'}</span>
                    </div>

                    {/* Actions Count */}
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-cyan-500" />
                      <span className="text-muted-foreground">Actions:</span>
                      <span>{actionCount}</span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={workflow.isActive}
                          onCheckedChange={() => toggleWorkflow(workflow.id)}
                        />
                        <span className="text-sm text-muted-foreground">
                          {workflow.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Updated {formatDate(workflow.updatedAt)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Add New Card */}
          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-muted-foreground">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
                <PlusIcon className="w-6 h-6" />
              </div>
              <p className="font-medium">Create New Automation</p>
              <p className="text-sm mt-1">Set up triggers and actions</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
