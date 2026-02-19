'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase, getContacts, deleteContact, createContact } from '@/lib/supabase';
import { mockPipeline, mockUsers } from '@/lib/mock-data';
import type { Contact } from '@/lib/database.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  SearchIcon,
  PlusIcon,
  MoreVerticalIcon,
  DownloadIcon,
  UploadIcon,
  FilterIcon,
} from '@/components/icons';
import { cn, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import {
  exportContactsToCSV,
  downloadCSV,
  importContactsFromCSV,
  generateSampleCSV,
} from '@/lib/csv-utils';

export function ContactsModule() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importPreview, setImportPreview] = useState<Partial<Contact>[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load contacts from Supabase
  useEffect(() => {
    loadContacts();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('contacts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, () => {
        loadContacts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    const { data, error } = await getContacts();
    if (error) {
      toast.error('Failed to load contacts', { description: error.message });
    } else {
      setContacts(data || []);
    }
    setLoading(false);
  };

  const filteredContacts = contacts.filter((contact) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      contact.full_name.toLowerCase().includes(query) ||
      contact.phone_number.toLowerCase().includes(query) ||
      contact.email_address?.toLowerCase().includes(query)
    );
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredContacts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredContacts.map((c) => c.id));
    }
  };

  const getStage = (stageId: string) => mockPipeline.stages.find((s) => s.id === stageId);
  const getUser = (userId?: string) => mockUsers.find((u) => u.id === userId);

  // Export functionality
  const handleExport = () => {
    const contactsToExport = selectedIds.length > 0
      ? contacts.filter((c) => selectedIds.includes(c.id))
      : contacts;

    const csv = exportContactsToCSV(contactsToExport);
    downloadCSV(csv, `vanto-contacts-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Contacts exported', {
      description: `${contactsToExport.length} contacts exported to CSV.`,
    });
  };

  // Download sample template
  const handleDownloadTemplate = () => {
    const sample = generateSampleCSV();
    downloadCSV(sample, 'vanto-contacts-template.csv');
    toast.success('Template downloaded', {
      description: 'Use this template to import your contacts.',
    });
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const imported = importContactsFromCSV(content);

      if (imported.length === 0) {
        toast.error('Import failed', {
          description: 'No valid contacts found in the CSV file.',
        });
        return;
      }

      setImportPreview(imported);
      setImportDialogOpen(true);
    };
    reader.readAsText(file);

    // Reset input
    event.target.value = '';
  };

  // Confirm import
  const handleConfirmImport = async () => {
    setImportDialogOpen(false);

    let successCount = 0;
    let errorCount = 0;

    for (const contact of importPreview) {
      const { error } = await createContact(contact as any);
      if (error) {
        errorCount++;
      } else {
        successCount++;
      }
    }

    setImportPreview([]);

    if (successCount > 0) {
      toast.success('Contacts imported', {
        description: `${successCount} contacts added successfully.`,
      });
      loadContacts();
    }

    if (errorCount > 0) {
      toast.error('Some imports failed', {
        description: `${errorCount} contacts could not be imported.`,
      });
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    let successCount = 0;
    let errorCount = 0;

    for (const id of selectedIds) {
      const { error } = await deleteContact(id);
      if (error) {
        errorCount++;
      } else {
        successCount++;
      }
    }

    if (successCount > 0) {
      toast.success('Contacts deleted', {
        description: `${successCount} contacts removed.`,
      });
      loadContacts();
    }

    if (errorCount > 0) {
      toast.error('Some deletions failed', {
        description: `${errorCount} contacts could not be deleted.`,
      });
    }

    setSelectedIds([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-semibold">Contacts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {contacts.length} total contacts • Real-time Supabase sync
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <UploadIcon className="w-4 h-4 mr-2" />
                Import
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                Import from CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadTemplate}>
                Download Template
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export{selectedIds.length > 0 ? ` (${selectedIds.length})` : ''}
          </Button>
          <Button size="sm">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-border bg-card/30">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-9 bg-secondary/50 border-0"
          />
        </div>
        <Button variant="outline" size="sm">
          <FilterIcon className="w-4 h-4 mr-2" />
          Filters
        </Button>
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-muted-foreground">
              {selectedIds.length} selected
            </span>
            <Button variant="outline" size="sm">Bulk Edit</Button>
            <Button variant="outline" size="sm" className="text-destructive" onClick={handleBulkDelete}>
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.length === filteredContacts.length && filteredContacts.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Lead Type</TableHead>
              <TableHead>Temperature</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Date Captured</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.map((contact) => {
              const stage = getStage(contact.lead_type);
              const assignee = getUser(contact.assigned_to);

              return (
                <TableRow key={contact.id} className="table-row-hover">
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(contact.id)}
                      onCheckedChange={() => toggleSelect(contact.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.full_name}`} alt={contact.full_name} />
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          {contact.full_name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{contact.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{contact.phone_number}</TableCell>
                  <TableCell className="text-muted-foreground">{contact.email_address || '-'}</TableCell>
                  <TableCell>
                    {stage && (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: stage.color }}
                        />
                        <span className="text-sm">{stage.name}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs',
                        contact.lead_temperature === 'Hot' && 'badge-hot',
                        contact.lead_temperature === 'Warm' && 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                        contact.lead_temperature === 'Cold' && 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      )}
                    >
                      {contact.lead_temperature}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={assignee.avatar} />
                          <AvatarFallback className="text-[10px]">
                            {assignee.name.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(new Date(contact.date_captured))}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVerticalIcon className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Import Preview Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Contacts</DialogTitle>
            <DialogDescription>
              Review the contacts to be imported. {importPreview.length} contacts found.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Temperature</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importPreview.slice(0, 10).map((contact, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{contact.full_name}</TableCell>
                    <TableCell>{contact.phone_number}</TableCell>
                    <TableCell>{contact.email_address || '-'}</TableCell>
                    <TableCell>{contact.lead_temperature || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {importPreview.length > 10 && (
              <p className="text-sm text-muted-foreground text-center py-2">
                And {importPreview.length - 10} more contacts...
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmImport}>
              Import {importPreview.length} Contacts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
