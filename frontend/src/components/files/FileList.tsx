import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Search, 
  MoreVertical, 
  Download, 
  Trash2, 
  Eye,
  FileText,
  FileImage,
  FileSpreadsheet,
  File,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { formatDistance } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  status: 'processing' | 'ready' | 'error';
  uploader?: string;
}

interface FileListProps {
  files: FileItem[];
  onDelete: (fileId: string) => void;
  onDownload?: (fileId: string) => void;
  onPreview?: (fileId: string) => void;
  isLoading?: boolean;
}

/**
 * FileList - Sophisticated file management table with search and actions
 * Features: Search/filter, status indicators, bulk actions, responsive design
 */
export function FileList({
  files,
  onDelete,
  onDownload,
  onPreview,
  isLoading = false
}: FileListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteFileId, setDeleteFileId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof FileItem>('uploadDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return FileText;
    if (fileType.includes('image')) return FileImage;
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return FileSpreadsheet;
    return File;
  };

  const getStatusConfig = (status: FileItem['status']) => {
    switch (status) {
      case 'processing':
        return {
          icon: Loader2,
          label: 'Processing',
          className: 'text-status-processing bg-status-processing/10',
          iconClassName: 'animate-spin'
        };
      case 'ready':
        return {
          icon: CheckCircle,
          label: 'Ready',
          className: 'text-status-ready bg-status-ready/10',
          iconClassName: ''
        };
      case 'error':
        return {
          icon: AlertCircle,
          label: 'Error',
          className: 'text-status-error bg-status-error/10',
          iconClassName: ''
        };
      default:
        return {
          icon: Clock,
          label: 'Unknown',
          className: 'text-muted-foreground bg-muted',
          iconClassName: ''
        };
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof FileItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteFileId) {
      onDelete(deleteFileId);
      setDeleteFileId(null);
      toast({
        title: "File deleted",
        description: "The file has been successfully deleted",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
          <span className="text-muted-foreground">Loading files...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with search */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Your Documents</h2>
          <p className="text-muted-foreground">
            {files.length} {files.length === 1 ? 'document' : 'documents'} uploaded
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80 bg-background/50 focus:bg-background transition-all duration-normal"
            />
          </div>
        </div>
      </div>

      {/* Files table */}
      <Card>
        {sortedFiles.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery ? 'No files found' : 'No documents yet'}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Upload your first document to get started'
              }
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('name')}
                >
                  Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('size')}
                >
                  Size {sortField === 'size' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('status')}
                >
                  Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('uploadDate')}
                >
                  Uploaded {sortField === 'uploadDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Uploader</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedFiles.map((file) => {
                const IconComponent = getFileIcon(file.type);
                const statusConfig = getStatusConfig(file.status);
                
                return (
                  <TableRow 
                    key={file.id} 
                    className="hover:bg-accent/50 transition-colors group"
                  >
                    <TableCell>
                      <IconComponent className="h-5 w-5 text-muted-foreground" />
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-foreground truncate max-w-xs">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {file.type}
                        </p>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-muted-foreground">
                      {formatFileSize(file.size)}
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={statusConfig.className}>
                        <statusConfig.icon className={`h-3 w-3 mr-1 ${statusConfig.iconClassName}`} />
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="text-muted-foreground">
                      {formatDistance(file.uploadDate, new Date(), { addSuffix: true })}
                    </TableCell>
                    
                    <TableCell>
                      {file.uploader && (
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {file.uploader.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            {file.uploader}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onPreview && (
                            <DropdownMenuItem onClick={() => onPreview(file.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                          )}
                          {onDownload && (
                            <DropdownMenuItem onClick={() => onDownload(file.id)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteFileId(file.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteFileId} onOpenChange={() => setDeleteFileId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete file</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}