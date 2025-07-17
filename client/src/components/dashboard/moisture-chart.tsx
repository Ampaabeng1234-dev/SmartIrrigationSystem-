import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export function MoistureChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const { data: sensorReadings, isLoading } = useQuery({
    queryKey: ["/api/sensor-readings"],
    refetchInterval: 30000, // 30 seconds
  });

  useEffect(() => {
    if (!chartRef.current || isLoading || !sensorReadings) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Process data for chart
    const processedData = processChartData(sensorReadings);

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: processedData.labels,
        datasets: [
          {
            label: "Zone 1",
            data: processedData.zone1,
            borderColor: "hsl(142, 71%, 45%)",
            backgroundColor: "hsl(142, 71%, 45%, 0.1)",
            tension: 0.4,
          },
          {
            label: "Zone 2", 
            data: processedData.zone2,
            borderColor: "hsl(25, 95%, 53%)",
            backgroundColor: "hsl(25, 95%, 53%, 0.1)",
            tension: 0.4,
          },
          {
            label: "Zone 3",
            data: processedData.zone3,
            borderColor: "hsl(221, 83%, 53%)",
            backgroundColor: "hsl(221, 83%, 53%, 0.1)",
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: "Moisture Level (%)",
            },
          },
          x: {
            title: {
              display: true,
              text: "Time",
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [sensorReadings, isLoading]);

  const processChartData = (readings: any[]) => {
    // Group readings by zone and get last 24 hours
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const filteredReadings = readings.filter(
      (reading) => new Date(reading.timestamp) >= last24Hours
    );

    // Create time labels for last 24 hours
    const labels = [];
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      labels.push(time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }

    // Initialize data arrays
    const zone1 = new Array(24).fill(0);
    const zone2 = new Array(24).fill(0);
    const zone3 = new Array(24).fill(0);

    // Fill with actual data
    filteredReadings.forEach((reading) => {
      const readingTime = new Date(reading.timestamp);
      const hoursAgo = Math.floor((now.getTime() - readingTime.getTime()) / (60 * 60 * 1000));
      const index = 23 - hoursAgo;
      
      if (index >= 0 && index < 24) {
        if (reading.zoneId === 1) zone1[index] = reading.moistureLevel;
        else if (reading.zoneId === 2) zone2[index] = reading.moistureLevel;
        else if (reading.zoneId === 3) zone3[index] = reading.moistureLevel;
      }
    });

    return { labels, zone1, zone2, zone3 };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Soil Moisture Trends</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
              24H
            </Button>
            <Button variant="outline" size="sm">
              7D
            </Button>
            <Button variant="outline" size="sm">
              30D
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <canvas ref={chartRef} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
