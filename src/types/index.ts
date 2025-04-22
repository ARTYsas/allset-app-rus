
export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  assignedTo?: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  projectId: string;
  number: string;
  date: Date;
  dueDate: Date;
  amount: number;
  status: 'draft' | 'pending' | 'paid' | 'overdue';
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
