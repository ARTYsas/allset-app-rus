
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Client, Project, Document, FileItem, Invoice, Payment, MonthlyIncome } from '@/types/supabaseTypes';

// Хук для получения клиентов
export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Client[];
    }
  });
};

// Хук для получения проектов
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          clients(name, company)
        `)
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      return data.map(project => ({
        ...project,
        clientName: project.clients ? project.clients.name : '',
        clientCompany: project.clients ? project.clients.company : ''
      }));
    }
  });
};

// Хук для получения одного проекта по ID
export const useProject = (id: string | undefined) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          clients(id, name, company)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return {
        ...data,
        clientName: data.clients ? data.clients.name : '',
        clientCompany: data.clients ? data.clients.company : ''
      };
    },
    enabled: !!id
  });
};

// Хук для получения проектов клиента
export const useClientProjects = (clientId: string | undefined) => {
  return useQuery({
    queryKey: ['clientProjects', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', clientId)
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    },
    enabled: !!clientId
  });
};

// Хук для получения документов
export const useDocuments = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          clients(name),
          projects(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data.map(doc => ({
        ...doc,
        clientName: doc.clients ? doc.clients.name : '',
        projectName: doc.projects ? doc.projects.name : ''
      }));
    }
  });
};

// Хук для получения проектных документов
export const useProjectDocuments = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ['projectDocuments', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Document[];
    },
    enabled: !!projectId
  });
};

// Хук для получения файлов
export const useFiles = () => {
  return useQuery({
    queryKey: ['files'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('files')
        .select(`
          *,
          projects(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data.map(file => ({
        ...file,
        projectName: file.projects ? file.projects.name : ''
      }));
    }
  });
};

// Хук для получения проектных файлов
export const useProjectFiles = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ['projectFiles', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as FileItem[];
    },
    enabled: !!projectId
  });
};

// Хук для получения счетов
export const useInvoices = () => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          clients(name),
          projects(name),
          documents(name)
        `)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      return data.map(invoice => ({
        ...invoice,
        clientName: invoice.clients ? invoice.clients.name : '',
        projectName: invoice.projects ? invoice.projects.name : '',
        documentName: invoice.documents ? invoice.documents.name : '',
      }));
    }
  });
};

// Хук для получения платежей
export const usePayments = () => {
  return useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          invoices(number, client_id, project_id)
        `)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      const enhancedData = [];
      
      for (const payment of data) {
        if (payment.invoices) {
          const invoice = payment.invoices;
          
          // Получаем информацию о клиенте
          const { data: clientData } = await supabase
            .from('clients')
            .select('name')
            .eq('id', invoice.client_id)
            .single();
            
          // Получаем информацию о проекте
          const { data: projectData } = await supabase
            .from('projects')
            .select('name')
            .eq('id', invoice.project_id)
            .single();
          
          enhancedData.push({
            ...payment,
            invoiceNumber: invoice.number,
            clientName: clientData ? clientData.name : '',
            projectName: projectData ? projectData.name : '',
          });
        } else {
          enhancedData.push({
            ...payment,
            invoiceNumber: '',
            clientName: '',
            projectName: '',
          });
        }
      }
      
      return enhancedData;
    }
  });
};

// Хук для получения месячного дохода
export const useMonthlyIncome = () => {
  return useQuery({
    queryKey: ['monthlyIncome'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_income')
        .select('*')
        .order('year')
        .order('month');
      
      if (error) throw error;
      return data as MonthlyIncome[];
    }
  });
};
