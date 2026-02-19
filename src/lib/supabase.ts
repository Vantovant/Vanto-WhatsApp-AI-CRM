import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://urfyfuakgabieellbuce.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyZnlmdWFrZ2FiaWVlbGxidWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NDE2NjcsImV4cCI6MjA4NjIxNzY2N30.4JaSzSQUsz0__rAqTLFc5W3sJUkayahwAHHLf0zUDAk';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helpers
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
}

export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

// Contacts CRUD
export async function getContacts() {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('date_captured', { ascending: false });
  return { data, error };
}

export async function getContactById(id: string) {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
}

export async function createContact(contact: Database['public']['Tables']['contacts']['Insert']) {
  const { data, error } = await supabase
    .from('contacts')
    .insert(contact)
    .select()
    .single();
  return { data, error };
}

export async function updateContact(id: string, updates: Database['public']['Tables']['contacts']['Update']) {
  const { data, error } = await supabase
    .from('contacts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

export async function deleteContact(id: string) {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);
  return { error };
}

// Orders CRUD
export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('order_date', { ascending: false });
  return { data, error };
}

export async function getOrdersByContact(contactId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('contact_id', contactId)
    .order('order_date', { ascending: false });
  return { data, error };
}

export async function createOrder(order: Database['public']['Tables']['orders']['Insert']) {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single();
  return { data, error };
}

// Activities CRUD
export async function getActivities() {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function getActivitiesByContact(contactId: string) {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('contact_id', contactId)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function createActivity(activity: Database['public']['Tables']['activities']['Insert']) {
  const { data, error } = await supabase
    .from('activities')
    .insert(activity)
    .select()
    .single();
  return { data, error };
}

// WhatsApp Sync
export async function syncWhatsAppContacts(contacts: { name: string; phone: string }[]) {
  const { data, error } = await supabase.functions.invoke('whatsapp-sync', {
    body: { contacts },
  });
  return { data, error };
}

// Real-time subscriptions
export function subscribeToContacts(callback: (payload: unknown) => void) {
  return supabase
    .channel('contacts-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, callback)
    .subscribe();
}

export function subscribeToOrders(callback: (payload: unknown) => void) {
  return supabase
    .channel('orders-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, callback)
    .subscribe();
}

export function subscribeToActivities(callback: (payload: unknown) => void) {
  return supabase
    .channel('activities-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, callback)
    .subscribe();
}
