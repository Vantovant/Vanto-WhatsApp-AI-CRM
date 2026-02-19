// Database types matching the CRM schema exactly

export type LeadTemperature = 'Hot' | 'Warm' | 'Cold';
export type CommunicationStatus = 'New' | 'In Progress' | 'Pending' | 'Completed';
export type RegistrationStatus = 'Registered' | 'Not Registered' | 'Activated';
export type LeadType = 'Prospect' | 'Registered_Nopurchase' | 'Purchase_Nostatus' | 'Purchase_Status' | 'Expired';
export type InterestLevel = 'High' | 'Medium' | 'Low';
export type FocusArea = 'Health Transformation' | 'Business Opportunity' | 'Both';
export type LeadPath = 'Customer' | 'Distributor' | 'Not sure yet';
export type GOStatus = 'Promoter' | 'Associate' | 'Builder' | 'Diamond' | '';
export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
export type ActivityType = 'note' | 'call' | 'meeting' | 'email' | 'whatsapp' | 'follow_up';

export interface Database {
  public: {
    Tables: {
      contacts: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          phone_number: string;
          email_address: string;
          date_captured: string;
          city: string;
          province: string;
          state: string;
          country: string;
          lead_temperature: LeadTemperature;
          communication_status: CommunicationStatus;
          registration_status: RegistrationStatus;
          lead_type: LeadType;
          interest_level: InterestLevel;
          focus_area: FocusArea;
          lead_path: LeadPath;
          sponsor_name: string;
          assigned_to: string;
          action_taken: string;
          next_action: string;
          meeting_time: string;
          aplgo_id: string;
          associate_status: string;
          go_status: GOStatus;
          additional_notes: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          full_name: string;
          phone_number?: string;
          email_address?: string;
          date_captured?: string;
          city?: string;
          province?: string;
          state?: string;
          country?: string;
          lead_temperature?: LeadTemperature;
          communication_status?: CommunicationStatus;
          registration_status?: RegistrationStatus;
          lead_type?: LeadType;
          interest_level?: InterestLevel;
          focus_area?: FocusArea;
          lead_path?: LeadPath;
          sponsor_name?: string;
          assigned_to?: string;
          action_taken?: string;
          next_action?: string;
          meeting_time?: string;
          aplgo_id?: string;
          associate_status?: string;
          go_status?: GOStatus;
          additional_notes?: string;
        };
        Update: Partial<Database['public']['Tables']['contacts']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          order_id: string;
          contact_name: string;
          product: string;
          quantity: number;
          amount: number;
          pv_amount: number;
          status: OrderStatus;
          purchase_type: string;
          order_date: string;
          badges: string[];
          source: string;
          contact_id: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          order_id?: string;
          contact_name?: string;
          product?: string;
          quantity?: number;
          amount?: number;
          pv_amount?: number;
          status?: OrderStatus;
          purchase_type?: string;
          order_date?: string;
          badges?: string[];
          source?: string;
          contact_id?: string | null;
        };
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      activities: {
        Row: {
          id: string;
          user_id: string;
          activity_type: ActivityType;
          summary: string;
          notes: string;
          next_action: string;
          contact_id: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          activity_type?: ActivityType;
          summary?: string;
          notes?: string;
          next_action?: string;
          contact_id?: string | null;
        };
        Update: Partial<Database['public']['Tables']['activities']['Insert']>;
      };
      // WhatsApp-specific tables for the CRM
      chats: {
        Row: {
          id: string;
          user_id: string;
          contact_id: string | null;
          phone_number: string;
          contact_name: string;
          last_message: string;
          last_message_time: string;
          unread_count: number;
          is_group: boolean;
          labels: string[];
          assigned_to: string;
          is_pinned: boolean;
          is_muted: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          contact_id?: string | null;
          phone_number: string;
          contact_name: string;
          last_message?: string;
          last_message_time?: string;
          unread_count?: number;
          is_group?: boolean;
          labels?: string[];
          assigned_to?: string;
          is_pinned?: boolean;
          is_muted?: boolean;
        };
        Update: Partial<Database['public']['Tables']['chats']['Insert']>;
      };
      messages: {
        Row: {
          id: string;
          user_id: string;
          chat_id: string;
          content: string;
          message_type: 'text' | 'image' | 'voice' | 'document' | 'video';
          sender: 'user' | 'contact';
          status: 'sent' | 'delivered' | 'read' | 'failed';
          attachment_url: string | null;
          created_at?: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          chat_id: string;
          content: string;
          message_type?: 'text' | 'image' | 'voice' | 'document' | 'video';
          sender: 'user' | 'contact';
          status?: 'sent' | 'delivered' | 'read' | 'failed';
          attachment_url?: string | null;
        };
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
      // Automations/Workflows
      workflows: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          is_active: boolean;
          trigger_type: string;
          trigger_config: Record<string, unknown>;
          actions: Record<string, unknown>[];
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          description?: string;
          is_active?: boolean;
          trigger_type: string;
          trigger_config?: Record<string, unknown>;
          actions?: Record<string, unknown>[];
        };
        Update: Partial<Database['public']['Tables']['workflows']['Insert']>;
      };
    };
  };
}

// Convenience types
export type Contact = Database['public']['Tables']['contacts']['Row'];
export type ContactInsert = Database['public']['Tables']['contacts']['Insert'];
export type ContactUpdate = Database['public']['Tables']['contacts']['Update'];

export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];

export type Activity = Database['public']['Tables']['activities']['Row'];
export type ActivityInsert = Database['public']['Tables']['activities']['Insert'];

export type Chat = Database['public']['Tables']['chats']['Row'];
export type ChatInsert = Database['public']['Tables']['chats']['Insert'];

export type Message = Database['public']['Tables']['messages']['Row'];
export type MessageInsert = Database['public']['Tables']['messages']['Insert'];

export type Workflow = Database['public']['Tables']['workflows']['Row'];
export type WorkflowInsert = Database['public']['Tables']['workflows']['Insert'];
