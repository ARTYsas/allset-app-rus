import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FolderOpen, File, Image, FileText } from 'lucide-react';
import { FileUploadDialog } from '@/components/FileUpload/FileUploadDialog';
import { useToast } from '@/hooks/use-toast';

const mockFiles = [
  {
    id: 1,
    name: "Project Assets",
    type: "folder",
    items: 15,
    size: "250 MB"
  },
  {
    id: 2,
    name: "Client Presentations",
    type: "folder",
    items: 8,
    size: "180 MB"
  },
  {
    id: 3,
    name: "logo-design-final.png",
    type: "image",
    size: "2.5 MB",
    modified: "2024-03-15"
  },
  {
    id: 4,
    name: "project-brief.pdf",
    type: "document",
    size: "1.2 MB",
    modified: "2024-03-14"
  }
];

const FileIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "folder":
      return <FolderOpen className="h-8 w-8 text-blue-500" />;
    case "image":
      return <Image className="h-8 w-8 text-green-500" />;
    case "document":
      return <FileText className="h-8 w-8 text-orange-500" />;
    default:
      return <File className="h-8 w-8 text-gray-500" />;
  }
};

const Files = () => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (files: File[]) => {
    toast({
      title: "Files uploaded",
      description: `${files.length} files have been uploaded successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Files</h1>
          <p className="text-muted-foreground">Manage your files and folders</p>
        </div>
        <Button onClick={() => setShowUploadDialog(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockFiles.map((file) => (
          <Card key={file.id} className="hover:bg-gray-50 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <FileIcon type={file.type} />
                <div className="space-y-1">
                  <h3 className="font-medium">{file.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {file.type === "folder" 
                      ? `${file.items} items • ${file.size}`
                      : `${file.size} • Modified ${file.modified}`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <FileUploadDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onUpload={handleFileUpload}
      />
    </div>
  );
};

export default Files;
