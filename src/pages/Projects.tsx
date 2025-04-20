
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Clock, Users, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const mockProjects = [
  {
    id: 1,
    name: "E-commerce Platform Redesign",
    client: "Tech Solutions Inc.",
    deadline: "2024-05-15",
    progress: 75,
    team: 4,
  },
  {
    id: 2,
    name: "SEO Optimization Campaign",
    client: "Digital Marketing Pro",
    deadline: "2024-04-30",
    progress: 45,
    team: 2,
  },
  {
    id: 3,
    name: "Mobile App Development",
    client: "Web Design Studio",
    deadline: "2024-06-01",
    progress: 20,
    team: 5,
  }
];

const Projects = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Track your ongoing projects</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid gap-6">
        {mockProjects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle className="text-xl">{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Client:</span>
                  <span className="font-medium">{project.client}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Deadline:</span>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{project.deadline}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Team:</span>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span>{project.team} members</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Projects;
