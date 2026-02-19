import type {
  Contact,
  Order,
  Activity,
  Chat,
  Message,
  Workflow,
  LeadTemperature,
  CommunicationStatus,
  LeadType,
  InterestLevel,
  FocusArea,
  LeadPath,
  GOStatus,
} from './database.types';

// Users (team members)
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'super_admin' | 'admin' | 'agent';
  createdAt: Date;
}

export const mockUsers: TeamMember[] = [
  {
    id: 'user-1',
    name: 'Alex Thompson',
    email: 'alex@vanto.io',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    role: 'super_admin',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'user-2',
    name: 'Sarah Chen',
    email: 'sarah@vanto.io',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    role: 'admin',
    createdAt: new Date('2024-02-10'),
  },
  {
    id: 'user-3',
    name: 'Marcus Williams',
    email: 'marcus@vanto.io',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    role: 'agent',
    createdAt: new Date('2024-03-05'),
  },
];

// Labels based on CRM tag system
export const mockLabels = [
  // Temperature tags
  { id: 'temp-hot', name: 'Hot', color: '#ef4444', category: 'temperature' },
  { id: 'temp-warm', name: 'Warm', color: '#f59e0b', category: 'temperature' },
  { id: 'temp-cold', name: 'Cold', color: '#3b82f6', category: 'temperature' },
  // Type tags
  { id: 'type-prospect', name: 'Prospect', color: '#8b5cf6', category: 'type' },
  { id: 'type-reg-no-purchase', name: 'Registered_Nopurchase', color: '#06b6d4', category: 'type' },
  { id: 'type-purchase-no-status', name: 'Purchase_Nostatus', color: '#10b981', category: 'type' },
  { id: 'type-purchase-status', name: 'Purchase_Status', color: '#22c55e', category: 'type' },
  { id: 'type-expired', name: 'Expired', color: '#6b7280', category: 'type' },
  // Status tags
  { id: 'status-new', name: 'New', color: '#14b8a6', category: 'status' },
  { id: 'status-in-progress', name: 'In Progress', color: '#f59e0b', category: 'status' },
  { id: 'status-pending', name: 'Pending', color: '#eab308', category: 'status' },
  { id: 'status-completed', name: 'Completed', color: '#22c55e', category: 'status' },
];

// Pipeline based on Lead Type progression
export const mockPipeline = {
  id: 'pipeline-1',
  name: 'Lead Pipeline',
  stages: [
    { id: 'Prospect', name: 'Prospect', color: '#8b5cf6', order: 1 },
    { id: 'Registered_Nopurchase', name: 'Registered (No Purchase)', color: '#06b6d4', order: 2 },
    { id: 'Purchase_Nostatus', name: 'Purchase (No Status)', color: '#f59e0b', order: 3 },
    { id: 'Purchase_Status', name: 'Purchase (Active)', color: '#22c55e', order: 4 },
    { id: 'Expired', name: 'Expired', color: '#6b7280', order: 5 },
  ],
};

