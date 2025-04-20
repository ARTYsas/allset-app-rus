
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Mail, Phone } from 'lucide-react';

const mockClients = [
  {
    id: 1,
    name: "Tech Solutions Inc.",
    email: "contact@techsolutions.com",
    phone: "+1 234 567 890",
    status: "Active",
  },
  {
    id: 2,
    name: "Digital Marketing Pro",
    email: "hello@digitalmarketing.pro",
    phone: "+1 345 678 901",
    status: "Active",
  },
  {
    id: 3,
    name: "Web Design Studio",
    email: "info@webdesign.studio",
    phone: "+1 456 789 012",
    status: "Inactive",
  }
];

const Clients = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your client relationships</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockClients.map((client) => (
          <Card key={client.id}>
            <CardHeader>
              <CardTitle className="text-xl">{client.name}</CardTitle>
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
                    client.status === "Active" 
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
    </div>
  );
};

export default Clients;
