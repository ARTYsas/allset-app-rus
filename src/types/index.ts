
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Client {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  status: 'planning' | 'active' | 'completed' | 'on-hold' | 'cancelled';
  budget?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  projectId: string;
  clientId: string;
  number: string;
  date: Date;
  dueDate: Date;
  amount: number;
  tax?: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Document {
  id: string;
  name: string;
  type: 'contract' | 'agreement' | 'invoice' | 'receipt' | 'other';
  clientId?: string;
  projectId?: string;
  fileURL: string;
  createdAt: Date;
  updatedAt: Date;
}
