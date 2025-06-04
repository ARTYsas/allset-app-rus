
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, PlusCircle, File, Trash2 } from 'lucide-react';
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

const mockDocuments = [
  {
    id: 1,
    name: "Предложение по проекту - Тех Решения",
    type: "PDF",
    size: "2.5 МБ",
    lastModified: "2024-03-15",
    content: "Это предложение по проекту для Тех Решения. Оно включает детали о масштабе проекта, сроках и бюджете.",
  },
  {
    id: 2,
    name: "Шаблон соглашения об услугах",
    type: "DOCX",
    size: "1.8 МБ",
    lastModified: "2024-03-10",
    content: "Это шаблон соглашения об услугах. Он включает условия предоставления услуг клиентам.",
  },
  {
    id: 3,
    name: "Отчет о маркетинговой кампании",
    type: "PDF",
    size: "3.2 МБ",
    lastModified: "2024-03-05",
    content: "Это отчет о маркетинговой кампании. Он включает детали о производительности кампании, бюджете и результатах.",
  }
];

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  content: string;
}

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  const handleAddDocument = (documentData: any) => {
    const newDocument = {
      id: documents.length + 1,
      ...documentData,
      lastModified: new Date().toISOString().split('T')[0],
      size: "1.0 МБ", // Default size
    };
    setDocuments([...documents, newDocument]);
  };

  const handleDeleteDocument = () => {
    if (documentToDelete === null) return;
    
    const updatedDocuments = documents.filter(doc => doc.id !== documentToDelete);
    setDocuments(updatedDocuments);
    setDocumentToDelete(null);
    setDeleteDialogOpen(false);
    
    toast({
      title: "Успешно",
      description: "Документ удален",
    });
  };

  const openDeleteDialog = (docId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setDocumentToDelete(docId);
    setDeleteDialogOpen(true);
  };

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
        {documents.map((doc) => (
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
                    Тип: {doc.type} • Размер: {doc.size}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Изменен: {doc.lastModified}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedDocument(doc)}
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
        ))}
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
