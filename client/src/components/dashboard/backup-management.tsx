import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Database, Download, RefreshCw, HardDrive, Calendar, FileText, Archive } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Backup {
  filename: string;
  size: number;
  created: string;
  type: string;
}

export function BackupManagement() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: backups, isLoading } = useQuery<Backup[]>({
    queryKey: ["/api/system/backups"],
    enabled: user?.role === "admin",
    refetchInterval: 30000, // 30 seconds
  });

  const createBackupMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/system/backup");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/system/backups"] });
      toast({
        title: "Backup Created",
        description: `Database backup ${data.filename} created successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Backup Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateBackup = () => {
    createBackupMutation.mutate();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getBackupTypeIcon = (type: string) => {
    switch (type) {
      case 'full':
        return <Database className="h-4 w-4 text-blue-600" />;
      case 'schema':
        return <FileText className="h-4 w-4 text-purple-600" />;
      case 'data':
        return <HardDrive className="h-4 w-4 text-green-600" />;
      case 'compressed':
        return <Archive className="h-4 w-4 text-orange-600" />;
      default:
        return <Database className="h-4 w-4 text-gray-600" />;
    }
  };

  const getBackupTypeColor = (type: string) => {
    switch (type) {
      case 'full':
        return "bg-blue-100 text-blue-800";
      case 'schema':
        return "bg-purple-100 text-purple-800";
      case 'data':
        return "bg-green-100 text-green-800";
      case 'compressed':
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (user?.role !== "admin") {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>Database Backups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2 text-primary" />
            Database Backups
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/system/backups"] })}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={handleCreateBackup}
              disabled={createBackupMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              <Download className="h-4 w-4 mr-2" />
              {createBackupMutation.isPending ? "Creating..." : "Create Backup"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {backups && backups.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Database className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium text-blue-900">Total Backups</p>
                <p className="text-2xl font-bold text-blue-600">{backups.length}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <HardDrive className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-sm font-medium text-green-900">Total Size</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatFileSize(backups.reduce((sum, backup) => sum + backup.size, 0))}
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-sm font-medium text-purple-900">Latest Backup</p>
                <p className="text-sm font-bold text-purple-600">
                  {formatDistanceToNow(new Date(backups[0]?.created))} ago
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {backups.map((backup, index) => (
                <div
                  key={backup.filename}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center">
                    {getBackupTypeIcon(backup.type)}
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{backup.filename}</p>
                      <p className="text-sm text-gray-600">
                        {formatDistanceToNow(new Date(backup.created))} ago • {formatFileSize(backup.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getBackupTypeColor(backup.type)}>
                      {backup.type.charAt(0).toUpperCase() + backup.type.slice(1)}
                    </Badge>
                    {index === 0 && (
                      <Badge className="bg-green-100 text-green-800">
                        Latest
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <Database className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-yellow-800">Backup Information</span>
              </div>
              <div className="mt-2 text-sm text-yellow-700">
                <p>• Backups are automatically cleaned up (last 10 kept)</p>
                <p>• Use the comprehensive backup script for scheduled backups</p>
                <p>• Manual backups can be created using: <code className="bg-yellow-100 px-1 rounded">./backup-database.sh</code></p>
                <p>• Restore instructions are available in BACKUP_README.md</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Database className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">No backups found</p>
            <p className="text-sm mb-4">Create your first backup to protect your irrigation data</p>
            <Button
              onClick={handleCreateBackup}
              disabled={createBackupMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              <Download className="h-4 w-4 mr-2" />
              Create First Backup
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}