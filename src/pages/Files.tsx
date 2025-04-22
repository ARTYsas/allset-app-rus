import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FolderOpen, File, Image, FileText } from 'lucide-react';
import { FileUploadDialog } from '@/components/FileUpload/FileUploadDialog';
import { useToast } from '@/hooks/use-toast';

const mockFiles = [
  {
    id: 1,
    name: "Активы проекта",
    type: "folder",
    items: 15,
    size: "250 МБ"
  },
  {
    id: 2,
    name: "Презентации для клиентов",
    type: "folder",
    items: 8,
    size: "180 МБ"
  },
  {
    id: 3,
    name: "логотип-финальный.png",
    type: "image",
    size: "2.5 МБ",
    modified: "2024-03-15"
  },
  {
    id: 4,
    name: "описание-проекта.pdf",
    type: "document",
    size: "1.2 МБ",
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
      title: "Файлы загружены",
      description: `${files.length} файлы загружены успешно.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Файлы</h1>
          <p className="text-muted-foreground">Управление файлами и папками</p>
        </div>
        <Button onClick={() => setShowUploadDialog(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Загрузить файлы
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
                      ? `${file.items} элементов • ${file.size}`
                      : `${file.size} • Изменено ${file.modified}`
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
