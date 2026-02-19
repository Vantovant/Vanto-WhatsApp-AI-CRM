'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { mockUsers } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  UserIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
} from '@/components/icons';
import { cn } from '@/lib/utils';
import type { Role } from '@/lib/types';

const rolePermissions: Record<Role, { label: string; permissions: string[] }> = {
  super_admin: {
    label: 'Super Admin',
    permissions: ['Full access to all features', 'User management', 'Billing access', 'API management'],
  },
  admin: {
    label: 'Admin',
    permissions: ['CRM management', 'Workflow editing', 'Team settings', 'AI controls'],
  },
  agent: {
    label: 'Agent',
    permissions: ['Chat access', 'Contact viewing', 'Basic CRM actions'],
  },
};

export function SettingsModule() {
  const { user } = useApp();
  const [users, setUsers] = useState(mockUsers);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account and team settings
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="flex-1 flex overflow-hidden">
        <div className="w-[220px] border-r border-border p-4">
          <TabsList className="flex flex-col h-auto w-full bg-transparent gap-1">
            <TabsTrigger
              value="profile"
              className="w-full justify-start data-[state=active]:bg-secondary"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="w-full justify-start data-[state=active]:bg-secondary"
            >
              Team & Roles
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="w-full justify-start data-[state=active]:bg-secondary"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="w-full justify-start data-[state=active]:bg-secondary"
            >
              Appearance
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="w-full justify-start data-[state=active]:bg-secondary"
            >
              Security
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto">
          {/* Profile Tab */}
          <TabsContent value="profile" className="p-6 m-0">
            <div className="max-w-2xl space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                        {user.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">Change Photo</Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG or GIF. Max 2MB.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input defaultValue={user.name} />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input defaultValue={user.email} type="email" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {user.role.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Contact an admin to change your role
                      </span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="p-6 m-0">
            <div className="space-y-6">
              {/* Team Members */}
              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage your team and their roles</CardDescription>
                  </div>
                  <Button size="sm">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Invite Member
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-12" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={u.avatar} />
                                <AvatarFallback className="text-xs">
                                  {u.name.split(' ').map((n) => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{u.name}</p>
                                <p className="text-xs text-muted-foreground">{u.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select defaultValue={u.role}>
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="super_admin">Super Admin</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="agent">Agent</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-500">
                              Active
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              disabled={u.id === user.id}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Role Permissions */}
              <Card>
                <CardHeader>
                  <CardTitle>Role Permissions</CardTitle>
                  <CardDescription>Overview of permissions for each role</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {Object.entries(rolePermissions).map(([role, { label, permissions }]) => (
                      <div key={role} className="p-4 rounded-lg bg-secondary/30 border border-border">
                        <h4 className="font-medium mb-3">{label}</h4>
                        <ul className="space-y-2">
                          {permissions.map((perm) => (
                            <li key={perm} className="flex items-center gap-2 text-sm">
                              <CheckIcon className="w-4 h-4 text-primary" />
                              {perm}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="p-6 m-0">
            <div className="max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { id: 'new_message', label: 'New messages', desc: 'Get notified for new incoming messages' },
                    { id: 'mentions', label: 'Mentions', desc: 'Get notified when someone mentions you' },
                    { id: 'assignments', label: 'Chat assignments', desc: 'Get notified when a chat is assigned to you' },
                    { id: 'escalations', label: 'Escalations', desc: 'Get notified for escalated conversations' },
                    { id: 'ai_suggestions', label: 'AI suggestions', desc: 'Get notified for AI-generated suggestions' },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="p-6 m-0">
            <div className="max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize the look and feel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 justify-start gap-2 bg-secondary">
                        <div className="w-4 h-4 rounded-full bg-zinc-900" />
                        Dark
                        <CheckIcon className="w-4 h-4 ml-auto text-primary" />
                      </Button>
                      <Button variant="outline" className="flex-1 justify-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-white border" />
                        Light
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Accent Color</Label>
                    <div className="flex gap-2">
                      {['#14b8a6', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'].map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={cn(
                            'w-8 h-8 rounded-full transition-transform hover:scale-110',
                            color === '#14b8a6' && 'ring-2 ring-offset-2 ring-offset-background ring-primary'
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Compact mode</p>
                      <p className="text-sm text-muted-foreground">Use smaller spacing</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="p-6 m-0">
            <div className="max-w-2xl space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input type="password" />
                  </div>
                  <Button>Update Password</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">2FA is disabled</p>
                      <p className="text-sm text-muted-foreground">
                        Protect your account with two-factor authentication
                      </p>
                    </div>
                    <Button>Enable 2FA</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-xs text-muted-foreground">Chrome on macOS</p>
                      </div>
                      <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-500">
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
