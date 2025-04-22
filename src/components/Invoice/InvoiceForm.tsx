
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Invoice, InvoiceItem } from '@/types';

interface InvoiceFormProps {
  clients: { id: string; name: string }[];
  projects: { id: string; name: string; clientId: string }[];
  onSubmit: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const InvoiceForm = ({ clients, projects, onSubmit }: InvoiceFormProps) => {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(`СЧТ-${Date.now().toString().slice(-6)}`);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [items, setItems] = useState<Partial<InvoiceItem>[]>([
    { id: `item-${Date.now()}`, description: '', quantity: 1, rate: 0, amount: 0 },
  ]);

  const filteredProjects = selectedClientId
    ? projects.filter((project) => project.clientId === selectedClientId)
    : projects;

  const calculateItemAmount = (item: Partial<InvoiceItem>): number => {
    return (item.quantity || 0) * (item.rate || 0);
  };

  const calculateTotal = (): number => {
    return items.reduce((sum, item) => sum + calculateItemAmount(item), 0);
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-calculate amount
    if (field === 'quantity' || field === 'rate') {
      const quantity = field === 'quantity' ? Number(value) : newItems[index].quantity || 0;
      const rate = field === 'rate' ? Number(value) : newItems[index].rate || 0;
      newItems[index].amount = quantity * rate;
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { id: `item-${Date.now()}`, description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'> = {
      clientId: selectedClientId,
      projectId: selectedProjectId,
      number: invoiceNumber,
      date: new Date(invoiceDate),
      dueDate: new Date(dueDate),
      amount: calculateTotal(),
      status: 'draft',
      items: items.map(item => ({
        id: item.id || `item-${Date.now()}`,
        description: item.description || '',
        quantity: item.quantity || 0,
        rate: item.rate || 0,
        amount: calculateItemAmount(item),
      })),
    };
    
    onSubmit(invoiceData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Создание счета</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="client">Клиент</Label>
                <Select
                  value={selectedClientId}
                  onValueChange={setSelectedClientId}
                >
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Выберите клиента" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="project">Проект</Label>
                <Select
                  value={selectedProjectId}
                  onValueChange={setSelectedProjectId}
                  disabled={!selectedClientId}
                >
                  <SelectTrigger id="project">
                    <SelectValue placeholder="Выберите проект" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredProjects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="invoiceNumber">Номер счета</Label>
                <Input
                  id="invoiceNumber"
                  value={invoiceNumber}
                  onChange={e => setInvoiceNumber(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoiceDate">Дата счета</Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={invoiceDate}
                    onChange={e => setInvoiceDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Срок оплаты</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Позиции счета</h3>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Добавить позицию
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-6">
                    <Label htmlFor={`item-desc-${index}`}>Описание</Label>
                    <Input
                      id={`item-desc-${index}`}
                      value={item.description || ''}
                      onChange={e => handleItemChange(index, 'description', e.target.value)}
                      placeholder="Описание услуги или товара"
                    />
                  </div>
                  <div className="col-span-1">
                    <Label htmlFor={`item-qty-${index}`}>Кол-во</Label>
                    <Input
                      id={`item-qty-${index}`}
                      type="number"
                      min="1"
                      step="1"
                      value={item.quantity || ''}
                      onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`item-rate-${index}`}>Ставка</Label>
                    <Input
                      id={`item-rate-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate || ''}
                      onChange={e => handleItemChange(index, 'rate', Number(e.target.value))}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`item-amount-${index}`}>Сумма</Label>
                    <Input
                      id={`item-amount-${index}`}
                      readOnly
                      value={calculateItemAmount(item).toFixed(2)}
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={items.length <= 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Итого:</span>
                <span className="font-bold">₽{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">Отмена</Button>
            <Button type="submit">Сохранить счет</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InvoiceForm;
