import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Plus, Power, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function IrrigationZones() {
  const { toast } = useToast();
  
  const { data: zones, isLoading } = useQuery({
    queryKey: ["/api/zones"],
    refetchInterval: 30000, // 30 seconds
  });

  const toggleZoneMutation = useMutation({
    mutationFn: async ({ zoneId, isActive }: { zoneId: number; isActive: boolean }) => {
      const response = await apiRequest("PUT", `/api/zones/${zoneId}`, { isActive });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/zones"] });
      toast({
        title: "Zone Updated",
        description: "Irrigation zone status has been updated successfully.",
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

  const handleToggleZone = (zoneId: number, currentStatus: boolean) => {
    toggleZoneMutation.mutate({ zoneId, isActive: !currentStatus });
  };

  const getStatusColor = (isActive: boolean, moistureLevel: number) => {
    if (isActive) return "bg-green-500";
    if (moistureLevel < 30) return "bg-orange-500";
    return "bg-gray-300";
  };

  const getStatusText = (isActive: boolean, moistureLevel: number) => {
    if (isActive) return "Active";
    if (moistureLevel < 30) return "Needs Water";
    return "Optimal";
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>Irrigation Zones</CardTitle>
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
          <CardTitle>Irrigation Zones</CardTitle>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Zone
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {zones?.map((zone: any) => (
            <div
              key={zone.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-3 ${getStatusColor(
                    zone.isActive,
                    zone.moistureLevel
                  )}`}
                ></div>
                <div>
                  <p className="font-medium text-gray-900">{zone.name}</p>
                  <p className="text-sm text-gray-600">
                    {zone.crop?.name || "No crop assigned"} • {zone.moistureLevel}% moisture
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {getStatusText(zone.isActive, zone.moistureLevel)}
                </Badge>
                <Button
                  size="sm"
                  variant={zone.isActive ? "default" : "outline"}
                  onClick={() => handleToggleZone(zone.id, zone.isActive)}
                  disabled={toggleZoneMutation.isPending}
                  className={
                    zone.isActive
                      ? "bg-green-600 hover:bg-green-700"
                      : zone.moistureLevel < 30
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : ""
                  }
                >
                  {zone.isActive ? (
                    <Power className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
          
          {(!zones || zones.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <p>No irrigation zones configured.</p>
              <p className="text-sm">Click "Add Zone" to create your first zone.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
