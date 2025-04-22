
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Building2, Briefcase } from "lucide-react";
import { useState } from "react";
import { ProjectCard } from "@/components/Project/ProjectCard";
import { ProjectDetailsDialog } from "@/components/Project/ProjectDetailsDialog";

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
      name: "Website Redesign",
      deadline: "2024-05-15",
      progress: 75,
      status: "In Progress",
      tasks: [
        { id: 1, title: "Design homepage", completed: true },
        { id: 2, title: "Implement responsive design", completed: true },
        { id: 3, title: "Add contact form", completed: false },
        { id: 4, title: "SEO optimization", completed: false }
      ]
    },
    {
      id: 2,
      name: "Marketing Campaign",
      deadline: "2024-06-20",
      progress: 30,
      status: "In Progress",
      tasks: [
        { id: 1, title: "Define target audience", completed: true },
        { id: 2, title: "Create content plan", completed: true },
        { id: 3, title: "Design visual assets", completed: false },
        { id: 4, title: "Launch campaign", completed: false },
        { id: 5, title: "Analyze results", completed: false }
      ]
    }
  ],
  2: [
    {
      id: 3,
      name: "SEO Optimization",
      deadline: "2024-04-30",
      progress: 45,
      status: "In Progress",
      tasks: [
        { id: 1, title: "Keyword research", completed: true },
        { id: 2, title: "On-page optimization", completed: false },
        { id: 3, title: "Content update", completed: false }
      ]
    }
  ],
  3: [
    {
      id: 4,
      name: "Mobile App Development",
      deadline: "2024-06-01",
      progress: 20,
      status: "In Progress",
      tasks: [
        { id: 1, title: "UI/UX design", completed: true },
        { id: 2, title: "Frontend development", completed: false },
        { id: 3, title: "Backend integration", completed: false },
        { id: 4, title: "Testing", completed: false },
        { id: 5, title: "App store submission", completed: false }
      ]
    }
  ]
};

export function ClientDetailsDialog({ client, open, onOpenChange }: ClientDetailsProps) {
  // Get projects for this client
  const clientProjects = mockClientProjects[client.id as keyof typeof mockClientProjects] || [];
  const [selectedProject, setSelectedProject] = useState<any>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Client Details</DialogTitle>
        </DialogHeader>
        <Card>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center space-x-4">
              <Building2 className="h-6 w-6 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Company Name</p>
                <p className="text-lg font-semibold">{client.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Mail className="h-6 w-6 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg">{client.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="h-6 w-6 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-lg">{client.phone}</p>
              </div>
            </div>
            <div className="pt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                client.status === "Active" 
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
            Client Projects
          </h3>
          
          {clientProjects.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {clientProjects.map((project) => (
                <ProjectCard 
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No projects for this client yet.</p>
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
