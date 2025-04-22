
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, PlusCircle, File } from 'lucide-react';
import { DocumentTemplateDialog } from '@/components/Document/DocumentTemplateDialog';
import { DocumentDetailsDialog } from '@/components/Document/DocumentDetailsDialog';
import { DocumentFormDialog } from '@/components/Document/DocumentFormDialog';

const mockDocuments = [
  {
    id: 1,
    name: "Project Proposal - Tech Solutions",
    type: "PDF",
    size: "2.5 MB",
    lastModified: "2024-03-15",
    content: "This is a project proposal for Tech Solutions. It includes details about the project scope, timeline, and budget.",
  },
  {
    id: 2,
    name: "Service Agreement Template",
    type: "DOCX",
    size: "1.8 MB",
    lastModified: "2024-03-10",
    content: "This is a service agreement template. It includes terms and conditions for providing services to clients.",
  },
  {
    id: 3,
    name: "Marketing Campaign Report",
    type: "PDF",
    size: "3.2 MB",
    lastModified: "2024-03-05",
    content: "This is a marketing campaign report. It includes details about the campaign performance, budget, and results.",
  }
];

const Documents = () => {
  const [documents, setDocuments] = useState(mockDocuments);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const handleAddDocument = (documentData: any) => {
    const newDocument = {
      id: documents.length + 1,
      ...documentData,
      lastModified: new Date().toISOString().split('T')[0],
      size: "1.0 MB", // Default size
    };
    setDocuments([...documents, newDocument]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Manage your business documents</p>
        </div>
        <Button onClick={() => setShowTemplateDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Document
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
                    Type: {doc.type} • Size: {doc.size}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last modified: {doc.lastModified}
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
    </div>
  );
};

export default Documents;
