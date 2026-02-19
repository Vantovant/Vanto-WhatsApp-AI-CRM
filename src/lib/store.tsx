'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Contact, Chat } from './database.types';
import { mockChats, mockContacts, mockLabels, mockPipeline, mockUsers, type TeamMember } from './mock-data';

interface ChatFilter {
  type: 'all' | 'unread' | 'groups' | 'scheduled';
  labels: string[];
  searchQuery: string;
}

interface ContactFilter {
  status?: string[];
  tags?: string[];
  assignedTo?: string[];
  leadType?: string[];
  searchQuery?: string;
}

interface AppState {
  // User (from props or default)
  user: TeamMember;

  // Navigation
  activeModule: string;
  setActiveModule: (module: string) => void;

  // Chats
  chats: (Chat & { contact?: Contact })[];
  selectedChatId: string | null;
  setSelectedChatId: (id: string | null) => void;
  chatFilter: ChatFilter;
  setChatFilter: (filter: ChatFilter) => void;

  // Contacts
  contacts: Contact[];
  setContacts: (contacts: Contact[]) => void;
  selectedContactId: string | null;
  setSelectedContactId: (id: string | null) => void;
  contactFilter: ContactFilter;
  setContactFilter: (filter: ContactFilter) => void;

  // CRM
  crmView: 'table' | 'kanban' | 'detail';
  setCrmView: (view: 'table' | 'kanban' | 'detail') => void;

  // Sidebar
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Contact panel
  contactPanelOpen: boolean;
  setContactPanelOpen: (open: boolean) => void;

  // Labels
  labels: typeof mockLabels;

  // Pipeline
  pipeline: typeof mockPipeline;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeModule, setActiveModule] = useState('contacts');
  const [selectedChatId, setSelectedChatId] = useState<string | null>('chat-1');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [chatFilter, setChatFilter] = useState<ChatFilter>({
    type: 'all',
    labels: [],
    searchQuery: '',
  });
  const [contactFilter, setContactFilter] = useState<ContactFilter>({});
  const [crmView, setCrmView] = useState<'table' | 'kanban' | 'detail'>('kanban');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [contactPanelOpen, setContactPanelOpen] = useState(true);

  // Default to first user for now (auth user will be passed separately)
  const user = mockUsers[0];

  const value: AppState = {
    user,
    activeModule,
    setActiveModule,
    chats: mockChats,
    selectedChatId,
    setSelectedChatId,
    chatFilter,
    setChatFilter,
    contacts,
    setContacts,
    selectedContactId,
    setSelectedContactId,
    contactFilter,
    setContactFilter,
    crmView,
    setCrmView,
    sidebarCollapsed,
    setSidebarCollapsed,
    contactPanelOpen,
    setContactPanelOpen,
    labels: mockLabels,
    pipeline: mockPipeline,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
