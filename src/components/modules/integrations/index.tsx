'use client';

import { useState } from 'react';
import { mockWebhooks } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  PlusIcon,
  WebhookIcon,
  CopyIcon,
  EditIcon,
  TrashIcon,
  RefreshIcon,
  EyeIcon,
  EyeOffIcon,
} from '@/components/icons';
import { cn, formatDateTime } from '@/lib/utils';

export function IntegrationsModule() {
  const [webhooks, setWebhooks] = useState(mockWebhooks);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const toggleWebhook = (id: string) => {
    setWebhooks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isActive: !w.isActive } : w))
    );
  };

  const toggleSecret = (id: string) => {
    setShowSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-semibold">Integrations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect external services and manage webhooks
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="webhooks" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 border-b border-border">
          <TabsList className="bg-transparent h-12">
            <TabsTrigger value="webhooks" className="data-[state=active]:bg-secondary">
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-secondary">
              Services
            </TabsTrigger>
            <TabsTrigger value="endpoints" className="data-[state=active]:bg-secondary">
              Custom Endpoints
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="flex-1 overflow-auto p-6 m-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">Webhook Manager</h2>
            <Button size="sm">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Webhook
            </Button>
          </div>

          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <Card key={webhook.id} className={cn(!webhook.isActive && 'opacity-60')}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <WebhookIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{webhook.name}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {webhook.events.length} events subscribed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={webhook.isActive}
                        onCheckedChange={() => toggleWebhook(webhook.id)}
                      />
                      <Button variant="ghost" size="icon">
                        <EditIcon className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* URL */}
                  <div>
                    <label className="text-xs text-muted-foreground">Endpoint URL</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        value={webhook.url}
                        readOnly
                        className="font-mono text-sm bg-secondary/50 border-0"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(webhook.url)}
                      >
                        <CopyIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Secret */}
                  <div>
                    <label className="text-xs text-muted-foreground">Secret Key</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type={showSecrets[webhook.id] ? 'text' : 'password'}
                        value={webhook.secretKey}
                        readOnly
                        className="font-mono text-sm bg-secondary/50 border-0"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleSecret(webhook.id)}
                      >
                        {showSecrets[webhook.id] ? (
                          <EyeOffIcon className="w-4 h-4" />
                        ) : (
                          <EyeIcon className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(webhook.secretKey)}
                      >
                        <CopyIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Events */}
                  <div>
                    <label className="text-xs text-muted-foreground">Events</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="secondary" className="font-mono text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      {webhook.lastTriggered
                        ? `Last triggered: ${formatDateTime(webhook.lastTriggered)}`
                        : 'Never triggered'}
                    </span>
                    <Button variant="outline" size="sm">
                      <RefreshIcon className="w-4 h-4 mr-2" />
                      Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="flex-1 overflow-auto p-6 m-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Slack', status: 'connected', icon: '💬' },
              { name: 'Salesforce', status: 'available', icon: '☁️' },
              { name: 'HubSpot', status: 'available', icon: '🔶' },
              { name: 'Zapier', status: 'connected', icon: '⚡' },
              { name: 'Google Sheets', status: 'available', icon: '📊' },
              { name: 'Custom CRM', status: 'available', icon: '🔧' },
            ].map((service) => (
              <Card key={service.name}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{service.name}</h3>
                      <p className="text-xs text-muted-foreground capitalize mt-0.5">
                        {service.status}
                      </p>
                    </div>
                    <Button
                      variant={service.status === 'connected' ? 'outline' : 'default'}
                      size="sm"
                    >
                      {service.status === 'connected' ? 'Configure' : 'Connect'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Endpoints Tab */}
        <TabsContent value="endpoints" className="flex-1 overflow-auto p-6 m-0">
          <Card>
            <CardHeader>
              <CardTitle>REST Endpoint Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Create custom REST endpoints to expose your CRM data.
              </p>
              <Button>
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Endpoint
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
