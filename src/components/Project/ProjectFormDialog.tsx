
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Interface matching the Project type from Projects.tsx
export interface Project {
  id: number;
  name: string;
  clientId: string; // String type to match Projects.tsx
  client: string;
  deadline: string;
  team: number;
  status: string;
  tasks?: Array<{ id: number; title: string; completed: boolean }>;
  progress?: number;
}

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  defaultValues?: Project;
  isEditing?: boolean;
}

// Mock clients for the dropdown
const mockClients = [
  { id: "1", name: "ООО Тех Решения" }, // Changed to string IDs
  { id: "2", name: "Диджитал Маркетинг Про" },
  { id: "3", name: "Веб-Дизайн Студия" }
];

// Project statuses
const projectStatuses = ["Готов", "В процессе", "Заморожен", "Отменен"];

// Mapping for English status values (API expects English)
const statusMapping: {[key: string]: string} = {
  "Готов": "Ready",
  "В процессе": "In Progress",
  "Заморожен": "Frozen",
  "Отменен": "Canceled"
};

export function ProjectFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit,
  defaultValues,
  isEditing = false
}: ProjectFormDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    clientId: "",
    client: "",
    deadline: new Date(),
    team: 1,
    status: "В процессе",
  });

  // Set form data when defaultValues change
  useEffect(() => {
    if (defaultValues) {
      setFormData({
        name: defaultValues.name || "",
        clientId: defaultValues.clientId || "",
        client: defaultValues.client || "",
        deadline: defaultValues.deadline ? 
          (typeof defaultValues.deadline === 'string' ? 
            parse(defaultValues.deadline, 'yyyy-MM-dd', new Date()) : 
            defaultValues.deadline) : 
          new Date(),
        team: defaultValues.team || 1,
        status: defaultValues.status || "В процессе",
      });
    }
  }, [defaultValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.clientId) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    // Set the client name based on the selected client ID
    const client = mockClients.find(c => c.id === formData.clientId)?.name || "";
    
    onSubmit({
      ...formData,
      client,
      status: statusMapping[formData.status] || formData.status, // Convert to English for API
      deadline: format(formData.deadline, "yyyy-MM-dd"),
    });
    
    // Reset form if not editing
    if (!isEditing) {
      setFormData({
        name: "",
        clientId: "",
        client: "",
        deadline: new Date(),
        team: 1,
        status: "В процессе",
      });
    }
    
    onOpenChange(false);
    
    toast({
      title: "Успешно",
      description: isEditing ? "Проект успешно обновлен" : "Проект успешно создан",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Редактировать проект" : "Создать новый проект"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название проекта</Label>
            <Input
              id="name"
              placeholder="Редизайн интернет-магазина"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="client">Клиент</Label>
            <Select
              value={formData.clientId}
              onValueChange={(value) => setFormData({ ...formData, clientId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите клиента" />
              </SelectTrigger>
              <SelectContent>
                {mockClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deadline">Срок</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.deadline ? (
                    format(formData.deadline, "PPP")
                  ) : (
                    <span>Выберите дату</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.deadline}
                  onSelect={(date) => date && setFormData({ ...formData, deadline: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="team">Размер команды</Label>
            <Input
              id="team"
              type="number"
              min="1"
              value={formData.team}
              onChange={(e) => setFormData({ ...formData, team: Number(e.target.value) })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Статус</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                {projectStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit">
              {isEditing ? "Сохранить" : "Создать проект"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