// Contacts matching CRM schema exactly
export const mockContacts: Contact[] = [
  {
    id: 'contact-1',
    user_id: 'user-1',
    full_name: 'Thabo Molefe',
    phone_number: '+27823456789',
    email_address: 'thabo.m@gmail.com',
    date_captured: '2025-02-10',
    city: 'Johannesburg',
    province: 'Gauteng',
    state: '',
    country: 'South Africa',
    lead_temperature: 'Hot',
    communication_status: 'In Progress',
    registration_status: 'Registered',
    lead_type: 'Purchase_Status',
    interest_level: 'High',
    focus_area: 'Both',
    lead_path: 'Distributor',
    sponsor_name: 'Alex Thompson',
    assigned_to: 'user-1',
    action_taken: 'Product demo completed',
    next_action: 'Follow up on order',
    meeting_time: '2025-02-20 14:00',
    aplgo_id: 'APL-12345',
    associate_status: 'Active',
    go_status: 'Builder',
    additional_notes: 'Very interested in health products. Looking to build a team.',
  },
  {
    id: 'contact-2',
    user_id: 'user-1',
    full_name: 'Nomvula Dlamini',
    phone_number: '+27834567890',
    email_address: 'nomvula.d@outlook.com',
    date_captured: '2025-02-15',
    city: 'Durban',
    province: 'KwaZulu-Natal',
    state: '',
    country: 'South Africa',
    lead_temperature: 'Warm',
    communication_status: 'New',
    registration_status: 'Not Registered',
    lead_type: 'Prospect',
    interest_level: 'Medium',
    focus_area: 'Health Transformation',
    lead_path: 'Customer',
    sponsor_name: '',
    assigned_to: 'user-2',
    action_taken: '',
    next_action: 'Initial call',
    meeting_time: '',
    aplgo_id: '',
    associate_status: '',
    go_status: '',
    additional_notes: 'Referred by existing customer. Interested in wellness products.',
  },
  {
    id: 'contact-3',
    user_id: 'user-1',
    full_name: 'Sipho Nkosi',
    phone_number: '+27845678901',
    email_address: 'sipho.n@yahoo.com',
    date_captured: '2025-02-12',
    city: 'Cape Town',
    province: 'Western Cape',
    state: '',
    country: 'South Africa',
    lead_temperature: 'Hot',
    communication_status: 'Pending',
    registration_status: 'Activated',
    lead_type: 'Purchase_Status',
    interest_level: 'High',
    focus_area: 'Business Opportunity',
    lead_path: 'Distributor',
    sponsor_name: 'Sarah Chen',
    assigned_to: 'user-2',
    action_taken: 'Signed up as associate',
    next_action: 'Training session',
    meeting_time: '2025-02-22 10:00',
    aplgo_id: 'APL-67890',
    associate_status: 'Active',
    go_status: 'Associate',
    additional_notes: 'Entrepreneur looking to expand income streams.',
  },
  {
    id: 'contact-4',
    user_id: 'user-1',
    full_name: 'Lerato Mokoena',
    phone_number: '+27856789012',
    email_address: 'lerato.m@gmail.com',
    date_captured: '2025-01-20',
    city: 'Pretoria',
    province: 'Gauteng',
    state: '',
    country: 'South Africa',
    lead_temperature: 'Cold',
    communication_status: 'Completed',
    registration_status: 'Registered',
    lead_type: 'Registered_Nopurchase',
    interest_level: 'Low',
    focus_area: 'Health Transformation',
    lead_path: 'Not sure yet',
    sponsor_name: '',
    assigned_to: 'user-3',
    action_taken: 'Sent product catalog',
    next_action: 'Follow up in 2 weeks',
    meeting_time: '',
    aplgo_id: '',
    associate_status: '',
    go_status: '',
    additional_notes: 'Registered but hasn\'t made a purchase yet. Needs more info.',
  },
  {
    id: 'contact-5',
    user_id: 'user-1',
    full_name: 'Bongani Zulu',
    phone_number: '+27867890123',
    email_address: 'bongani.z@icloud.com',
    date_captured: '2025-02-18',
    city: 'Bloemfontein',
    province: 'Free State',
    state: '',
    country: 'South Africa',
    lead_temperature: 'Warm',
    communication_status: 'In Progress',
    registration_status: 'Not Registered',
    lead_type: 'Prospect',
    interest_level: 'High',
    focus_area: 'Both',
    lead_path: 'Distributor',
    sponsor_name: '',
    assigned_to: 'user-1',
    action_taken: 'Initial WhatsApp conversation',
    next_action: 'Schedule product presentation',
    meeting_time: '',
    aplgo_id: '',
    associate_status: '',
    go_status: '',
    additional_notes: 'Very motivated. Asking about commission structure.',
  },
  {
    id: 'contact-6',
    user_id: 'user-1',
    full_name: 'Palesa Khumalo',
    phone_number: '+27878901234',
    email_address: 'palesa.k@gmail.com',
    date_captured: '2025-02-01',
    city: 'Polokwane',
    province: 'Limpopo',
    state: '',
    country: 'South Africa',
    lead_temperature: 'Hot',
    communication_status: 'In Progress',
    registration_status: 'Activated',
    lead_type: 'Purchase_Status',
    interest_level: 'High',
    focus_area: 'Health Transformation',
    lead_path: 'Customer',
    sponsor_name: 'Marcus Williams',
    assigned_to: 'user-3',
    action_taken: 'First order placed',
    next_action: 'Check product satisfaction',
    meeting_time: '2025-02-25 16:00',
    aplgo_id: 'APL-11111',
    associate_status: 'Customer',
    go_status: '',
    additional_notes: 'Happy with initial products. Potential for upsell.',
  },
];

