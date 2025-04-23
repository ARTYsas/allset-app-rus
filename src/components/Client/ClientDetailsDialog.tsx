
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Building2, Briefcase, ExternalLink } from "lucide-react";
import { useState } from "react";
import { ProjectCard } from "@/components/Project/ProjectCard";
import { ProjectDetailsDialog } from "@/components/Project/ProjectDetailsDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ClientDetailsProps {
  client: {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock client projects - in a real app, this would come from your database
const mockClientProjects = {
  1: [
    {
      id: 1,
      name: "Редизайн веб-сайта",
      deadline: "2024-05-15",
      progress: 75,
      status: "В процессе",
      clientId: 1,
      client: "ООО Тех Решения",
      tasks: [
        { id: 1, title: "Дизайн главной страницы", completed: true },
        { id: 2, title: "Внедрить адаптивный дизайн", completed: true },
        { id: 3, title: "Добавить контактную форму", completed: false },
        { id: 4, title: "СЕО оптимизация", completed: false }
      ]
    },
    {
      id: 2,
      name: "Маркетинговая кампания",
      deadline: "2024-06-20",
      progress: 30,
      status: "В процессе",
      clientId: 1,
      client: "ООО Тех Решения",
      tasks: [
        { id: 1, title: "Определить целевую аудиторию", completed: true },
        { id: 2, title: "Создать контент-план", completed: true },
        { id: 3, title: "Дизайн визуальных материалов", completed: false },
        { id: 4, title: "Запуск кампании", completed: false },
        { id: 5, title: "Анализ результатов", completed: false }
      ]
    }
  ],
  2: [
    {
      id: 3,
      name: "СЕО Оптимизация",
      deadline: "2024-04-30",
      progress: 45,
      status: "В процессе",
      clientId: 2,
      client: "ООО Диджитал Маркетинг",
      tasks: [
        { id: 1, title: "Исследование ключевых слов", completed: true },
        { id: 2, title: "Оптимизация на странице", completed: false },
        { id: 3, title: "Обновление контента", completed: false }
      ]
    }
  ],
  3: [
    {
      id: 4,
      name: "Разработка мобильного приложения",
      deadline: "2024-06-01",
      progress: 20,
      status: "В процессе",
      clientId: 3,
      client: "Веб-Дизайн Студия",
      tasks: [
        { id: 1, title: "UI/UX дизайн", completed: true },
        { id: 2, title: "Фронтенд разработка", completed: false },
        { id: 3, title: "Интеграция бэкенда", completed: false },
        { id: 4, title: "Тестирование", completed: false },
        { id: 5, title: "Публикация в магазинах приложений", completed: false }
      ]
    }
  ]
};

export function ClientDetailsDialog({ client, open, onOpenChange }: ClientDetailsProps) {
  // Get projects for this client
  const clientProjects = mockClientProjects[client.id as keyof typeof mockClientProjects] || [];
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const { toast } = useToast();

  const navigateToProject = (projectId: number) => {
    // In a real app this would navigate to the project page
    toast({
      title: "Переход к проекту",
      description: `Переход к проекту #${projectId}`,
    });
    // Implementation would depend on your routing setup
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Детали клиента</DialogTitle>
        </DialogHeader>
        <Card>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center space-x-4">
              <Building2 className="h-6 w-6 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Название компании</p>
                <p className="text-lg font-semibold">{client.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Mail className="h-6 w-6 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Эл. почта</p>
                <p className="text-lg">{client.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="h-6 w-6 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Телефон</p>
                <p className="text-lg">{client.phone}</p>
              </div>
            </div>
            <div className="pt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                client.status === "Активен" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {client.status}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium flex items-center mb-4">
            <Briefcase className="mr-2 h-5 w-5" />
            Проекты клиента
          </h3>
          
          {clientProjects.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {clientProjects.map((project) => (
                <ProjectCard 
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                  actionButton={
                    <Button size="sm" variant="ghost" className="flex items-center">
                      <ExternalLink className="mr-1 h-4 w-4" />
                      <span>Перейти</span>
                    </Button>
                  }
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">У клиента пока нет проектов.</p>
          )}
        </div>
        
        {selectedProject && (
          <ProjectDetailsDialog 
            project={selectedProject}
            open={!!selectedProject}
            onOpenChange={(open) => !open && setSelectedProject(null)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
