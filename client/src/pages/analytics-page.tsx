import { NavigationHeader } from "@/components/dashboard/navigation-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MoistureChart } from "@/components/dashboard/moisture-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Detailed insights and historical data analysis</p>
        </div>

        <Tabs defaultValue="moisture" className="space-y-6">
          <TabsList>
            <TabsTrigger value="moisture">Moisture Trends</TabsTrigger>
            <TabsTrigger value="water">Water Usage</TabsTrigger>
            <TabsTrigger value="weather">Weather Impact</TabsTrigger>
            <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          </TabsList>

          <TabsContent value="moisture" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>7-Day Moisture Trends</CardTitle>
                  <CardDescription>Historical moisture levels across all zones</CardDescription>
                </CardHeader>
                <CardContent>
                  <MoistureChart />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Zone Performance</CardTitle>
                  <CardDescription>Moisture maintenance efficiency by zone</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Zone 1 (Tomatoes)</span>
                      <span className="text-sm text-green-600">92% efficiency</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Zone 2 (Lettuce)</span>
                      <span className="text-sm text-yellow-600">78% efficiency</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Zone 3 (Peppers)</span>
                      <span className="text-sm text-green-600">95% efficiency</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="water" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Water Usage Analytics</CardTitle>
                <CardDescription>Track water consumption patterns and optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Water usage analytics will be displayed here with charts showing daily, weekly, and monthly consumption patterns.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weather" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weather Impact Analysis</CardTitle>
                <CardDescription>Correlation between weather conditions and irrigation needs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Weather impact analysis will show how environmental conditions affect irrigation requirements.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="efficiency" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Efficiency Metrics</CardTitle>
                <CardDescription>Overall system performance and optimization recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Efficiency metrics and optimization recommendations will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
