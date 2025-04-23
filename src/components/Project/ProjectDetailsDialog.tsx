import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, PlusCircle, Trash2, CalendarDays, ListChecks, Building2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProjectTask {
  id: number;
  title: string;
  completed: boolean;
}

interface ProjectDetailsProps {
  id: number;
  name: string;
  deadline: string;
  progress: number;
  status: string;
  client?: string;
  clientId?: string;
  tasks: ProjectTask[];
}

interface ProjectDetailsDialogProps {
  project: ProjectDetailsProps;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDetailsDialog({ project, open, onOpenChange }: ProjectDetailsDialogProps) {
  const [tasks, setTasks] = useState(project.tasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const { toast } = useToast();

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleToggleTask = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      toast({
        title: "Ошибка",
        description: "Название задачи не может быть пустым",
        variant: "destructive"
      });
      return;
    }

    const newTask = {
      id: Math.max(0, ...tasks.map(t => t.id)) + 1,
      title: newTaskTitle,
      completed: false
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    
    toast({
      title: "Успешно",
      description: "Задача добавлена"
    });
  };

  const handleRemoveTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    
    toast({
      title: "Успешно",
      description: "Задача удалена"
    });
  };

  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case "Completed": return "Завершен";
      case "In Progress": return "В процессе";
      case "Frozen": return "Заморожен";
      case "Canceled": return "Отменен";
      case "Ready": return "Готов";
      default: return status;
    }
  };

  const navigateToClient = () => {
    if (!project.clientId) return;
    
    toast({
      title: "Переход к клиенту",
      description: `Переход к карточке клиента ${project.client}`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{project.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <CalendarDays className="mr-2 h-4 w-4" />
                Детали проекта
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {project.client && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Клиент:</span>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 h-auto flex items-center"
                    onClick={navigateToClient}
                  >
                    {project.client}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Срок:</span>
                <span>{project.deadline}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Статус:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === "Готов" || project.status === "Completed" ? "bg-green-100 text-green-800" :
                  project.status === "В процессе" || project.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                  project.status === "Заморожен" || project.status === "Frozen" ? "bg-purple-100 text-purple-800" :
                  project.status === "Отменен" || project.status === "Canceled" ? "bg-red-100 text-red-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {getStatusDisplayText(project.status)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Прогресс:</span>
                <span>{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <ListChecks className="mr-2 h-4 w-4" />
                Прогресс задач
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-3xl font-bold">{completedTasks}/{totalTasks}</div>
                <div className="text-sm text-muted-foreground">задач выполнено</div>
                <div className="mt-2 w-full">
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4" />
                Задачи
              </div>
              <div className="flex items-center space-x-2">
                <Input 
                  placeholder="Добавить новую задачу..." 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="h-8 text-sm"
                />
                <Button 
                  size="sm" 
                  onClick={handleAddTask}
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Добавить
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tasks.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-4">Пока нет задач</p>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between border-b border-gray-100 py-2">
                    <div className="flex items-center">
                      <Checkbox 
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => handleToggleTask(task.id)}
                        className="mr-3"
                      />
                      <label 
                        htmlFor={`task-${task.id}`}
                        className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {task.title}
                      </label>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveTask(task.id)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