// Orders
export const mockOrders: Order[] = [
  {
    id: 'order-1',
    user_id: 'user-1',
    order_id: 'ORD-2025-001',
    contact_name: 'Thabo Molefe',
    product: 'GRW Starter Pack',
    quantity: 1,
    amount: 2500,
    pv_amount: 150,
    status: 'Delivered',
    purchase_type: 'Initial',
    order_date: '2025-02-15',
    badges: ['First Order', 'Starter Pack'],
    source: 'whatsapp',
    contact_id: 'contact-1',
  },
  {
    id: 'order-2',
    user_id: 'user-1',
    order_id: 'ORD-2025-002',
    contact_name: 'Palesa Khumalo',
    product: 'AIR Drops',
    quantity: 2,
    amount: 1200,
    pv_amount: 80,
    status: 'Shipped',
    purchase_type: 'Repeat',
    order_date: '2025-02-18',
    badges: [],
    source: 'manual',
    contact_id: 'contact-6',
  },
  {
    id: 'order-3',
    user_id: 'user-1',
    order_id: 'ORD-2025-003',
    contact_name: 'Sipho Nkosi',
    product: 'Business Builder Kit',
    quantity: 1,
    amount: 5000,
    pv_amount: 300,
    status: 'Confirmed',
    purchase_type: 'Initial',
    order_date: '2025-02-19',
    badges: ['High Value', 'Business Kit'],
    source: 'whatsapp',
    contact_id: 'contact-3',
  },
];

// Activities
export const mockActivities: Activity[] = [
  {
    id: 'activity-1',
    user_id: 'user-1',
    activity_type: 'call',
    summary: 'Product presentation call',
    notes: 'Discussed GRW benefits and pricing. Very interested.',
    next_action: 'Send order form',
    contact_id: 'contact-1',
  },
  {
    id: 'activity-2',
    user_id: 'user-1',
    activity_type: 'whatsapp',
    summary: 'Follow-up message sent',
    notes: 'Sent product catalog and pricing sheet.',
    next_action: 'Wait for response',
    contact_id: 'contact-2',
  },
  {
    id: 'activity-3',
    user_id: 'user-1',
    activity_type: 'meeting',
    summary: 'Business opportunity presentation',
    notes: 'Explained compensation plan. Ready to sign up.',
    next_action: 'Process registration',
    contact_id: 'contact-3',
  },
];

// Chats (WhatsApp-style)
export const mockChats: (Chat & { contact?: Contact })[] = mockContacts.slice(0, 6).map((contact, index) => ({
  id: `chat-${index + 1}`,
  user_id: 'user-1',
  contact_id: contact.id,
  phone_number: contact.phone_number,
  contact_name: contact.full_name,
  last_message: getLastMessageForContact(contact),
  last_message_time: new Date(Date.now() - index * 3600000).toISOString(),
  unread_count: index === 1 ? 2 : index === 4 ? 1 : 0,
  is_group: false,
  labels: [contact.lead_temperature, contact.lead_type],
  assigned_to: contact.assigned_to,
  is_pinned: index === 0 || index === 2,
  is_muted: false,
  contact,
}));

function getLastMessageForContact(contact: Contact): string {
  const messages: Record<string, string> = {
    'contact-1': 'Perfect, I\'ll place my order today. Can you send me the payment details?',
    'contact-2': 'Hi, I\'m interested in learning more about your products.',
    'contact-3': 'When is the next training session? I want to get started.',
    'contact-4': 'I\'ll think about it and get back to you.',
    'contact-5': 'The commission structure sounds great! How do I sign up?',
    'contact-6': 'I love the products! Can I order more?',
  };
  return messages[contact.id] || 'Hello!';
}

