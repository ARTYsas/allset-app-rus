
import { useState } from 'react';
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

const initialClients = [
  {
    id: 1,
    name: "ООО Тех Решения",
    email: "contact@techsolutions.com",
    phone: "+7 (495) 567-89-00",
    status: "Активен",
  },
  {
    id: 2,
    name: "ООО Диджитал Маркетинг",
    email: "hello@digitalmarketing.pro",
    phone: "+7 (495) 678-90-12",
    status: "Активен",
  },
  {
    id: 3,
    name: "Веб-Дизайн Студия",
    email: "info@webdesign.studio",
    phone: "+7 (495) 789-01-23",
    status: "Неактивен",
  }
];

const Clients = () => {
  const [clients, setClients] = useState(initialClients);
  const [selectedClient, setSelectedClient] = useState<null | typeof clients[0]>(null);
  const [editingClient, setEditingClient] = useState<null | typeof clients[0]>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<null | number>(null);
  const { toast } = useToast();

  const handleCreateClient = (data: ClientFormData) => {
    const newClient = {
      id: clients.length + 1,
      ...data
    };
    setClients([...clients, newClient]);
    toast({
      title: "Успешно",
      description: "Клиент успешно создан",
    });
  };

  const handleEditClient = (data: ClientFormData) => {
    if (!editingClient) return;
    
    const updatedClients = clients.map(client => 
      client.id === editingClient.id ? { ...client, ...data } : client
    );
    
    setClients(updatedClients);
    setEditingClient(null);
    
    toast({
      title: "Успешно",
      description: "Данные клиента обновлены",
    });
  };

  const handleDeleteClient = () => {
    if (clientToDelete === null) return;
    
    const updatedClients = clients.filter(client => client.id !== clientToDelete);
    setClients(updatedClients);
    setClientToDelete(null);
    setDeleteDialogOpen(false);
    
    toast({
      title: "Успешно",
      description: "Клиент успешно удален",
    });
  };

  const openDeleteDialog = (clientId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setClientToDelete(clientId);
    setDeleteDialogOpen(true);
  };

  const openEditDialog = (client: typeof clients[0], event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingClient(client);
  };

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
        {clients.map((client) => (
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
                <div className="flex items-center text-sm">
                  <Mail className="mr-2 h-4 w-4" />
                  {client.email}
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="mr-2 h-4 w-4" />
                  {client.phone}
                </div>
                <div className="mt-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    client.status === "Активен" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {client.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
