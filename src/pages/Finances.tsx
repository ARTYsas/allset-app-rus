
import { useState, useEffect } from 'react';
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
import { Filter, Download, PlusCircle, FileText, CreditCard } from 'lucide-react';
import { InvoiceSelectDialog } from '@/components/Finance/InvoiceSelectDialog';
import { CreateInvoiceDialog } from '@/components/Finance/CreateInvoiceDialog';
import { useToast } from '@/hooks/use-toast';
import { useInvoices, usePayments } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { Invoice } from '@/types/supabaseTypes';

const Finances = () => {
  const { data: fetchedInvoices, isLoading: isLoadingInvoices, error: invoicesError, refetch: refetchInvoices } = useInvoices();
  const { data: fetchedPayments, isLoading: isLoadingPayments, error: paymentsError, refetch: refetchPayments } = usePayments();
  
  const [invoices, setInvoices] = useState<any[]>([]);
  const [receipts, setReceipts] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("Все");
  const [showInvoiceSelect, setShowInvoiceSelect] = useState(false);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (fetchedInvoices) {
      setInvoices(fetchedInvoices);
    }
  }, [fetchedInvoices]);

  useEffect(() => {
    if (fetchedPayments) {
      setReceipts(fetchedPayments);
    }
  }, [fetchedPayments]);
  
  const filteredInvoices = statusFilter === "Все" 
    ? invoices 
    : invoices.filter(invoice => invoice.status === statusFilter);

  const handleCreateReceipt = async (selectedInvoices: Invoice[]) => {
    try {
      for (const invoice of selectedInvoices) {
        // Создаем запись платежа
        const { error: paymentError } = await supabase
          .from('payments')
          .insert([{
            invoice_id: invoice.id,
            amount: invoice.amount,
            date: new Date().toISOString(),
            payment_method: "Банковский перевод"
          }]);

        if (paymentError) throw paymentError;

        // Обновляем статус счета
        const { error: invoiceError } = await supabase
          .from('invoices')
          .update({ status: 'Оплачен' })
          .eq('id', invoice.id);

        if (invoiceError) throw invoiceError;
      }
      
      toast({
        title: "Успех",
        description: `${selectedInvoices.length} платеж(а/и) создан(ы) успешно`,
      });
      
      refetchInvoices();
      refetchPayments();
    } catch (error: any) {
      console.error('Error creating payment:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать платеж",
        variant: "destructive"
      });
    }
  };

  const handleCreateInvoice = async (invoiceData: any) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .insert([{
          number: invoiceData.number,
          client_id: invoiceData.client_id,
          project_id: invoiceData.project_id,
          document_id: invoiceData.document_id || null,
          amount: invoiceData.amount,
          date: invoiceData.date || new Date().toISOString(),
          due_date: invoiceData.due_date || new Date(Date.now() + 30*24*60*60*1000).toISOString(), // 30 дней
          status: 'Черновик'
        }]);

      if (error) throw error;
      
      toast({
        title: "Успех",
        description: "Счет создан успешно",
      });
      
      refetchInvoices();
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать счет",
        variant: "destructive"
      });
    }
  };

  if (isLoadingInvoices || isLoadingPayments) {
    return <div className="flex justify-center p-12">Загрузка данных...</div>;
  }

  if (invoicesError || paymentsError) {
    return <div className="text-red-500 p-6">
      Ошибка загрузки данных: {invoicesError ? (invoicesError as Error).message : (paymentsError as Error).message}
    </div>;
  }

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
                  <SelectItem value="Все">Все</SelectItem>
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
                    <TableHead>Срок оплаты</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                        Нет счетов с выбранным фильтром.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.number}</TableCell>
                        <TableCell>{invoice.clientName}</TableCell>
                        <TableCell>{invoice.projectName}</TableCell>
                        <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                        <TableCell>{invoice.amount.toLocaleString()} ₽</TableCell>
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
                    ))
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
                    <TableHead>Счет</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Метод оплаты</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        Нет платежей.
                      </TableCell>
                    </TableRow>
                  ) : (
                    receipts.map((receipt, index) => (
                      <TableRow key={receipt.id}>
                        <TableCell className="font-medium">ПЛТ-{String(index + 1).padStart(3, '0')}</TableCell>
                        <TableCell>{receipt.invoiceNumber}</TableCell>
                        <TableCell>{receipt.clientName}</TableCell>
                        <TableCell>{new Date(receipt.date).toLocaleDateString()}</TableCell>
                        <TableCell>{receipt.amount.toLocaleString()} ₽</TableCell>
                        <TableCell>{receipt.payment_method}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
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
        hideRateField={true}
      />
    </div>
  );
};

export default Finances;