// Messages for chats
export const getMessagesForChat = (chatId: string): Message[] => {
  const messages: Record<string, Message[]> = {
    'chat-1': [
      {
        id: 'msg-1-1',
        user_id: 'user-1',
        chat_id: 'chat-1',
        content: 'Hi Thabo! Thanks for your interest in APLGO products.',
        message_type: 'text',
        sender: 'user',
        status: 'read',
        attachment_url: null,
        created_at: new Date('2025-02-18T14:00:00').toISOString(),
      },
      {
        id: 'msg-1-2',
        chat_id: 'chat-1',
        user_id: 'user-1',
        content: 'Hi! Yes, I\'ve been hearing great things. What products do you recommend for energy?',
        message_type: 'text',
        sender: 'contact',
        status: 'read',
        attachment_url: null,
        created_at: new Date('2025-02-18T14:05:00').toISOString(),
      },
      {
        id: 'msg-1-3',
        chat_id: 'chat-1',
        user_id: 'user-1',
        content: 'For energy, I highly recommend the GRW drops. They\'re our most popular product!',
        message_type: 'text',
        sender: 'user',
        status: 'read',
        attachment_url: null,
        created_at: new Date('2025-02-18T14:10:00').toISOString(),
      },
      {
        id: 'msg-1-4',
        chat_id: 'chat-1',
        user_id: 'user-1',
        content: 'Perfect, I\'ll place my order today. Can you send me the payment details?',
        message_type: 'text',
        sender: 'contact',
        status: 'read',
        attachment_url: null,
        created_at: new Date('2025-02-18T14:30:00').toISOString(),
      },
    ],
  };

  return messages[chatId] || [
    {
      id: `msg-${chatId}-1`,
      user_id: 'user-1',
      chat_id: chatId,
      content: 'Hello! How can I help you today?',
      message_type: 'text',
      sender: 'user',
      status: 'delivered',
      attachment_url: null,
      created_at: new Date().toISOString(),
    },
  ];
};

// AI Suggestions
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
  detectedIntent?: string;
  confidence?: number;
  createdAt: Date;
}

export const mockAISuggestions: AISuggestion[] = [
  {
    id: 'ai-1',
    chatId: 'chat-1',
    suggestions: [
      'Great! I\'ll send you the payment details right away. You can pay via EFT or card.',
      'Here are the banking details: FNB, Account: 123456789. Reference: Your name + ORD001',
      'Once payment reflects, I\'ll process your order immediately. Delivery takes 2-3 days.',
    ],
    summary: 'Thabo is ready to place an order and requested payment details. High-intent buyer.',
    sentiment: 'positive',
    suggestedFollowUp: new Date('2025-02-19T10:00:00'),
    escalationRequired: false,
    suggestedLabel: 'Hot',
    suggestedStage: 'Purchase_Status',
    detectedIntent: 'purchase_ready',
    confidence: 0.95,
    createdAt: new Date('2025-02-18T14:35:00'),
  },
  {
    id: 'ai-2',
    chatId: 'chat-2',
    suggestions: [
      'Hi Nomvula! Welcome! I\'d love to tell you about our amazing health products. What health goals are you looking to achieve?',
      'Thank you for reaching out! Our products focus on cellular health and energy. Would you like me to share some information?',
      'Hello! Great to connect. Are you interested in products for yourself or also looking at the business opportunity?',
    ],
    summary: 'New prospect showing initial interest. Needs qualification.',
    sentiment: 'neutral',
    escalationRequired: false,
    suggestedLabel: 'Warm',
    suggestedStage: 'Prospect',
    detectedIntent: 'general_inquiry',
    confidence: 0.80,
    createdAt: new Date('2025-02-18T10:20:00'),
  },
  {
    id: 'ai-5',
    chatId: 'chat-5',
    suggestions: [
      'Great question! Our commission structure offers up to 30% on personal sales plus team bonuses. Want me to explain the full plan?',
      'I\'m glad you\'re excited! To sign up, you\'ll need to choose a starter pack. The Business Builder Kit is our most popular.',
      'The sign-up process is simple! I can guide you through it right now if you have 10 minutes.',
    ],
    summary: 'Hot lead asking about business opportunity. Very motivated, ready to sign up.',
    sentiment: 'positive',
    suggestedFollowUp: new Date('2025-02-19T09:00:00'),
    escalationRequired: false,
    suggestedLabel: 'Hot',
    suggestedStage: 'Registered_Nopurchase',
    detectedIntent: 'business_signup',
    confidence: 0.92,
    createdAt: new Date('2025-02-18T16:00:00'),
  },
];

