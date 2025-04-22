
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProjectCardProps {
  project: {
    id: number;
    name: string;
    deadline: string;
    progress: number;
    status: string;
    tasks: Array<{ id: number; title: string; completed: boolean }>;
  };
  onClick?: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const completedTasks = project.tasks.filter(task => task.completed).length;
  const totalTasks = project.tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{project.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-gray-500" />
            <span>Due: {project.deadline}</span>
          </div>
          <div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              project.status === "Completed" ? "bg-green-100 text-green-800" :
              project.status === "In Progress" ? "bg-blue-100 text-blue-800" :
              project.status === "Frozen" ? "bg-purple-100 text-purple-800" :
              project.status === "Canceled" ? "bg-red-100 text-red-800" :
              "bg-gray-100 text-gray-800"
            }`}>
              {project.status}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Progress</span>
            <div className="flex items-center">
              <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
              <span>{completedTasks}/{totalTasks} tasks</span>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
