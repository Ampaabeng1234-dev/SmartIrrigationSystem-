import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { StopCircle, Shield, Settings } from "lucide-react";
import { useState } from "react";

export function SystemControl() {
  const { toast } = useToast();
  const [autoMode, setAutoMode] = useState(true);

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    refetchInterval: 30000,
  });

  const emergencyStopMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/system/emergency-stop");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/zones"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Emergency Stop Activated",
        description: data.message,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEmergencyStop = () => {
    emergencyStopMutation.mutate();
  };

  const handleAutoModeToggle = (checked: boolean) => {
    setAutoMode(checked);
    toast({
      title: `Auto Mode ${checked ? "Enabled" : "Disabled"}`,
      description: `Automatic irrigation scheduling has been ${checked ? "enabled" : "disabled"}.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Control Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Irrigation Schedule */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Irrigation Schedule</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Auto Mode</span>
                <Switch
                  checked={autoMode}
                  onCheckedChange={handleAutoModeToggle}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Manual Override</span>
                <Button variant="outline" size="sm" className="border-blue-600 text-blue-600">
                  Enable
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Emergency Stop</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-600 text-red-600 hover:bg-red-50"
                  onClick={handleEmergencyStop}
                  disabled={emergencyStopMutation.isPending}
                >
                  <StopCircle className="h-4 w-4 mr-1" />
                  {emergencyStopMutation.isPending ? "Stopping..." : "Stop All"}
                </Button>
              </div>
            </div>
          </div>

          {/* Sensor Status */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Sensor Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Soil Moisture Sensors</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {stats?.sensorsOnline || 8}/8 Online
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Weather Station</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Connected
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Flow Meters</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    2/3 Online
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">System Information</h4>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="text-gray-600">Last Sync</p>
                <p className="font-medium">{stats?.lastSync ? new Date(stats.lastSync).toLocaleString() : "2 minutes ago"}</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-600">System Uptime</p>
                <p className="font-medium">15 days, 7 hours</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-600">Data Points Today</p>
                <p className="font-medium">2,847</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
