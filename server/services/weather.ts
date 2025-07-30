interface WeatherApiResponse {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
  }>;
  wind: {
    speed: number;
  };
  rain?: {
    "1h": number;
  };
}

interface ForecastApiResponse {
  list: Array<{
    main: {
      temp: number;
      humidity: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
    pop: number;
    dt_txt: string;
  }>;
}

class WeatherService {
  private apiKey: string;
  private baseUrl = "https://api.openweathermap.org/data/2.5";
  private location: string;

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || process.env.WEATHER_API_KEY || "d46eff8e34392d8f5b3cf8e666469d11";
    this.location = "Ghana";
    if (!this.apiKey) {
      console.warn("Weather API key not found. Weather features will be limited.");
    }
  }

  async getCurrentWeather() {
    if (!this.apiKey) {
      return this.getFallbackWeather();
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/weather?q=${this.location}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data: WeatherApiResponse = await response.json();
      
      return {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        windSpeed: data.wind.speed,
        precipitation: data.rain?.["1h"] || 0,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      return this.getFallbackWeather();
    }
  }

  async getForecast() {
    if (!this.apiKey) {
      return this.getFallbackForecast();
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/forecast?q=${this.location}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data: ForecastApiResponse = await response.json();
      
      // Get daily forecasts (every 8th item for daily data)
      const dailyForecasts = data.list.filter((_, index) => index % 8 === 0).slice(0, 5);
      
      return dailyForecasts.map(item => ({
        date: item.dt_txt,
        temperature: Math.round(item.main.temp),
        humidity: item.main.humidity,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        precipitationProbability: Math.round(item.pop * 100)
      }));
    } catch (error) {
      console.error("Failed to fetch weather forecast:", error);
      return this.getFallbackForecast();
    }
  }

  private getFallbackWeather() {
    return {
      temperature: 24,
      humidity: 65,
      description: "Partly cloudy",
      windSpeed: 3.5,
      precipitation: 0,
      timestamp: new Date().toISOString()
    };
  }

  private getFallbackForecast() {
    const today = new Date();
    const forecasts = [];
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      forecasts.push({
        date: date.toISOString(),
        temperature: 24 + Math.random() * 10 - 5,
        humidity: 60 + Math.random() * 20,
        description: i === 1 ? "Rain" : i === 2 ? "Cloudy" : "Sunny",
        icon: i === 1 ? "10d" : i === 2 ? "04d" : "01d",
        precipitationProbability: i === 1 ? 80 : i === 2 ? 30 : 10
      });
    }
    
    return forecasts;
  }
}

export const weatherService = new WeatherService();
