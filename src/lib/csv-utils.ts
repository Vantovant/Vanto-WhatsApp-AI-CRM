import type { Contact } from './types';

// Export contacts to CSV
export function exportContactsToCSV(contacts: Contact[]): string {
  const headers = [
    'Name',
    'Phone',
    'Email',
    'Status',
    'Tags',
    'Pipeline Stage',
    'Lead Source',
    'Company',
    'Notes',
    'Created At',
  ];

  const rows = contacts.map((contact) => [
    contact.name,
    contact.phone,
    contact.email || '',
    contact.status,
    contact.tags.join('; '),
    contact.pipelineStage,
    contact.leadSource || '',
    String(contact.customProperties.company || ''),
    contact.notes || '',
    new Date(contact.createdAt).toISOString(),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  return csvContent;
}

// Download CSV file
export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Parse CSV content
export function parseCSV(content: string): string[][] {
  const lines = content.split('\n');
  const result: string[][] = [];

  for (const line of lines) {
    if (line.trim() === '') continue;

    const row: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    result.push(row);
  }

  return result;
}

// Import contacts from CSV
export function importContactsFromCSV(csvContent: string): Partial<Contact>[] {
  const rows = parseCSV(csvContent);
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.toLowerCase().replace(/[^a-z]/g, ''));
  const contacts: Partial<Contact>[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length === 0 || (row.length === 1 && row[0] === '')) continue;

    const contact: Partial<Contact> = {
      id: `imported-${Date.now()}-${i}`,
      status: 'active',
      tags: [],
      customProperties: {},
      pipelineStage: 'stage-1',
      createdAt: new Date(),
      lastInteraction: new Date(),
    };

    headers.forEach((header, index) => {
      const value = row[index] || '';

      switch (header) {
        case 'name':
          contact.name = value;
          break;
        case 'phone':
          contact.phone = value;
          break;
        case 'email':
          contact.email = value || undefined;
          break;
        case 'status':
          if (['active', 'inactive', 'blocked'].includes(value)) {
            contact.status = value as Contact['status'];
          }
          break;
        case 'tags':
          contact.tags = value.split(';').map((t) => t.trim()).filter(Boolean);
          break;
        case 'pipelinestage':
          contact.pipelineStage = value || 'stage-1';
          break;
        case 'leadsource':
          contact.leadSource = value || undefined;
          break;
        case 'company':
          if (value) contact.customProperties!.company = value;
          break;
        case 'notes':
          contact.notes = value || undefined;
          break;
      }
    });

    if (contact.name && contact.phone) {
      contacts.push(contact);
    }
  }

  return contacts;
}

// Generate sample CSV template
export function generateSampleCSV(): string {
  return `Name,Phone,Email,Status,Tags,Pipeline Stage,Lead Source,Company,Notes
John Doe,+1 555-123-4567,john@example.com,active,Hot Lead; VIP,stage-1,Website,Acme Corp,Important client
Jane Smith,+1 555-987-6543,jane@example.com,active,New,stage-2,Referral,Tech Inc,Follow up next week`;
}
