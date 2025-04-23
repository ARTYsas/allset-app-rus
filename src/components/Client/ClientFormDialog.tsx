
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  status: "Активен" | "Неактивен";
}

interface ClientFormDialogProps {
  onSubmit: (data: ClientFormData) => void;
  trigger: React.ReactNode;
  defaultValues?: {
    name: string;
    email: string;
    phone: string;
    status: string;
  };
  isEditing?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ClientFormDialog({ 
  onSubmit, 
  trigger, 
  defaultValues,
  isEditing = false,
  open: controlledOpen,
  onOpenChange: setControlledOpen
}: ClientFormDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    email: "",
    phone: "",
    status: "Активен"
  });

  // Handle controlled/uncontrolled state
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const onOpenChange = isControlled ? setControlledOpen : setOpen;

  // Set default values when editing
  useEffect(() => {
    if (defaultValues) {
      setFormData({
        name: defaultValues.name,
        email: defaultValues.email,
        phone: defaultValues.phone,
        status: defaultValues.status === "Активен" ? "Активен" : "Неактивен"
      });
    }
  }, [defaultValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!isControlled) {
      setOpen(false);
    }
    // Toast message is handled by the parent component
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {!isControlled && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Редактировать клиента" : "Добавить нового клиента"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название компании</Label>
            <Input
              id="name"
              placeholder="ООО Тех Решения"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Эл. почта</Label>
            <Input
              id="email"
              type="email"
              placeholder="info@company.ru"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Телефон</Label>
            <Input
              id="phone"
              placeholder="+7 (495) 123-45-67"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Статус</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "Активен" | "Неактивен") => 
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Активен">Активен</SelectItem>
                <SelectItem value="Неактивен">Неактивен</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">{isEditing ? "Сохранить изменения" : "Создать клиента"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
