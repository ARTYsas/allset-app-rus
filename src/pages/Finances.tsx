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
import { CreateInvoiceDialog } from '@/components/Finance/CreateInvoiceDialog';
import { useToast } from '@/hooks/use-toast';

const mockInvoices = [
  {
    id: 1,
    number: "ИНВ-2024-001",
    client: "ООО Тех Решения",
    project: "Редизайн интернет-магазина",
    amount: 350000,
    date: "2024-03-10",
    dueDate: "2024-04-10",
    status: "Оплачен"
  },
  {
    id: 2,
    number: "ИНВ-2024-002",
    client: "ООО Диджитал Маркетинг",
    project: "SEO Оптимизация",
    amount: 175000,
    date: "2024-03-15",
    dueDate: "2024-04-15",
    status: "Ожидает оплаты"
  },
  {
    id: 3,
    number: "ИНВ-2024-003",
    client: "Веб-Студия",
    project: "Разработка мобильного приложения",
    amount: 525000,
    date: "2024-03-20",
    dueDate: "2024-04-20",
    status: "Просрочен"
  },
  {
    id: 4,
    number: "ИНВ-2024-004",
    client: "ООО Тех Решения",
    project: "Обновление брендинга",
    amount: 210000,
    date: "2024-03-25",
    dueDate: "2024-04-25",
    status: "Черновик"
  }
];

const mockReceipts = [
  {
    id: 1,
    number: "ПЛТ-2024-001",
    invoiceNumber: "ИНВ-2024-001",
    client: "ООО Тех Решения",
    amount: 350000,
    date: "2024-04-05",
    paymentMethod: "Банковский перевод"
  },
  {
    id: 2,
    number: "ПЛТ-2024-002",
    invoiceNumber: "ИНВ-2024-002",
    client: "ООО Диджитал Маркетинг",
    amount: 175000,
    date: "2024-04-12",
    paymentMethod: "Кредитная карта"
  }
];

const Finances = () => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState(mockInvoices);
  const [receipts, setReceipts] = useState(mockReceipts);
  const [statusFilter, setStatusFilter] = useState("All");
  const [showInvoiceSelect, setShowInvoiceSelect] = useState(false);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  
  const filteredInvoices = statusFilter === "All" 
    ? invoices 
    : invoices.filter(invoice => invoice.status === statusFilter);

  const handleCreateReceipt = (selectedInvoices: typeof mockInvoices) => {
    const newReceipts = selectedInvoices.map((invoice, index) => ({
      id: receipts.length + index + 1,
      number: `ПЛТ-2024-${String(receipts.length + index + 1).padStart(3, '0')}`,
      invoiceNumber: invoice.number,
      client: invoice.client,
      amount: invoice.amount,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: "Банковский перевод"
    }));
    
    setReceipts([...receipts, ...newReceipts]);
    
    const updatedInvoices = invoices.map(invoice => {
      if (selectedInvoices.some(selected => selected.id === invoice.id)) {
        return { ...invoice, status: "Оплачен" };
      }
      return invoice;
    });
    
    setInvoices(updatedInvoices);
    
    toast({
      title: "Успех",
      description: `${newReceipts.length} платеж(а/и) создан(ы) успешно`,
    });
  };

  const handleCreateInvoice = (invoiceData: any) => {
    const newInvoice = {
      id: invoices.length + 1,
      ...invoiceData,
      status: "draft",
    };
    setInvoices([...invoices, newInvoice]);
    toast({
      title: "Успех",
      description: "Счет создан успешно",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Финансы</h1>
        <p className="text-muted-foreground">Управление счетами и платежами</p>
      </div>

      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">Счета</TabsTrigger>
          <TabsTrigger value="receipts">Платежи</TabsTrigger>
        </TabsList>
        
        <TabsContent value="invoices" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Фильтр по статусу:</span>
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Все</SelectItem>
                  <SelectItem value="Черновик">Черновик</SelectItem>
                  <SelectItem value="Ожидает оплаты">Ожидает оплаты</SelectItem>
                  <SelectItem value="Оплачен">Оплачен</SelectItem>
                  <SelectItem value="Просрочен">Просрочен</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setShowCreateInvoice(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Новый счет
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Список счетов</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Номер счета</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Проект</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Дата погашения</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
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
                      <TableCell>{invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === "Оплачен" ? "bg-green-100 text-green-800" :
                          invoice.status === "Ожидает оплаты" ? "bg-blue-100 text-blue-800" :
                          invoice.status === "Просрочен" ? "bg-red-100 text-red-800" :
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
                        Нет счетов с выбранным фильтром.
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
              Создать платеж
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Список платежей</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Номер платежа</TableHead>
                    <TableHead>Номер счета</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Метод оплаты</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipts.map((receipt) => (
                    <TableRow key={receipt.id}>
                      <TableCell className="font-medium">{receipt.number}</TableCell>
                      <TableCell>{receipt.invoiceNumber}</TableCell>
                      <TableCell>{receipt.client}</TableCell>
                      <TableCell>{receipt.date}</TableCell>
                      <TableCell>{receipt.amount.toLocaleString()}</TableCell>
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
                        Нет платежей.
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
        invoices={invoices.filter(inv => inv.status !== "Оплачен")}
        onSubmit={handleCreateReceipt}
      />
      
      <CreateInvoiceDialog
        open={showCreateInvoice}
        onOpenChange={setShowCreateInvoice}
        onSubmit={handleCreateInvoice}
      />
    </div>
  );
};

export default Finances;
