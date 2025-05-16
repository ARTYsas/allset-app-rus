
// Типы для работы с данными из Supabase
export interface Client {
  id: string;
  name: string;
  company?: string;
  industry?: string;
  email?: string;
  phone?: string;
  status?: string;
  created_at?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  client_id?: string;
  start_date: string;
  end_date?: string;
  status: string;
  budget?: number;
  created_at?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  client_id?: string;
  project_id?: string;
  file_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  project_id?: string;
  file_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface Invoice {
  id: string;
  number: string;
  client_id: string;
  project_id: string;
  document_id?: string;
  amount: number;
  date: string;
  due_date: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  date: string;
  payment_method: string;
  created_at?: string;
}

export interface MonthlyIncome {
  id: string;
  month: string;
  revenue: number;
  projects: number;
  year: number;
  created_at?: string;
}
