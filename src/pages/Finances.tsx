
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Filter, Download, PlusCircle, FileText, Check, CreditCard } from 'lucide-react';
import { InvoiceSelectDialog } from '@/components/Finance/InvoiceSelectDialog';
import { useToast } from '@/hooks/use-toast';

// Mock invoices
const mockInvoices = [
  {
    id: 1,
    number: "INV-2024-001",
    client: "Tech Solutions Inc.",
    project: "E-commerce Platform Redesign",
    amount: 5000,
    date: "2024-03-10",
    dueDate: "2024-04-10",
    status: "Paid"
  },
  {
    id: 2,
    number: "INV-2024-002",
    client: "Digital Marketing Pro",
    project: "SEO Optimization Campaign",
    amount: 2500,
    date: "2024-03-15",
    dueDate: "2024-04-15",
    status: "Pending"
  },
  {
    id: 3,
    number: "INV-2024-003",
    client: "Web Design Studio",
    project: "Mobile App Development",
    amount: 7500,
    date: "2024-03-20",
    dueDate: "2024-04-20",
    status: "Overdue"
  },
  {
    id: 4,
    number: "INV-2024-004",
    client: "Tech Solutions Inc.",
    project: "Brand Identity Refresh",
    amount: 3000,
    date: "2024-03-25",
    dueDate: "2024-04-25",
    status: "Draft"
  }
];

// Mock receipts
const mockReceipts = [
  {
    id: 1,
    number: "REC-2024-001",
    invoiceNumber: "INV-2024-001",
    client: "Tech Solutions Inc.",
    amount: 5000,
    date: "2024-04-05",
    paymentMethod: "Bank Transfer"
  },
  {
    id: 2,
    number: "REC-2024-002",
    invoiceNumber: "INV-2024-002",
    client: "Digital Marketing Pro",
    amount: 2500,
    date: "2024-04-12",
    paymentMethod: "Credit Card"
  }
];

const Finances = () => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState(mockInvoices);
  const [receipts, setReceipts] = useState(mockReceipts);
  const [statusFilter, setStatusFilter] = useState("All");
  const [showInvoiceSelect, setShowInvoiceSelect] = useState(false);
  
  // Filter invoices by status
  const filteredInvoices = statusFilter === "All" 
    ? invoices 
    : invoices.filter(invoice => invoice.status === statusFilter);

  const handleCreateReceipt = (selectedInvoices: typeof mockInvoices) => {
    const newReceipts = selectedInvoices.map((invoice, index) => ({
      id: receipts.length + index + 1,
      number: `REC-2024-${String(receipts.length + index + 1).padStart(3, '0')}`,
      invoiceNumber: invoice.number,
      client: invoice.client,
      amount: invoice.amount,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: "Bank Transfer"
    }));
    
    setReceipts([...receipts, ...newReceipts]);
    
    // Update invoice statuses to Paid
    const updatedInvoices = invoices.map(invoice => {
      if (selectedInvoices.some(selected => selected.id === invoice.id)) {
        return { ...invoice, status: "Paid" };
      }
      return invoice;
    });
    
    setInvoices(updatedInvoices);
    
    toast({
      title: "Success",
      description: `${newReceipts.length} receipt(s) have been created successfully`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finances</h1>
        <p className="text-muted-foreground">Manage your invoices and receipts</p>
      </div>

      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="receipts">Receipts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="invoices" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Filter by status:</span>
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Invoice
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Invoice List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.number}</TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell>{invoice.project}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === "Paid" ? "bg-green-100 text-green-800" :
                          invoice.status === "Pending" ? "bg-blue-100 text-blue-800" :
                          invoice.status === "Overdue" ? "bg-red-100 text-red-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {invoice.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredInvoices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                        No invoices found with the selected filter.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="receipts" className="space-y-4">
          <div className="flex justify-between items-center">
            <div></div>
            <Button onClick={() => setShowInvoiceSelect(true)}>
              <CreditCard className="mr-2 h-4 w-4" />
              Create Receipt
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Receipt List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt #</TableHead>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipts.map((receipt) => (
                    <TableRow key={receipt.id}>
                      <TableCell className="font-medium">{receipt.number}</TableCell>
                      <TableCell>{receipt.invoiceNumber}</TableCell>
                      <TableCell>{receipt.client}</TableCell>
                      <TableCell>{receipt.date}</TableCell>
                      <TableCell>${receipt.amount.toLocaleString()}</TableCell>
                      <TableCell>{receipt.paymentMethod}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {receipts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No receipts found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <InvoiceSelectDialog
        open={showInvoiceSelect}
        onOpenChange={setShowInvoiceSelect}
        invoices={invoices.filter(inv => inv.status !== "Paid")}
        onSubmit={handleCreateReceipt}
      />
    </div>
  );
};

export default Finances;
