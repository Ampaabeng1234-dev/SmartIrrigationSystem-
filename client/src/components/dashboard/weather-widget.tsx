import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Sun, Cloud, CloudRain, Lightbulb } from "lucide-react";

export function WeatherWidget() {
  const { data: weather, isLoading } = useQuery({
    queryKey: ["/api/weather"],
    refetchInterval: 600000, // 10 minutes
  });

  const { data: forecast } = useQuery({
    queryKey: ["/api/weather/forecast"],
    refetchInterval: 600000, // 10 minutes
  });

  const getWeatherIcon = (description: string) => {
    if (description.includes("rain")) return <CloudRain className="h-6 w-6 text-blue-500" />;
    if (description.includes("cloud")) return <Cloud className="h-6 w-6 text-gray-400" />;
    return <Sun className="h-6 w-6 text-yellow-500" />;
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
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
        <CardTitle>Weather Forecast</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Today's Weather */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            {getWeatherIcon(weather?.description || "sunny")}
            <div className="ml-3">
              <p className="font-medium text-gray-900">Today</p>
              <p className="text-sm text-gray-600">{weather?.description || "Sunny, No rain expected"}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">{weather?.temperature || 24}°C</p>
            <p className="text-sm text-gray-600">{weather?.humidity || 65}% RH</p>
          </div>
        </div>

        {/* Forecast */}
        <div className="space-y-3">
          {forecast?.slice(1, 4).map((day: any, index: number) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center">
                {getWeatherIcon(day.description)}
                <span className="text-sm text-gray-600 ml-3">
                  {new Date(day.date).toLocaleDateString([], { weekday: 'long' })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-900">{Math.round(day.temperature)}°C</span>
                {day.precipitationProbability > 50 && (
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    Rain {day.precipitationProbability}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* AI Recommendation */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <div className="flex items-center">
            <Lightbulb className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">AI Recommendation</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            {forecast?.[1]?.precipitationProbability > 70 
              ? "Reduce irrigation by 30% due to expected rainfall tomorrow."
              : "Maintain current irrigation schedule based on weather conditions."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
