import { NavigationHeader } from "@/components/dashboard/navigation-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { MoistureChart } from "@/components/dashboard/moisture-chart";
import { WeatherWidget } from "@/components/dashboard/weather-widget";
import { IrrigationZones } from "@/components/dashboard/irrigation-zones";
import { CropManagement } from "@/components/dashboard/crop-management";
import { SystemControl } from "@/components/dashboard/system-control";
import { UserManagement } from "@/components/dashboard/user-management";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "warning",
      title: "Low Soil Moisture Alert",
      message: "Field A - Zone 2: Moisture level dropped to 15%. Irrigation recommended."
    }
  ]);

  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Banner */}
        {alerts.map(alert => (
          <Alert key={alert.id} className="mb-6 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <p className="font-medium text-orange-800">{alert.title}</p>
                <p className="text-sm text-gray-600">{alert.message}</p>
              </div>
              <button
                onClick={() => dismissAlert(alert.id)}
                className="text-orange-600 hover:text-orange-800"
              >
                <X className="h-4 w-4" />
              </button>
            </AlertDescription>
          </Alert>
        ))}

        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Irrigation Dashboard</h1>
          <p className="text-gray-600 mb-6">Monitor and manage your smart irrigation system in real-time</p>
          
          <StatsCards />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <MoistureChart />
          </div>
          <div className="lg:col-span-1">
            <WeatherWidget />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <IrrigationZones />
          <CropManagement />
        </div>

        <div className="mb-8">
          <SystemControl />
        </div>

        {user?.role === "admin" && (
          <div className="mb-8">
            <UserManagement />
          </div>
        )}
      </div>
    </div>
  );
}
