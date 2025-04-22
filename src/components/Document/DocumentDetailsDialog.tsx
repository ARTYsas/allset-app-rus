
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

interface DocumentDetailsDialogProps {
  document: {
    id: number;
    name: string;
    type: string;
    size: string;
    lastModified: string;
    content: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DocumentDetailsDialog({ document, open, onOpenChange }: DocumentDetailsDialogProps) {
  // Convert markdown-like content to JSX
  const renderContent = () => {
    if (!document.content) return null;
    
    const parts = document.content.split('\n\n');
    return parts.map((part, index) => {
      if (part.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mb-4">{part.substring(2)}</h1>;
      } else if (part.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold mt-6 mb-2">{part.substring(3)}</h2>;
      } else {
        return <p key={index} className="mb-4">{part}</p>;
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            {document.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
          <div>
            Type: {document.type} • Size: {document.size}
          </div>
          <div>
            Last modified: {document.lastModified}
          </div>
        </div>
        
        <div className="border rounded-md p-6 bg-white">
          {renderContent()}
        </div>
        
        <div className="flex justify-end mt-4">
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
