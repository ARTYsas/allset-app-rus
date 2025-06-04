
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FolderOpen, File, Image, FileText } from 'lucide-react';
import { FileUploadDialog } from '@/components/FileUpload/FileUploadDialog';
import { useToast } from '@/hooks/use-toast';
import { useFiles } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';

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
  const { data: fetchedFiles, isLoading, error, refetch } = useFiles();
  const [files, setFiles] = useState<any[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (fetchedFiles) {
      setFiles(fetchedFiles);
    }
  }, [fetchedFiles]);

  const handleFileUpload = async (uploadedFiles: File[]) => {
    try {
      // В реальном приложении здесь должна быть загрузка файлов в хранилище Supabase
      // Для демонстрации просто создаем записи в БД
      for (const file of uploadedFiles) {
        const { error } = await supabase.from('files').insert([
          {
            name: file.name,
            type: file.type.includes('image') ? 'image' : 'document',
            size: `${(file.size / 1024).toFixed(2)} КБ`,
            file_url: URL.createObjectURL(file), // В реальном приложении здесь должен быть URL из хранилища
            project_id: null // В реальной реализации здесь нужно добавить выбор проекта
          }
        ]);

        if (error) throw error;
      }

      toast({
        title: "Файлы загружены",
        description: `${uploadedFiles.length} ${uploadedFiles.length === 1 ? "файл загружен" : "файла загружено"} успешно.`,
      });

      refetch();
    } catch (error: any) {
      console.error('Error uploading files:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось загрузить файлы",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-12">Загрузка данных...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-6">Ошибка загрузки данных: {(error as Error).message}</div>;
  }

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
        {files.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-muted-foreground">
            Пока нет файлов. Загрузите свой первый файл.
          </div>
        ) : (
          files.map((file) => (
            <Card key={file.id} className="hover:bg-gray-50 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <FileIcon type={file.type} />
                  <div className="space-y-1">
                    <h3 className="font-medium">{file.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {file.size} • {file.projectName ? `Проект: ${file.projectName}` : 'Без проекта'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Загружено: {new Date(file.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
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
