'use client';

import { Sidebar } from './sidebar';
import { useApp } from '@/lib/store';
import { InboxModule } from '@/components/modules/inbox';
import { ContactsModule } from '@/components/modules/contacts';
import { CRMModule } from '@/components/modules/crm';
import { AutomationsModule } from '@/components/modules/automations';
import { AIAgentModule } from '@/components/modules/ai-agent';
import { WorkflowsModule } from '@/components/modules/workflows';
import { IntegrationsModule } from '@/components/modules/integrations';
import { APIConsoleModule } from '@/components/modules/api-console';
import { SettingsModule } from '@/components/modules/settings';

export function MainLayout() {
  const { activeModule } = useApp();

  const renderModule = () => {
    switch (activeModule) {
      case 'inbox':
        return <InboxModule />;
      case 'contacts':
        return <ContactsModule />;
      case 'crm':
        return <CRMModule />;
      case 'automations':
        return <AutomationsModule />;
      case 'ai-agent':
        return <AIAgentModule />;
      case 'workflows':
        return <WorkflowsModule />;
      case 'integrations':
        return <IntegrationsModule />;
      case 'api-console':
        return <APIConsoleModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <InboxModule />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        {renderModule()}
      </main>
    </div>
  );
}
