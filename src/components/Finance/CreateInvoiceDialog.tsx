
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import InvoiceForm from "@/components/Invoice/InvoiceForm";
import { Invoice } from "@/types";

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  hideRateField?: boolean;
}

export function CreateInvoiceDialog({
  open,
  onOpenChange,
  onSubmit,
  hideRateField,
}: CreateInvoiceDialogProps) {
  const mockClients = [
    { id: "1", name: "Tech Solutions Inc." },
    { id: "2", name: "Digital Marketing Pro" },
  ];

  const mockProjects = [
    { id: "1", name: "Website Redesign", clientId: "1" },
    { id: "2", name: "SEO Campaign", clientId: "2" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Создать новый счет</DialogTitle>
        </DialogHeader>
        <InvoiceForm
          clients={mockClients}
          projects={mockProjects}
          onSubmit={onSubmit}
          hideRateField={hideRateField}
        />
      </DialogContent>
    </Dialog>
  );
}
