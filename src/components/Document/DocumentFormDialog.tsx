
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: any;
  onSubmit: (data: any) => void;
}

// Example field values for the preview
const exampleValues = {
  clientName: "Acme Corporation",
  projectName: "Website Redesign",
  startDate: new Date(),
  budget: "10000",
  scope: "Redesign of the company website including homepage, about us, services, and contact pages. The project includes wireframing, design, development, testing, and deployment.",
  clientAddress: "123 Business Ave, Suite 100, New York, NY 10001",
  serviceDescription: "Professional web design and development services including UI/UX design, front-end development, back-end integration, and content management system implementation.",
  endDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
  paymentTerms: "50% upfront, 25% upon design approval, 25% upon project completion. Payments due within 14 days of invoice date.",
  invoiceNumber: "INV-2024-001",
  issueDate: new Date(),
  dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
  items: "Web Design: $3,000\nDevelopment: $5,000\nTesting & Deployment: $2,000",
  notes: "Please make payment to the bank account specified in the payment details section."
};

export function DocumentFormDialog({ open, onOpenChange, template, onSubmit }: DocumentFormDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [documentName, setDocumentName] = useState("");
  const [previewValues, setPreviewValues] = useState<Record<string, any>>({});

  useEffect(() => {
    if (template) {
      // Initialize form data with empty values
      const initialData: Record<string, any> = {};
      template.fields.forEach((field: any) => {
        if (field.type === 'date') {
          initialData[field.name] = new Date();
        } else {
          initialData[field.name] = '';
        }
      });
      setFormData(initialData);
      setDocumentName(`${template.name} - New`);
      
      // Set example values for preview
      const exampleData: Record<string, any> = {};
      template.fields.forEach((field: any) => {
        exampleData[field.name] = exampleValues[field.name as keyof typeof exampleValues] || '';
      });
      setPreviewValues(exampleData);
    }
  }, [template]);

  const handleFieldChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
    // Also update preview with actual values
    setPreviewValues({ ...previewValues, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all required fields are filled
    const missingFields = template.fields
      .filter((field: any) => field.required && !formData[field.name])
      .map((field: any) => field.label);
    
    if (missingFields.length > 0) {
      toast({
        title: "Error",
        description: `Please fill in the following required fields: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }
    
    // Format date fields to string
    const formattedData = { ...formData };
    template.fields.forEach((field: any) => {
      if (field.type === 'date' && formData[field.name]) {
        formattedData[field.name] = format(formData[field.name], 'yyyy-MM-dd');
      }
    });
    
    onSubmit({
      name: documentName,
      type: "PDF",
      content: generateDocumentContent(template, formattedData),
    });
    
    onOpenChange(false);
    
    toast({
      title: "Success",
      description: "Document has been created successfully",
    });
  };

  // Generate a simple document content
  const generateDocumentContent = (template: any, data: any) => {
    let content = `# ${documentName}\n\n`;
    
    template.fields.forEach((field: any) => {
      content += `## ${field.label}\n${data[field.name]}\n\n`;
    });
    
    return content;
  };

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create {template.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="documentName">Document Name</Label>
                <Input
                  id="documentName"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                />
              </div>
              
              {template.fields.map((field: any) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>
                    {field.label}{field.required && <span className="text-red-500">*</span>}
                  </Label>
                  
                  {field.type === 'text' && (
                    <Input
                      id={field.name}
                      placeholder={exampleValues[field.name as keyof typeof exampleValues]?.toString() || ''}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    />
                  )}
                  
                  {field.type === 'textarea' && (
                    <Textarea
                      id={field.name}
                      placeholder={exampleValues[field.name as keyof typeof exampleValues]?.toString() || ''}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      rows={4}
                    />
                  )}
                  
                  {field.type === 'number' && (
                    <Input
                      id={field.name}
                      type="number"
                      placeholder={exampleValues[field.name as keyof typeof exampleValues]?.toString() || ''}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    />
                  )}
                  
                  {field.type === 'date' && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData[field.name] ? (
                            format(formData[field.name], "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData[field.name]}
                          onSelect={(date) => handleFieldChange(field.name, date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                  
                  {field.type === 'items' && (
                    <Textarea
                      id={field.name}
                      placeholder="Item 1: $1000&#10;Item 2: $2000&#10;Item 3: $3000"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      rows={4}
                    />
                  )}
                </div>
              ))}
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Document
                </Button>
              </div>
            </form>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Document Preview</h3>
            <Card className="border-dashed">
              <CardContent className="p-6 space-y-4">
                <h1 className="text-xl font-bold">{documentName || template.name}</h1>
                
                {template.fields.map((field: any) => (
                  <div key={field.name} className="space-y-1">
                    <h2 className="text-lg font-medium">{field.label}</h2>
                    {field.type === 'date' && previewValues[field.name] ? (
                      <p>{format(previewValues[field.name], 'PPP')}</p>
                    ) : field.type === 'items' ? (
                      <div className="space-y-1">
                        {previewValues[field.name]?.split('\n').map((item: string, i: number) => (
                          <p key={i} className="pl-4 border-l-2 border-gray-200">{item}</p>
                        ))}
                      </div>
                    ) : (
                      <p>{previewValues[field.name] || 'Not specified'}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground mt-2">
              This is a preview using example data. Your actual document will use the information you provide in the form.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
