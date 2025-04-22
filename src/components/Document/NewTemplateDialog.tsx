
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (template: any) => void;
}

const fieldTypes = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Text Area" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "select", label: "Select" },
  { value: "items", label: "Line Items" }
];

export function NewTemplateDialog({ open, onOpenChange, onSubmit }: NewTemplateDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fields: [
      { name: "", label: "", type: "text", required: true }
    ]
  });

  const handleAddField = () => {
    setFormData({
      ...formData,
      fields: [
        ...formData.fields,
        { name: "", label: "", type: "text", required: true }
      ]
    });
  };

  const handleRemoveField = (index: number) => {
    setFormData({
      ...formData,
      fields: formData.fields.filter((_, i) => i !== index)
    });
  };

  const updateField = (index: number, field: any) => {
    const newFields = [...formData.fields];
    newFields[index] = { ...newFields[index], ...field };
    setFormData({ ...formData, fields: newFields });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.fields.some(field => !field.name || !field.label)) {
      toast({
        title: "Error",
        description: "Please fill in all field information",
        variant: "destructive"
      });
      return;
    }

    // Normalize field names (remove spaces, etc.)
    const normalizedFields = formData.fields.map(field => ({
      ...field,
      name: field.name.trim().replace(/\s+/g, '_').toLowerCase()
    }));

    onSubmit({
      ...formData,
      fields: normalizedFields
    });
    
    // Reset form
    setFormData({
      name: "",
      description: "",
      fields: [{ name: "", label: "", type: "text", required: true }]
    });
    
    onOpenChange(false);
    
    toast({
      title: "Success",
      description: "Template has been created successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Создать новый шаблон</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              placeholder="Project Proposal"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="A template for creating project proposals"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Template Fields</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddField}>
                <PlusCircle className="h-4 w-4 mr-1" /> Add Field
              </Button>
            </div>
            
            {formData.fields.map((field, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-start">
                <div className="col-span-5">
                  <Label className="text-xs" htmlFor={`field-label-${index}`}>Field Label</Label>
                  <Input
                    id={`field-label-${index}`}
                    placeholder="Client Name"
                    value={field.label}
                    onChange={(e) => updateField(index, { label: e.target.value, name: e.target.value.trim().replace(/\s+/g, '_').toLowerCase() })}
                    className="mt-1"
                  />
                </div>
                
                <div className="col-span-3">
                  <Label className="text-xs" htmlFor={`field-type-${index}`}>Type</Label>
                  <Select
                    value={field.type}
                    onValueChange={(value) => updateField(index, { type: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-3">
                  <Label className="text-xs" htmlFor={`field-required-${index}`}>Required</Label>
                  <Select
                    value={field.required ? "yes" : "no"}
                    onValueChange={(value) => updateField(index, { required: value === "yes" })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-1 pt-6">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveField(index)}
                    disabled={formData.fields.length === 1}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Template
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
