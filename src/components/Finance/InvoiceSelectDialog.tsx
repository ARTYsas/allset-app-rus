
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InvoiceSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoices: Array<{
    id: number;
    number: string;
    client: string;
    project: string;
    amount: number;
    date: string;
    dueDate: string;
    status: string;
  }>;
  onSubmit: (selectedInvoices: any[]) => void;
}

export function InvoiceSelectDialog({ open, onOpenChange, invoices, onSubmit }: InvoiceSelectDialogProps) {
  const { toast } = useToast();
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<number[]>([]);

  const handleToggleInvoice = (invoiceId: number) => {
    setSelectedInvoiceIds(prev => 
      prev.includes(invoiceId)
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const handleSelectAll = () => {
    if (selectedInvoiceIds.length === invoices.length) {
      setSelectedInvoiceIds([]);
    } else {
      setSelectedInvoiceIds(invoices.map(inv => inv.id));
    }
  };

  const handleSubmit = () => {
    if (selectedInvoiceIds.length === 0) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите хотя бы один счет",
        variant: "destructive"
      });
      return;
    }
    
    const selectedInvoices = invoices.filter(inv => selectedInvoiceIds.includes(inv.id));
    onSubmit(selectedInvoices);
    onOpenChange(false);
    setSelectedInvoiceIds([]);
  };

  // Функция для перевода статусов
  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case "Pending": return "Ожидает";
      case "Overdue": return "Просрочен";
      case "Paid": return "Оплачен";
      default: return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Выберите счета для квитанций
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Выберите счета, для которых хотите создать квитанции. Показаны только неоплаченные счета.
          </p>
          
          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Неоплаченных счетов не найдено.</p>
            </div>
          ) : (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox 
                        checked={invoices.length > 0 && selectedInvoiceIds.length === invoices.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Счет №</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Срок оплаты</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedInvoiceIds.includes(invoice.id)}
                          onCheckedChange={() => handleToggleInvoice(invoice.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{invoice.number}</TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>₽{invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === "Pending" ? "bg-blue-100 text-blue-800" :
                          invoice.status === "Overdue" ? "bg-red-100 text-red-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {getStatusDisplayText(invoice.status)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm">
                  Выбрано: {selectedInvoiceIds.length} из {invoices.length} счетов
                </div>
                
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Отмена
                  </Button>
                  <Button onClick={handleSubmit}>
                    Создать квитанции
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
