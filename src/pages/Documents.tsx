
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, PlusCircle, Trash2 } from 'lucide-react';
import { DocumentTemplateDialog } from '@/components/Document/DocumentTemplateDialog';
import { DocumentDetailsDialog } from '@/components/Document/DocumentDetailsDialog';
import { DocumentFormDialog } from '@/components/Document/DocumentFormDialog';
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
import { useDocuments } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { Document } from '@/types/supabaseTypes';

const Documents = () => {
  const { data: fetchedDocuments, isLoading, error, refetch } = useDocuments();
  const [documents, setDocuments] = useState<any[]>([]);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (fetchedDocuments) {
      setDocuments(fetchedDocuments);
    }
  }, [fetchedDocuments]);

  const handleAddDocument = async (documentData: any) => {
    try {
      const { data: newDocument, error } = await supabase
        .from('documents')
        .insert([{
          name: documentData.name,
          type: documentData.type || 'other',
          client_id: documentData.client_id || null,
          project_id: documentData.project_id || null,
          file_url: documentData.file_url || 'https://example.com/documents/new-document.pdf'
        }])
        .select();

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Документ создан",
      });

      refetch();
    } catch (error: any) {
      console.error('Error creating document:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать документ",
        variant: "destructive"
      });
    }
  };

  const handleDeleteDocument = async () => {
    if (documentToDelete === null) return;
    
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentToDelete);

      if (error) throw error;
      
      setDocumentToDelete(null);
      setDeleteDialogOpen(false);
      
      toast({
        title: "Успешно",
        description: "Документ удален",
      });
      
      refetch();
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось удалить документ",
        variant: "destructive"
      });
    }
  };

  const openDeleteDialog = (docId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setDocumentToDelete(docId);
    setDeleteDialogOpen(true);
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
          <h1 className="text-3xl font-bold tracking-tight">Документы</h1>
          <p className="text-muted-foreground">Управление бизнес-документами</p>
        </div>
        <Button onClick={() => setShowTemplateDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Создать документ
        </Button>
      </div>

      <div className="grid gap-4">
        {documents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Пока нет документов. Создайте свой первый документ.
          </div>
        ) : (
          documents.map((doc) => (
            <Card key={doc.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    {doc.name}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Тип: {doc.type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {doc.clientName && `Клиент: ${doc.clientName} • `}
                      {doc.projectName && `Проект: ${doc.projectName}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Создан: {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedDocument({
                        ...doc,
                        content: "# " + doc.name + "\n\nЭтот документ связан с " + 
                          (doc.projectName ? "проектом " + doc.projectName : "клиентом " + doc.clientName) +
                          ".\n\n## Детали\n\nЗдесь размещается содержимое документа."
                      })}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => openDeleteDialog(doc.id, e)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Template Selection Dialog */}
      <DocumentTemplateDialog
        open={showTemplateDialog}
        onOpenChange={setShowTemplateDialog}
        onSelectTemplate={(template) => {
          setSelectedTemplate(template);
          setShowTemplateDialog(false);
          setShowDocumentForm(true);
        }}
      />

      {/* Document Form Dialog */}
      <DocumentFormDialog
        open={showDocumentForm}
        onOpenChange={setShowDocumentForm}
        template={selectedTemplate}
        onSubmit={handleAddDocument}
      />

      {/* Document Details Dialog */}
      {selectedDocument && (
        <DocumentDetailsDialog
          document={selectedDocument}
          open={!!selectedDocument}
          onOpenChange={(open) => !open && setSelectedDocument(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Документ будет безвозвратно удален.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDocument} className="bg-red-500 hover:bg-red-700">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Documents;
