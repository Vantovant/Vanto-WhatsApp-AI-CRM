'use client';

import { cn } from '@/lib/utils';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  InboxIcon,
  ContactsIcon,
  CRMIcon,
  AutomationIcon,
  AIIcon,
  WorkflowIcon,
  IntegrationIcon,
  APIIcon,
  SettingsIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LogOutIcon,
  BellIcon,
} from '@/components/icons';
import { getUnreadChatsCount } from '@/lib/mock-data';
import { toast } from 'sonner';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'inbox', label: 'Inbox', icon: InboxIcon },
  { id: 'contacts', label: 'Contacts', icon: ContactsIcon },
  { id: 'crm', label: 'CRM', icon: CRMIcon },
  { id: 'automations', label: 'Automations', icon: AutomationIcon },
  { id: 'ai-agent', label: 'AI Agent', icon: AIIcon },
  { id: 'workflows', label: 'Workflows', icon: WorkflowIcon },
  { id: 'integrations', label: 'Integrations', icon: IntegrationIcon },
  { id: 'api-console', label: 'API Console', icon: APIIcon },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export function Sidebar() {
  const { activeModule, setActiveModule, sidebarCollapsed, setSidebarCollapsed, user } = useApp();
  const { logout } = useAuth();
  const unreadCount = getUnreadChatsCount();

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'flex flex-col h-screen bg-[hsl(var(--sidebar-background))] border-r border-border transition-all duration-300',
          sidebarCollapsed ? 'w-[72px]' : 'w-[240px]'
        )}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">V</span>
            </div>
            {!sidebarCollapsed && (
              <span className="font-semibold text-lg tracking-tight animate-fade-in">Vanto</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            const badge = item.id === 'inbox' ? unreadCount : undefined;

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setActiveModule(item.id)}
                    className={cn(
                      'nav-item w-full relative',
                      isActive && 'active'
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="font-medium animate-fade-in">{item.label}</span>
                    )}
                    {badge && badge > 0 && (
                      <span className={cn(
                        'absolute flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-medium rounded-full bg-primary text-primary-foreground',
                        sidebarCollapsed ? 'top-0 right-0' : 'right-3'
                      )}>
                        {badge}
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                {sidebarCollapsed && (
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                    {badge && badge > 0 && ` (${badge})`}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        {/* Collapse Button */}
        <div className="p-3 border-t border-border">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={cn(
                  'w-full justify-center text-muted-foreground hover:text-foreground',
                  !sidebarCollapsed && 'justify-start'
                )}
              >
                {sidebarCollapsed ? (
                  <ChevronRightIcon className="w-4 h-4" />
                ) : (
                  <>
                    <ChevronLeftIcon className="w-4 h-4 mr-2" />
                    <span>Collapse</span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            {sidebarCollapsed && (
              <TooltipContent side="right">Expand sidebar</TooltipContent>
            )}
          </Tooltip>
        </div>

        {/* User Profile */}
        <div className="p-3 border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  'flex items-center gap-3 w-full p-2 rounded-lg hover:bg-secondary/50 transition-colors',
                  sidebarCollapsed && 'justify-center'
                )}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary/20 text-primary text-sm">
                    {user.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {!sidebarCollapsed && (
                  <div className="flex-1 text-left animate-fade-in">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role.replace('_', ' ')}</p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast.info('Notifications coming soon!')}>
                <BellIcon className="w-4 h-4 mr-2" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveModule('settings')}>
                <SettingsIcon className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOutIcon className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </TooltipProvider>
  );
}
