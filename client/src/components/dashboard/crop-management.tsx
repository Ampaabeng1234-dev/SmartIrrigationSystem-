import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Leaf, Sprout } from "lucide-react";

export function CropManagement() {
  const { data: crops, isLoading } = useQuery({
    queryKey: ["/api/crops"],
    refetchInterval: 60000, // 1 minute
  });

  const getCropStatusColor = (growthStage: string) => {
    switch (growthStage.toLowerCase()) {
      case "flowering":
      case "fruiting":
        return "bg-green-100 text-green-800";
      case "leafing":
        return "bg-yellow-100 text-yellow-800";
      case "seedling":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>Crop Management</CardTitle>
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
          <CardTitle>Crop Management</CardTitle>
          <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
            <Sprout className="h-4 w-4 mr-2" />
            Manage Crops
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {crops?.map((crop: any) => (
            <div key={crop.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Leaf className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{crop.name}</p>
                    <p className="text-sm text-gray-600">Field assignments</p>
                  </div>
                </div>
                <Badge className={getCropStatusColor(crop.growthStage)}>
                  {crop.growthStage}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Water Requirement</p>
                  <p className="font-medium">{crop.waterRequirement}</p>
                </div>
                <div>
                  <p className="text-gray-600">Optimal Moisture</p>
                  <p className="font-medium">{crop.optimalMoisture}%</p>
                </div>
              </div>
            </div>
          ))}
          
          {(!crops || crops.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <p>No crops configured.</p>
              <p className="text-sm">Click "Manage Crops" to add crop information.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
