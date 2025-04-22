import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  CreditCard, 
  FileText,
  ArrowRight 
} from 'lucide-react';
import { Task } from '@/types';
import KanbanBoard from '@/components/Kanban/KanbanBoard';
import TaskDialog from '@/components/Kanban/TaskDialog';

const mockTasks: Task[] = [
  {
    id: 'task-1',
    projectId: 'project-1',
    title: 'Design homepage',
    description: 'Create wireframes and mockups',
    status: 'todo',
    priority: 'high',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'task-2',
    projectId: 'project-1',
    title: 'Implement authentication',
    description: 'Set up Firebase Auth with email and Google sign-in',
    status: 'in-progress',
    priority: 'medium',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'task-3',
    projectId: 'project-1',
    title: 'Create database schema',
    description: 'Design Firestore collections and documents',
    status: 'done',
    priority: 'medium',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const handleTaskCreate = () => {
    setSelectedTask(undefined);
    setIsTaskDialogOpen(true);
  };

  const handleTaskEdit = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleTaskSave = (task: Task) => {
    if (selectedTask) {
      setTasks(tasks.map(t => t.id === task.id ? task : t));
    } else {
      setTasks([...tasks, task]);
    }
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const navigateToSection = (path: string) => {
    navigate(path);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Панель управления</h1>
          <p className="text-muted-foreground">Обзор вашего ИТ-бизнеса</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card 
          className="cursor-pointer transition-transform hover:scale-105"
          onClick={() => navigateToSection('/clients')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего клиентов</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">+2 в этом месяце</p>
              <ArrowRight className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-transform hover:scale-105"
          onClick={() => navigateToSection('/projects')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные проекты</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">3 завершаются на этой неделе</p>
              <ArrowRight className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-transform hover:scale-105"
          onClick={() => navigateToSection('/finances')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ежемесячный доход</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₽895,000</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">+18% по сравнению с прошлым месяцем</p>
              <ArrowRight className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-transform hover:scale-105"
          onClick={() => navigateToSection('/documents')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ожидающие счета</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">₽314,000 к оплате</p>
              <ArrowRight className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Текущие задачи</TabsTrigger>
          <TabsTrigger value="recent">Последняя активность</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="space-y-4">
          <KanbanBoard 
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskCreate={handleTaskCreate}
            onTaskDelete={handleTaskDelete}
            onTaskEdit={handleTaskEdit}
          />
        </TabsContent>
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Последняя активность</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Activity items */}
                <div className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Счет #ИНВ-001 оплачен</p>
                    <p className="text-sm text-muted-foreground">Клиент: ООО "Тех Решения"</p>
                  </div>
                  <div className="ml-auto text-sm text-muted-foreground">2 часа назад</div>
                </div>
                <div className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Начат новый проект</p>
                    <p className="text-sm text-muted-foreground">Проект: Редизайн интернет-магазина</p>
                  </div>
                  <div className="ml-auto text-sm text-muted-foreground">Вчера</div>
                </div>
                <div className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Контракт подписан</p>
                    <p className="text-sm text-muted-foreground">Клиент: Диджитал Маркетинг Агентство</p>
                  </div>
                  <div className="ml-auto text-sm text-muted-foreground">3 дня назад</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        onSave={handleTaskSave}
        task={selectedTask}
        projectId="project-1" // In a real app, this would be dynamic
      />
    </div>
  );
};

export default Dashboard;
