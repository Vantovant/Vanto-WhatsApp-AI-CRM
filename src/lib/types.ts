// User & Role Types
export type Role = 'super_admin' | 'admin' | 'agent';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  createdAt: Date;
}

export interface RolePermissions {
  crmEditing: boolean;
  workflowEditing: boolean;
  apiAccess: boolean;
  settingsAccess: boolean;
  aiAutoSendControl: boolean;
}

// Contact & CRM Types
export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'blocked';
  tags: string[];
  assignedTo?: string;
  lastInteraction: Date;
  leadSource?: string;
  notes?: string;
  customProperties: Record<string, string | number | boolean>;
  pipelineStage: string;
  createdAt: Date;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
}

export interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
}

// Chat & Message Types
export type MessageType = 'text' | 'image' | 'voice' | 'document' | 'video';
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';

export interface Message {
  id: string;
  chatId: string;
  content: string;
  type: MessageType;
  sender: 'user' | 'contact';
  status: MessageStatus;
  timestamp: Date;
  attachmentUrl?: string;
}

export interface Chat {
  id: string;
  contactId: string;
  contact: Contact;
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  labels: string[];
  assignedTo?: string;
  isPinned: boolean;
  isMuted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

// Note Types
export interface Note {
  id: string;
  contactId: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  isInternal: boolean;
}

// Activity Types
export interface Activity {
  id: string;
  contactId: string;
  type: 'message_sent' | 'message_received' | 'stage_changed' | 'tag_added' | 'note_added' | 'assigned';
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// Automation Types
export type TriggerType = 'incoming_message' | 'new_contact' | 'label_added' | 'stage_changed' | 'webhook_event' | 'manual';
export type ConditionType = 'message_contains' | 'has_tag' | 'stage_equals' | 'time_delay';
export type ActionType = 'send_message' | 'add_tag' | 'move_stage' | 'assign_owner' | 'send_notification' | 'call_webhook' | 'schedule_followup';

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action';
  nodeType: TriggerType | ConditionType | ActionType;
  config: Record<string, unknown>;
  position: { x: number; y: number };
  connections: string[];
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  nodes: WorkflowNode[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// AI Agent Types
export interface AISuggestion {
  id: string;
  chatId: string;
  suggestions: string[];
  summary: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  suggestedFollowUp?: Date;
  escalationRequired: boolean;
  suggestedLabel?: string;
  suggestedStage?: string;
  createdAt: Date;
}

// Integration Types
export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  secretKey: string;
  isActive: boolean;
  lastTriggered?: Date;
  createdAt: Date;
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  lastUsed?: Date;
  createdAt: Date;
  expiresAt?: Date;
}

export interface RequestLog {
  id: string;
  apiKeyId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
}

// Filter Types
export interface ChatFilter {
  type: 'all' | 'unread' | 'groups' | 'scheduled';
  labels: string[];
  searchQuery: string;
}

export interface ContactFilter {
  status?: string[];
  tags?: string[];
  assignedTo?: string[];
  pipelineStage?: string[];
  searchQuery?: string;
}
