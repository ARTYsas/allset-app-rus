
import { Timestamp, DocumentReference } from 'firebase/firestore';

export type FirebaseTimestamp = Timestamp;
export type FirebaseDocRef = DocumentReference;

export interface FirestoreDocument {
  id: string;
}

export interface WithTimestamps {
  createdAt: FirebaseTimestamp | Date;
  updatedAt: FirebaseTimestamp | Date;
}

export interface ClientDocument extends FirestoreDocument, WithTimestamps {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface ProjectDocument extends FirestoreDocument, WithTimestamps {
  name: string;
  clientId: string;
  description?: string;
  startDate: FirebaseTimestamp | Date;
  endDate?: FirebaseTimestamp | Date;
  status: 'planning' | 'active' | 'completed' | 'on-hold' | 'cancelled';
  budget?: number;
}

export interface TaskDocument extends FirestoreDocument, WithTimestamps {
  projectId: string;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: FirebaseTimestamp | Date;
  assignedTo?: string;
}

export interface InvoiceDocument extends FirestoreDocument, WithTimestamps {
  projectId: string;
  clientId: string;
  number: string;
  date: FirebaseTimestamp | Date;
  dueDate: FirebaseTimestamp | Date;
  amount: number;
  tax?: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItemDocument[];
}

export interface InvoiceItemDocument {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface DocumentDocument extends FirestoreDocument, WithTimestamps {
  name: string;
  type: 'contract' | 'agreement' | 'invoice' | 'receipt' | 'other';
  clientId?: string;
  projectId?: string;
  fileURL: string;
}
