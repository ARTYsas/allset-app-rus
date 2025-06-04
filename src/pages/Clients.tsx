
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Mail, Phone, Trash2, Edit } from 'lucide-react';
import { ClientFormDialog, ClientFormData } from '@/components/Client/ClientFormDialog';
import { ClientDetailsDialog } from '@/components/Client/ClientDetailsDialog';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useClients } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/supabaseTypes';

const Clients = () => {
  const { data: fetchedClients, isLoading, error, refetch } = useClients();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (fetchedClients) {
      setClients(fetchedClients);
    }
  }, [fetchedClients]);

  const handleCreateClient = async (data: ClientFormData) => {
    try {
      const { data: newClient, error } = await supabase
        .from('clients')
        .insert([{
          name: data.name,
          company: data.company || null,
          email: data.email,
          phone: data.phone || null,
          industry: data.industry || null
        }])
        .select();

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Клиент успешно создан",
      });

      refetch();
    } catch (error: any) {
      console.error('Error creating client:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать клиента",
        variant: "destructive"
      });
    }
  };

  const handleEditClient = async (data: ClientFormData) => {
    if (!editingClient) return;
    
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          name: data.name,
          company: data.company || null,
          email: data.email,
          phone: data.phone || null,
          industry: data.industry || null
        })
        .eq('id', editingClient.id);

      if (error) throw error;
      
      setEditingClient(null);
      
      toast({
        title: "Успешно",
        description: "Данные клиента обновлены",
      });
      
      refetch();
    } catch (error: any) {
      console.error('Error updating client:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить данные клиента",
        variant: "destructive"
      });
    }
  };

  const handleDeleteClient = async () => {
    if (clientToDelete === null) return;
    
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientToDelete);

      if (error) throw error;
      
      setClientToDelete(null);
      setDeleteDialogOpen(false);
      
      toast({
        title: "Успешно",
        description: "Клиент успешно удален",
      });
      
      refetch();
    } catch (error: any) {
      console.error('Error deleting client:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось удалить клиента",
        variant: "destructive"
      });
    }
  };

  const openDeleteDialog = (clientId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setClientToDelete(clientId);
    setDeleteDialogOpen(true);
  };

  const openEditDialog = (client: Client, event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingClient(client);
  };

  if (isLoading) {
    return <div className="flex justify-center p-12">Загрузка данных...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-6">Ошибка загрузки данных: {(error as Error).message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Клиенты</h1>
          <p className="text-muted-foreground">Управление отношениями с клиентами</p>
        </div>
        <ClientFormDialog
          trigger={
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Добавить клиента
            </Button>
          }
          onSubmit={handleCreateClient}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-muted-foreground">
            Пока нет клиентов. Добавьте своего первого клиента.
          </div>
        ) : (
          clients.map((client) => (
            <Card 
              key={client.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedClient(client)}
            >
              <CardHeader>
                <CardTitle className="text-xl flex justify-between items-start">
                  <span>{client.name}</span>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => openEditDialog(client, e)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => openDeleteDialog(client.id, e)}
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {client.company && (
                    <div className="text-sm">{client.company}</div>
                  )}
                  {client.industry && (
                    <div className="text-sm text-muted-foreground">
                      Сфера деятельности: {client.industry}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Client Details Dialog */}
      {selectedClient && (
        <ClientDetailsDialog
          client={selectedClient}
          open={!!selectedClient}
          onOpenChange={(open) => !open && setSelectedClient(null)}
        />
      )}

      {/* Edit Client Dialog */}
      {editingClient && (
        <ClientFormDialog
          trigger={<span />}
          open={!!editingClient}
          onOpenChange={(open) => !open && setEditingClient(null)}
          onSubmit={handleEditClient}
          defaultValues={editingClient}
          isEditing={true}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Клиент и все связанные с ним данные будут удалены.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClient} className="bg-red-500 hover:bg-red-700">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Clients;
