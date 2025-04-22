
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, FileText, FilePlus } from "lucide-react";
import { NewTemplateDialog } from "@/components/Document/NewTemplateDialog";

interface DocumentTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: any) => void;
}

// Mock templates
const initialTemplates = [
  {
    id: 1,
    name: "Project Proposal",
    description: "A standard document for project proposals to clients.",
    fields: [
      { name: "clientName", label: "Client Name", type: "text", required: true },
      { name: "projectName", label: "Project Name", type: "text", required: true },
      { name: "startDate", label: "Start Date", type: "date", required: true },
      { name: "budget", label: "Budget", type: "number", required: true },
      { name: "scope", label: "Project Scope", type: "textarea", required: true },
    ]
  },
  {
    id: 2,
    name: "Service Agreement",
    description: "Legal agreement for service provision.",
    fields: [
      { name: "clientName", label: "Client Name", type: "text", required: true },
      { name: "clientAddress", label: "Client Address", type: "text", required: true },
      { name: "serviceDescription", label: "Service Description", type: "textarea", required: true },
      { name: "startDate", label: "Start Date", type: "date", required: true },
      { name: "endDate", label: "End Date", type: "date", required: true },
      { name: "paymentTerms", label: "Payment Terms", type: "textarea", required: true },
    ]
  },
  {
    id: 3,
    name: "Invoice",
    description: "Professional invoice for billing clients.",
    fields: [
      { name: "clientName", label: "Client Name", type: "text", required: true },
      { name: "invoiceNumber", label: "Invoice Number", type: "text", required: true },
      { name: "issueDate", label: "Issue Date", type: "date", required: true },
      { name: "dueDate", label: "Due Date", type: "date", required: true },
      { name: "items", label: "Line Items", type: "items", required: true },
      { name: "notes", label: "Notes", type: "textarea", required: false },
    ]
  }
];

export function DocumentTemplateDialog({ open, onOpenChange, onSelectTemplate }: DocumentTemplateDialogProps) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [showNewTemplateDialog, setShowNewTemplateDialog] = useState(false);

  const handleAddTemplate = (template: any) => {
    const newTemplate = {
      id: templates.length + 1,
      ...template
    };
    setTemplates([...templates, newTemplate]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Выберите шаблон документа
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {templates.map((template) => (
            <Card 
              key={template.id}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onSelectTemplate(template)}
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                <File className="h-12 w-12 text-blue-500 mb-2" />
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
              </CardContent>
            </Card>
          ))}
          
          {/* Add New Template Card */}
          <Card 
            className="cursor-pointer hover:bg-gray-50 transition-colors border-dashed"
            onClick={() => setShowNewTemplateDialog(true)}
          >
            <CardContent className="p-4 flex flex-col items-center text-center">
              <FilePlus className="h-12 w-12 text-gray-400 mb-2" />
              <h3 className="font-medium">Добавить шаблон</h3>
              <p className="text-xs text-muted-foreground mt-1">Создать новый шаблон документа</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
      
      <NewTemplateDialog 
        open={showNewTemplateDialog}
        onOpenChange={setShowNewTemplateDialog}
        onSubmit={handleAddTemplate}
      />
    </Dialog>
  );
}
