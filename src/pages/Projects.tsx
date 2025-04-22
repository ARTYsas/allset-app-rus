
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Clock, Users, CheckCircle, Filter } from 'lucide-react';
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

// Project statuses
const projectStatuses = ["Все", "Готов", "В процессе", "Заморожен", "Отменен"];

const mockProjects = [
  {
    id: 1,
    name: "E-commerce Platform Redesign",
    client: "Tech Solutions Inc.",
    clientId: 1,
    deadline: "2024-05-15",
    progress: 75,
    team: 4,
    status: "In Progress",
    tasks: [
      { id: 1, title: "Wireframing", completed: true },
      { id: 2, title: "Design homepage", completed: true },
      { id: 3, title: "Product page development", completed: true },
      { id: 4, title: "Cart functionality", completed: false }
    ]
  },
  {
    id: 2,
    name: "SEO Optimization Campaign",
    client: "Digital Marketing Pro",
    clientId: 2,
    deadline: "2024-04-30",
    progress: 45,
    team: 2,
    status: "Ready",
    tasks: [
      { id: 1, title: "Keyword research", completed: true },
      { id: 2, title: "Content optimization", completed: true },
      { id: 3, title: "Backlink building", completed: false },
      { id: 4, title: "Performance analysis", completed: false }
    ]
  },
  {
    id: 3,
    name: "Mobile App Development",
    client: "Web Design Studio",
    clientId: 3,
    deadline: "2024-06-01",
    progress: 20,
    team: 5,
    status: "Frozen",
    tasks: [
      { id: 1, title: "UI/UX design", completed: true },
      { id: 2, title: "Frontend development", completed: false },
      { id: 3, title: "Backend integration", completed: false },
      { id: 4, title: "Testing", completed: false }
    ]
  },
  {
    id: 4,
    name: "Brand Identity Refresh",
    client: "Tech Solutions Inc.",
    clientId: 1,
    deadline: "2024-05-20",
    progress: 90,
    team: 3,
    status: "In Progress",
    tasks: [
      { id: 1, title: "Market research", completed: true },
      { id: 2, title: "Logo redesign", completed: true },
      { id: 3, title: "Brand guidelines", completed: true },
      { id: 4, title: "Collateral design", completed: false }
    ]
  },
  {
    id: 5,
    name: "Content Marketing Strategy",
    client: "Digital Marketing Pro",
    clientId: 2,
    deadline: "2024-07-15",
    progress: 10,
    team: 2,
    status: "Canceled",
    tasks: [
      { id: 1, title: "Audience research", completed: true },
      { id: 2, title: "Content calendar", completed: false },
      { id: 3, title: "Content creation", completed: false },
      { id: 4, title: "Distribution plan", completed: false }
    ]
  }
];

const Projects = () => {
  const [statusFilter, setStatusFilter] = useState("Все");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projects, setProjects] = useState(mockProjects);
  const [showProjectForm, setShowProjectForm] = useState(false);

  // Filter projects by status
  const filteredProjects = statusFilter === "All" 
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Проекты</h1>
          <p className="text-muted-foreground">Отслеживание текущих проектов</p>
        </div>
        <Button onClick={() => setShowProjectForm(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Новый проект
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Filter by status:</span>
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
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
              <CardTitle className="text-xl">{project.name}</CardTitle>
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
                    project.status === "Ready" ? "bg-green-100 text-green-800" :
                    project.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                    project.status === "Frozen" ? "bg-purple-100 text-purple-800" :
                    project.status === "Canceled" ? "bg-red-100 text-red-800" :
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
            <p className="text-muted-foreground">No projects found with the selected filter.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setStatusFilter("All")}
            >
              Show all projects
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
        onSubmit={handleCreateProject}
      />
    </div>
  );
};

export default Projects;
