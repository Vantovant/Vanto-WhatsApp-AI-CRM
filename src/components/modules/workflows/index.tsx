'use client';

import { useState } from 'react';
import { mockWorkflows } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  PlusIcon,
  SearchIcon,
  ZapIcon,
  ChevronRightIcon,
  PlayIcon,
} from '@/components/icons';
import { cn } from '@/lib/utils';
import type { Workflow, WorkflowNode } from '@/lib/types';

export function WorkflowsModule() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(mockWorkflows[0]);

  const getNodeLabel = (node: WorkflowNode) => {
    const labels: Record<string, string> = {
      incoming_message: 'Incoming Message',
      new_contact: 'New Contact',
      label_added: 'Label Added',
      stage_changed: 'Stage Changed',
      webhook_event: 'Webhook Event',
      manual: 'Manual Trigger',
      message_contains: 'Message Contains',
      has_tag: 'Has Tag',
      stage_equals: 'Stage Equals',
      time_delay: 'Time Delay',
      send_message: 'Send Message',
      add_tag: 'Add Tag',
      move_stage: 'Move Stage',
      assign_owner: 'Assign Owner',
      send_notification: 'Send Notification',
      call_webhook: 'Call Webhook',
      schedule_followup: 'Schedule Follow-up',
    };
    return labels[node.nodeType] || node.nodeType;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-semibold">Workflow Builder</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Design visual automation workflows
          </p>
        </div>
        <Button size="sm">
          <PlusIcon className="w-4 h-4 mr-2" />
          New Workflow
        </Button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Workflows List */}
        <div className="w-[280px] border-r border-border overflow-auto">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9 bg-secondary/50 border-0 h-9"
              />
            </div>
          </div>
          <div className="p-2">
            {mockWorkflows.map((workflow) => (
              <button
                key={workflow.id}
                type="button"
                onClick={() => setSelectedWorkflow(workflow)}
                className={cn(
                  'w-full p-3 rounded-lg text-left transition-colors mb-1',
                  selectedWorkflow?.id === workflow.id
                    ? 'bg-secondary'
                    : 'hover:bg-secondary/50'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center',
                      workflow.isActive ? 'bg-primary/20' : 'bg-secondary'
                    )}
                  >
                    <ZapIcon
                      className={cn(
                        'w-4 h-4',
                        workflow.isActive ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{workflow.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {workflow.nodes.length} nodes
                    </p>
                  </div>
                  {workflow.isActive && (
                    <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                      Active
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Workflow Canvas */}
        <div className="flex-1 overflow-auto p-6 bg-[hsl(222,47%,5%)]">
          {selectedWorkflow ? (
            <div className="min-h-full">
              {/* Workflow Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-semibold">{selectedWorkflow.name}</h2>
                  {selectedWorkflow.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedWorkflow.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <PlayIcon className="w-4 h-4 mr-2" />
                    Test Run
                  </Button>
                  <Button size="sm">Save Changes</Button>
                </div>
              </div>

              {/* Visual Workflow */}
              <div className="flex items-center gap-4 flex-wrap">
                {selectedWorkflow.nodes.map((node, idx) => (
                  <div key={node.id} className="flex items-center gap-4">
                    <div
                      className={cn(
                        'workflow-node min-w-[200px]',
                        node.type === 'trigger' && 'workflow-node-trigger',
                        node.type === 'condition' && 'workflow-node-condition',
                        node.type === 'action' && 'workflow-node-action'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-[10px]',
                            node.type === 'trigger' && 'border-emerald-500/50 text-emerald-500',
                            node.type === 'condition' && 'border-amber-500/50 text-amber-500',
                            node.type === 'action' && 'border-cyan-500/50 text-cyan-500'
                          )}
                        >
                          {node.type}
                        </Badge>
                      </div>
                      <p className="font-medium">{getNodeLabel(node)}</p>
                      {node.config && Object.keys(node.config).length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {JSON.stringify(node.config).substring(0, 30)}...
                        </p>
                      )}
                    </div>
                    {idx < selectedWorkflow.nodes.length - 1 && (
                      <ChevronRightIcon className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                ))}

                {/* Add Node Button */}
                <button
                  type="button"
                  className="w-12 h-12 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center transition-colors"
                >
                  <PlusIcon className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Node Palette */}
              <div className="mt-12 p-6 rounded-xl bg-card border border-border">
                <h3 className="font-medium mb-4">Add Node</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Triggers</p>
                    <div className="space-y-1">
                      {['Incoming Message', 'New Contact', 'Label Added', 'Webhook Event'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          className="w-full p-2 text-left text-sm rounded-lg hover:bg-secondary/50 transition-colors border-l-2 border-emerald-500"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Conditions</p>
                    <div className="space-y-1">
                      {['Message Contains', 'Has Tag', 'Stage Equals', 'Time Delay'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          className="w-full p-2 text-left text-sm rounded-lg hover:bg-secondary/50 transition-colors border-l-2 border-amber-500"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Actions</p>
                    <div className="space-y-1">
                      {['Send Message', 'Add Tag', 'Move Stage', 'Call Webhook'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          className="w-full p-2 text-left text-sm rounded-lg hover:bg-secondary/50 transition-colors border-l-2 border-cyan-500"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>Select a workflow to edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
