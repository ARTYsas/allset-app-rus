
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task } from '@/types';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  task?: Task;
  projectId: string;
}

const TaskDialog = ({ isOpen, onClose, onSave, task, projectId }: TaskDialogProps) => {
  const isEditing = !!task;
  
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
      });
    }
  }, [task, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date();
    
    const newTask: Task = {
      id: task?.id || `task-${Date.now()}`,
      projectId,
      title: formData.title || 'Untitled Task',
      description: formData.description,
      status: (formData.status as 'backlog' | 'todo' | 'in-progress' | 'review' | 'done') || 'todo',
      priority: (formData.priority as 'low' | 'medium' | 'high') || 'medium',
      dueDate: formData.dueDate,
      assignedTo: formData.assignedTo,
      createdAt: task?.createdAt || now,
      updatedAt: now,
    };
    
    onSave(newTask);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Task' : 'New Task'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                placeholder="Task title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Task description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) => handleSelectChange('status', value)}
                  defaultValue={formData.status || 'todo'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="backlog">Backlog</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  onValueChange={(value) => handleSelectChange('priority', value)}
                  defaultValue={formData.priority || 'medium'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
