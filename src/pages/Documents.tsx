
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, PlusCircle } from 'lucide-react';

const mockDocuments = [
  {
    id: 1,
    name: "Project Proposal - Tech Solutions",
    type: "PDF",
    size: "2.5 MB",
    lastModified: "2024-03-15",
  },
  {
    id: 2,
    name: "Service Agreement Template",
    type: "DOCX",
    size: "1.8 MB",
    lastModified: "2024-03-10",
  },
  {
    id: 3,
    name: "Marketing Campaign Report",
    type: "PDF",
    size: "3.2 MB",
    lastModified: "2024-03-05",
  }
];

const Documents = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Manage your business documents</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <div className="grid gap-4">
        {mockDocuments.map((doc) => (
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
                  <Button variant="outline" size="sm">
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
    </div>
  );
};

export default Documents;
