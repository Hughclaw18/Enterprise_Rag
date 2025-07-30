import { useState, useEffect } from 'react';
import { FileUpload } from '@/components/files/FileUpload';
import { FileList, FileItem } from '@/components/files/FileList';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, BarChart3, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * FilesPage - Comprehensive file management interface
 * Features: Upload, list view, analytics, responsive design
 */
export function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('files');
  const { toast } = useToast();

  // Mock data for demonstration
  useEffect(() => {
    // Simulate loading files from API
    setTimeout(() => {
      const mockFiles: FileItem[] = [
        {
          id: '1',
          name: 'Q3_Financial_Report_2024.pdf',
          size: 2547328, // ~2.5MB
          type: 'application/pdf',
          uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          status: 'ready',
          uploader: 'John Doe'
        },
        {
          id: '2',
          name: 'Employee_Handbook_v2.docx',
          size: 1234567, // ~1.2MB
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          status: 'ready',
          uploader: 'Jane Smith'
        },
        {
          id: '3',
          name: 'Customer_Feedback_Analysis.xlsx',
          size: 987654, // ~987KB
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
          status: 'processing',
          uploader: 'Mike Johnson'
        },
        {
          id: '4',
          name: 'Project_Proposal_Draft.pdf',
          size: 3456789, // ~3.5MB
          type: 'application/pdf',
          uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
          status: 'error',
          uploader: 'Sarah Wilson'
        }
      ];
      
      setFiles(mockFiles);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleUploadComplete = (uploadedFiles: File[]) => {
    const newFiles: FileItem[] = uploadedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date(),
      status: 'processing',
      uploader: 'Current User' // Would be from auth context
    }));

    setFiles(prev => [...newFiles, ...prev]);

    // Simulate processing completion
    setTimeout(() => {
      setFiles(prev => prev.map(file => 
        newFiles.find(nf => nf.id === file.id) 
          ? { ...file, status: 'ready' }
          : file
      ));
    }, 3000);

    toast({
      title: "Upload started",
      description: `${uploadedFiles.length} file(s) are being processed`,
    });
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    // In real app: await fetch(`/api/files/${fileId}`, { method: 'DELETE' });
  };

  const handleDownloadFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      toast({
        title: "Download started",
        description: `Downloading ${file.name}`,
      });
      // In real app: window.open(`/api/files/${fileId}/download`);
    }
  };

  const handlePreviewFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      toast({
        title: "Preview opened",
        description: `Opening preview for ${file.name}`,
      });
      // In real app: open preview modal or new tab
    }
  };

  const getFileStats = () => {
    const totalFiles = files.length;
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const readyFiles = files.filter(f => f.status === 'ready').length;
    const processingFiles = files.filter(f => f.status === 'processing').length;
    const errorFiles = files.filter(f => f.status === 'error').length;

    return { totalFiles, totalSize, readyFiles, processingFiles, errorFiles };
  };

  const stats = getFileStats();

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Document Management</h1>
          <p className="text-muted-foreground mt-1">
            Upload, organize, and manage your enterprise documents
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          <Button size="sm" className="bg-gradient-primary">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Documents</p>
              <p className="text-2xl font-semibold">{stats.totalFiles}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-status-ready/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-status-ready" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Storage Used</p>
              <p className="text-2xl font-semibold">
                {(stats.totalSize / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Status Overview</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className="bg-status-ready/10 text-status-ready">
                  {stats.readyFiles} Ready
                </Badge>
                {stats.processingFiles > 0 && (
                  <Badge className="bg-status-processing/10 text-status-processing">
                    {stats.processingFiles} Processing
                  </Badge>
                )}
                {stats.errorFiles > 0 && (
                  <Badge className="bg-status-error/10 text-status-error">
                    {stats.errorFiles} Error
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-glow/10 rounded-lg flex items-center justify-center">
              <Upload className="h-5 w-5 text-primary-glow" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-semibold">12</p>
              <p className="text-xs text-muted-foreground">documents uploaded</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="files">All Files</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="space-y-6">
          <FileList
            files={files}
            onDelete={handleDeleteFile}
            onDownload={handleDownloadFile}
            onPreview={handlePreviewFile}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <FileUpload
            onUploadComplete={handleUploadComplete}
            maxFiles={10}
            maxFileSize={50}
            acceptedTypes={['.pdf', '.docx', '.txt', '.csv', '.xlsx', '.pptx']}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="p-8 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
            <p className="text-muted-foreground mb-4">
              Detailed analytics and insights about your document usage will be displayed here.
            </p>
            <Button variant="outline">
              View Detailed Analytics
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}