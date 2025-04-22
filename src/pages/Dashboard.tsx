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
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your IT business</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card 
          className="cursor-pointer transition-transform hover:scale-105"
          onClick={() => navigateToSection('/clients')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">+2 this month</p>
              <ArrowRight className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-transform hover:scale-105"
          onClick={() => navigateToSection('/projects')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">3 due this week</p>
              <ArrowRight className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-transform hover:scale-105"
          onClick={() => navigateToSection('/finances')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">+18% from last month</p>
              <ArrowRight className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-transform hover:scale-105"
          onClick={() => navigateToSection('/documents')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">$4,350 outstanding</p>
              <ArrowRight className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Active Tasks</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
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
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Activity items */}
                <div className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Invoice #INV-001 paid</p>
                    <p className="text-sm text-muted-foreground">Client: Tech Solutions Inc.</p>
                  </div>
                  <div className="ml-auto text-sm text-muted-foreground">2 hours ago</div>
                </div>
                <div className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">New project started</p>
                    <p className="text-sm text-muted-foreground">Project: E-commerce Website Redesign</p>
                  </div>
                  <div className="ml-auto text-sm text-muted-foreground">Yesterday</div>
                </div>
                <div className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Contract signed</p>
                    <p className="text-sm text-muted-foreground">Client: Digital Marketing Agency</p>
                  </div>
                  <div className="ml-auto text-sm text-muted-foreground">3 days ago</div>
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
