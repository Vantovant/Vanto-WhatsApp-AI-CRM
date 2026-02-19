'use client';

import { useState } from 'react';
import { mockAPIKeys, mockRequestLogs } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  KeyIcon,
  CopyIcon,
  TrashIcon,
  EyeIcon,
  EyeOffIcon,
  RefreshIcon,
} from '@/components/icons';
import { cn, formatDateTime } from '@/lib/utils';

export function APIConsoleModule() {
  const [apiKeys, setApiKeys] = useState(mockAPIKeys);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const toggleKey = (id: string) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const maskKey = (key: string) => {
    return `${key.substring(0, 15)}${'•'.repeat(20)}${key.substring(key.length - 4)}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-semibold">API Console</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage API keys and monitor usage
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="keys" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 border-b border-border">
          <TabsList className="bg-transparent h-12">
            <TabsTrigger value="keys" className="data-[state=active]:bg-secondary">
              API Keys
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-secondary">
              Request Logs
            </TabsTrigger>
            <TabsTrigger value="docs" className="data-[state=active]:bg-secondary">
              Documentation
            </TabsTrigger>
          </TabsList>
        </div>

        {/* API Keys Tab */}
        <TabsContent value="keys" className="flex-1 overflow-auto p-6 m-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">Your API Keys</h2>
            <Button size="sm">
              <PlusIcon className="w-4 h-4 mr-2" />
              Generate Key
            </Button>
          </div>

          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <Card key={apiKey.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <KeyIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{apiKey.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          Created {formatDateTime(apiKey.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Key */}
                  <div className="flex items-center gap-2 mb-4">
                    <Input
                      value={showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                      readOnly
                      className="font-mono text-sm bg-secondary/50 border-0"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleKey(apiKey.id)}
                    >
                      {showKeys[apiKey.id] ? (
                        <EyeOffIcon className="w-4 h-4" />
                      ) : (
                        <EyeIcon className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(apiKey.key)}
                    >
                      <CopyIcon className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Permissions */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {apiKey.permissions.map((perm) => (
                      <Badge key={perm} variant="secondary" className="font-mono text-xs">
                        {perm}
                      </Badge>
                    ))}
                  </div>

                  {/* Last Used */}
                  <p className="text-xs text-muted-foreground">
                    {apiKey.lastUsed
                      ? `Last used: ${formatDateTime(apiKey.lastUsed)}`
                      : 'Never used'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Usage Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Usage This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-3xl font-semibold">1,234</p>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold">45ms</p>
                  <p className="text-sm text-muted-foreground">Avg Response Time</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold">99.9%</p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Request Logs Tab */}
        <TabsContent value="logs" className="flex-1 overflow-auto m-0">
          <div className="p-6 pb-0 flex items-center justify-between">
            <h2 className="text-lg font-medium">Recent Requests</h2>
            <Button variant="outline" size="sm">
              <RefreshIcon className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
          <div className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Response Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRequestLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {formatDateTime(log.timestamp)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'font-mono text-xs',
                          log.method === 'GET' && 'text-emerald-500 border-emerald-500/30',
                          log.method === 'POST' && 'text-blue-500 border-blue-500/30',
                          log.method === 'PUT' && 'text-amber-500 border-amber-500/30',
                          log.method === 'DELETE' && 'text-red-500 border-red-500/30'
                        )}
                      >
                        {log.method}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{log.endpoint}</TableCell>
                    <TableCell>
                      <Badge
                        variant={log.statusCode >= 400 ? 'destructive' : 'secondary'}
                        className="font-mono"
                      >
                        {log.statusCode}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {log.responseTime}ms
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Documentation Tab */}
        <TabsContent value="docs" className="flex-1 overflow-auto p-6 m-0">
          <Card>
            <CardHeader>
              <CardTitle>API Reference</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <h3>Base URL</h3>
              <pre className="bg-secondary p-3 rounded-lg font-mono text-sm">
                https://api.vanto.io/v1
              </pre>

              <h3 className="mt-6">Authentication</h3>
              <p className="text-muted-foreground">
                Include your API key in the Authorization header:
              </p>
              <pre className="bg-secondary p-3 rounded-lg font-mono text-sm">
                Authorization: Bearer your_api_key
              </pre>

              <h3 className="mt-6">Endpoints</h3>
              <div className="space-y-3 mt-3">
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <Badge className="mb-2">GET</Badge>
                  <code className="text-sm">/contacts</code>
                  <p className="text-sm text-muted-foreground mt-1">List all contacts</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <Badge className="mb-2">POST</Badge>
                  <code className="text-sm">/contacts</code>
                  <p className="text-sm text-muted-foreground mt-1">Create a new contact</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <Badge className="mb-2">GET</Badge>
                  <code className="text-sm">/messages</code>
                  <p className="text-sm text-muted-foreground mt-1">List all messages</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <Badge className="mb-2">POST</Badge>
                  <code className="text-sm">/messages</code>
                  <p className="text-sm text-muted-foreground mt-1">Send a message</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
