
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Clock, Users, CheckCircle, Filter, Trash2, Edit } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ProjectFormDialog } from '@/components/Project/ProjectFormDialog';
import { ProjectDetailsDialog } from '@/components/Project/ProjectDetailsDialog';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

// Project statuses
const projectStatuses = ["Все", "Готов", "В процессе", "Заморожен", "Отменен"];

// Status mapping for consistency
const statusMap: Record<string, string> = {
  "Ready": "Готов",
  "In Progress": "В процессе",
  "Frozen": "Заморожен",
  "Canceled": "Отменен",
  "Completed": "Готов"
};

const mockProjects = [
  {
    id: 1,
    name: "Редизайн платформы электронной коммерции",
    client: "ООО Тех Решения",
    clientId: 1,
    deadline: "2024-05-15",
    progress: 75,
    team: 4,
    status: "В процессе",
    tasks: [
      { id: 1, title: "Создание прототипа", completed: true },
      { id: 2, title: "Дизайн главной страницы", completed: true },
      { id: 3, title: "Разработка страницы товара", completed: true },
      { id: 4, title: "Функциональность корзины", completed: false }
    ]
  },
  {
    id: 2,
    name: "Кампания SEO-оптимизации",
    client: "ООО Диджитал Маркетинг",
    clientId: 2,
    deadline: "2024-04-30",
    progress: 45,
    team: 2,
    status: "Готов",
    tasks: [
      { id: 1, title: "Исследование ключевых слов", completed: true },
      { id: 2, title: "Оптимизация контента", completed: true },
      { id: 3, title: "Построение обратных ссылок", completed: false },
      { id: 4, title: "Анализ производительности", completed: false }
    ]
  },
  {
    id: 3,
    name: "Разработка мобильного приложения",
    client: "Веб-Дизайн Студия",
    clientId: 3,
    deadline: "2024-06-01",
    progress: 20,
    team: 5,
    status: "Заморожен",
    tasks: [
      { id: 1, title: "UI/UX дизайн", completed: true },
      { id: 2, title: "Фронтенд разработка", completed: false },
      { id: 3, title: "Интеграция бэкенда", completed: false },
      { id: 4, title: "Тестирование", completed: false }
    ]
  },
  {
    id: 4,
    name: "Обновление фирменного стиля",
    client: "ООО Тех Решения",
    clientId: 1,
    deadline: "2024-05-20",
    progress: 90,
    team: 3,
    status: "В процессе",
    tasks: [
      { id: 1, title: "Исследование рынка", completed: true },
      { id: 2, title: "Редизайн логотипа", completed: true },
      { id: 3, title: "Руководство по бренду", completed: true },
      { id: 4, title: "Дизайн сопутствующих материалов", completed: false }
    ]
  },
  {
    id: 5,
    name: "Стратегия контент-маркетинга",
    client: "ООО Диджитал Маркетинг",
    clientId: 2,
    deadline: "2024-07-15",
    progress: 10,
    team: 2,
    status: "Отменен",
    tasks: [
      { id: 1, title: "Исследование аудитории", completed: true },
      { id: 2, title: "Календарь контента", completed: false },
      { id: 3, title: "Создание контента", completed: false },
      { id: 4, title: "План распространения", completed: false }
    ]
  }
];

interface Project {
  id: number;
  name: string;
  client: string;
  clientId: number;
  deadline: string;
  progress: number;
  team: number;
  status: string;
  tasks: Array<{ id: number; title: string; completed: boolean }>;
}

const Projects = () => {
  const [statusFilter, setStatusFilter] = useState("Все");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  // Filter projects by status
  const filteredProjects = statusFilter === "Все" 
    ? projects 
    : projects.filter(project => project.status === statusFilter);

  const handleCreateProject = (projectData: any) => {
    const newProject = {
      id: projects.length + 1,
      ...projectData,
      tasks: [],
      progress: 0,
    };
    setProjects([...projects, newProject]);
  };
  
  const handleEditProject = (projectData: any) => {
    if (!editingProject) return;
    
    const updatedProjects = projects.map(project => 
      project.id === editingProject.id ? { ...project, ...projectData } : project
    );
    
    setProjects(updatedProjects);
    setEditingProject(null);
    
    toast({
      title: "Успешно",
      description: "Проект обновлен",
    });
  };
  
  const handleDeleteProject = () => {
    if (projectToDelete === null) return;
    
    const updatedProjects = projects.filter(project => project.id !== projectToDelete);
    setProjects(updatedProjects);
    setProjectToDelete(null);
    setDeleteDialogOpen(false);
    
    toast({
      title: "Успешно",
      description: "Проект удален",
    });
  };

  const openDeleteDialog = (projectId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const openEditDialog = (project: Project, event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingProject(project);
    setShowProjectForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Проекты</h1>
          <p className="text-muted-foreground">Отслеживание текущих проектов</p>
        </div>
        <Button onClick={() => {
          setEditingProject(null);
          setShowProjectForm(true);
        }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Новый проект
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Фильтр по статусу:</span>
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Выберите статус" />
            </SelectTrigger>
            <SelectContent>
              {projectStatuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          Показано {filteredProjects.length} из {projects.length} проектов
        </div>
      </div>

      <div className="grid gap-6">
        {filteredProjects.map((project) => (
          <Card 
            key={project.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedProject(project)}
          >
            <CardHeader>
              <CardTitle className="text-xl flex justify-between">
                <span>{project.name}</span>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => openEditDialog(project, e)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => openDeleteDialog(project.id, e)}
                    className="h-8 w-8 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Клиент:</span>
                  <span className="font-medium">{project.client}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Срок:</span>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{project.deadline}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Команда:</span>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span>{project.team} сотрудников</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Статус:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === "Готов" ? "bg-green-100 text-green-800" :
                    project.status === "В процессе" ? "bg-blue-100 text-blue-800" :
                    project.status === "Заморожен" ? "bg-purple-100 text-purple-800" :
                    project.status === "Отменен" ? "bg-red-100 text-red-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Прогресс</span>
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredProjects.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Не найдено проектов с выбранным фильтром.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setStatusFilter("Все")}
            >
              Показать все проекты
            </Button>
          </div>
        )}
      </div>

      {selectedProject && (
        <ProjectDetailsDialog
          project={selectedProject}
          open={!!selectedProject}
          onOpenChange={(open) => !open && setSelectedProject(null)}
        />
      )}

      <ProjectFormDialog
        open={showProjectForm}
        onOpenChange={setShowProjectForm}
        onSubmit={editingProject ? handleEditProject : handleCreateProject}
        defaultValues={editingProject || undefined}
        isEditing={!!editingProject}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Проект и все связанные данные будут удалены.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-red-500 hover:bg-red-700">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Projects;
