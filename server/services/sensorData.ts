import { storage } from "../storage";
import { weatherService } from "./weather";

class SensorDataService {
  private isSimulating = false;
  private simulationInterval: NodeJS.Timeout | null = null;

  async startSimulation() {
    if (this.isSimulating) return;
    
    this.isSimulating = true;
    console.log("Starting sensor data simulation...");
    
    // Generate initial sensor readings for all zones
    this.generateInitialReadings();
    
    // Update sensor readings every 30 seconds
    this.simulationInterval = setInterval(() => {
      this.updateSensorReadings();
    }, 30000);
    
    // Update weather data every 10 minutes
    setInterval(() => {
      this.updateWeatherData();
    }, 600000);
  }

  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    this.isSimulating = false;
    console.log("Sensor data simulation stopped");
  }

  private async generateInitialReadings() {
    try {
      const zones = await storage.getAllZones();
      
      for (const zone of zones) {
        const reading = this.generateSensorReading(zone.id);
        await storage.createSensorReading(reading);
      }
      
      console.log("Initial sensor readings generated");
    } catch (error) {
      console.error("Failed to generate initial sensor readings:", error);
    }
  }

  private async updateSensorReadings() {
    try {
      const zones = await storage.getAllZones();
      
      for (const zone of zones) {
        const lastReading = await storage.getLatestSensorReading(zone.id);
        const newReading = this.generateSensorReading(zone.id, lastReading);
        
        await storage.createSensorReading(newReading);
      }
    } catch (error) {
      console.error("Failed to update sensor readings:", error);
    }
  }

  private generateSensorReading(zoneId: number, lastReading?: any) {
    let moistureLevel: number;
    
    if (lastReading) {
      // Simulate gradual changes in moisture level
      const change = (Math.random() - 0.5) * 10; // -5 to +5 change
      moistureLevel = Math.max(0, Math.min(100, lastReading.moistureLevel + change));
    } else {
      // Initial reading
      moistureLevel = 20 + Math.random() * 60; // 20-80% range
    }
    
    // Simulate different moisture levels based on zone ID
    const baseLevel = this.getZoneBaseLevel(zoneId);
    moistureLevel = Math.max(0, Math.min(100, baseLevel + (Math.random() - 0.5) * 20));
    
    return {
      zoneId,
      moistureLevel: Math.round(moistureLevel * 100) / 100,
      temperature: 20 + Math.random() * 15, // 20-35°C
      humidity: 40 + Math.random() * 40, // 40-80%
    };
  }

  private getZoneBaseLevel(zoneId: number): number {
    // Simulate different base moisture levels for different zones
    const baseLevels = [45, 15, 68, 38, 52, 25, 70, 42];
    return baseLevels[zoneId % baseLevels.length] || 40;
  }

  private async updateWeatherData() {
    try {
      const weatherData = await weatherService.getCurrentWeather();
      await storage.createWeatherData({
        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
        description: weatherData.description,
        windSpeed: weatherData.windSpeed,
        precipitation: weatherData.precipitation
      });
      
      console.log("Weather data updated");
    } catch (error) {
      console.error("Failed to update weather data:", error);
    }
  }
}

export const sensorDataService = new SensorDataService();