// Workflows
export const mockWorkflows: Workflow[] = [
  {
    id: 'workflow-1',
    user_id: 'user-1',
    name: 'Welcome New Contacts',
    description: 'Automatically welcome new WhatsApp contacts',
    is_active: true,
    trigger_type: 'new_contact',
    trigger_config: {},
    actions: [
      { type: 'send_message', config: { message: 'Welcome to APLGO! Thanks for connecting.' } },
      { type: 'add_label', config: { label: 'New' } },
      { type: 'set_field', config: { field: 'communication_status', value: 'New' } },
    ],
  },
  {
    id: 'workflow-2',
    user_id: 'user-1',
    name: 'Hot Lead Follow-up',
    description: 'Follow up with hot leads after 24 hours',
    is_active: true,
    trigger_type: 'field_change',
    trigger_config: { field: 'lead_temperature', value: 'Hot' },
    actions: [
      { type: 'wait', config: { duration: 24, unit: 'hours' } },
      { type: 'send_message', config: { message: 'Hi! Just following up on our conversation. Any questions?' } },
    ],
  },
  {
    id: 'workflow-3',
    user_id: 'user-1',
    name: 'Order Confirmation',
    description: 'Send confirmation when order is placed',
    is_active: true,
    trigger_type: 'new_order',
    trigger_config: {},
    actions: [
      { type: 'send_message', config: { message: 'Thank you for your order! We\'ll process it right away.' } },
      { type: 'set_field', config: { field: 'lead_type', value: 'Purchase_Status' } },
      { type: 'notify', config: { channel: 'internal', message: 'New order received!' } },
    ],
  },
];

// Webhooks
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

export const mockWebhooks: Webhook[] = [
  {
    id: 'webhook-1',
    name: 'CRM Sync',
    url: 'https://urfyfuakgabieellbuce.supabase.co/functions/v1/whatsapp-sync',
    events: ['contact.created', 'contact.updated'],
    secretKey: 'whsec_vanto_crm_sync',
    isActive: true,
    lastTriggered: new Date('2025-02-18T14:30:00'),
    createdAt: new Date('2025-01-15'),
  },
  {
    id: 'webhook-2',
    name: 'Order Notifications',
    url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK',
    events: ['order.created', 'order.updated'],
    secretKey: 'whsec_order_notify',
    isActive: false,
    createdAt: new Date('2025-02-01'),
  },
];

// API Keys
export interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  lastUsed?: Date;
  createdAt: Date;
  expiresAt?: Date;
}

export const mockAPIKeys: APIKey[] = [
  {
    id: 'apikey-1',
    name: 'Production API',
    key: 'vanto_live_sk_' + 'x'.repeat(32),
    permissions: ['contacts:read', 'contacts:write', 'orders:read', 'orders:write'],
    lastUsed: new Date('2025-02-18T15:00:00'),
    createdAt: new Date('2025-01-10'),
  },
];

// Request Logs
export interface RequestLog {
  id: string;
  apiKeyId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
}

export const mockRequestLogs: RequestLog[] = [
  {
    id: 'log-1',
    apiKeyId: 'apikey-1',
    endpoint: '/rest/v1/contacts',
    method: 'GET',
    statusCode: 200,
    responseTime: 45,
    timestamp: new Date('2025-02-18T15:00:00'),
  },
  {
    id: 'log-2',
    apiKeyId: 'apikey-1',
    endpoint: '/functions/v1/whatsapp-sync',
    method: 'POST',
    statusCode: 200,
    responseTime: 320,
    timestamp: new Date('2025-02-18T14:55:00'),
  },
];

// Helper functions
export const getContactById = (id: string): Contact | undefined => {
  return mockContacts.find((c) => c.id === id);
};

export const getChatById = (id: string) => {
  return mockChats.find((c) => c.id === id);
};

export const getActivitiesForContact = (contactId: string): Activity[] => {
  return mockActivities.filter((a) => a.contact_id === contactId);
};

export const getOrdersForContact = (contactId: string): Order[] => {
  return mockOrders.filter((o) => o.contact_id === contactId);
};

export const getAISuggestionForChat = (chatId: string): AISuggestion | undefined => {
  return mockAISuggestions.find((s) => s.chatId === chatId);
};

export const getUnreadChatsCount = (): number => {
  return mockChats.filter((c) => c.unread_count > 0).length;
};

export const getContactsByStage = (stageId: string): Contact[] => {
  return mockContacts.filter((c) => c.lead_type === stageId);
};

// Current user (will be replaced by auth)
export const currentUser = mockUsers[0];
