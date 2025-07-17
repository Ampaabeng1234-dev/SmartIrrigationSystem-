# Arduino Integration Guide

This guide explains how to connect Arduino sensors to the Smart Irrigation Management System for real-time data collection.

## Overview

The application can receive sensor data from Arduino boards through multiple methods:
1. **HTTP API Endpoints** - Arduino sends data via WiFi/Ethernet
2. **Serial Communication** - Direct USB connection to server
3. **MQTT Protocol** - IoT messaging for multiple sensors
4. **WebSocket Connection** - Real-time bidirectional communication

## Method 1: HTTP API Integration (Recommended)

### Arduino Code (ESP32/ESP8266 with WiFi)

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "your_wifi_ssid";
const char* password = "your_wifi_password";

// Server configuration
const char* serverURL = "http://your-server.com/api/sensor-data";
const char* apiKey = "your_api_key"; // Optional authentication

// Sensor pins
const int moisturePin = A0;
const int temperaturePin = A1;
const int humidityPin = A2;

// Zone configuration
const int zoneId = 1; // Configure for each Arduino

void setup() {
  Serial.begin(115200);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("WiFi connected!");
}

void loop() {
  // Read sensor values
  int moistureRaw = analogRead(moisturePin);
  int temperatureRaw = analogRead(temperaturePin);
  int humidityRaw = analogRead(humidityPin);
  
  // Convert to meaningful values
  float moistureLevel = map(moistureRaw, 0, 1023, 0, 100);
  float temperature = (temperatureRaw * 5.0 / 1023.0 - 0.5) * 100; // TMP36 sensor
  float humidity = map(humidityRaw, 0, 1023, 0, 100);
  
  // Send data to server
  sendSensorData(zoneId, moistureLevel, temperature, humidity);
  
  // Wait 30 seconds before next reading
  delay(30000);
}

void sendSensorData(int zoneId, float moisture, float temp, float humidity) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverURL);
    http.addHeader("Content-Type", "application/json");
    
    // Optional: Add API key authentication
    if (strlen(apiKey) > 0) {
      http.addHeader("Authorization", "Bearer " + String(apiKey));
    }
    
    // Create JSON payload
    StaticJsonDocument<200> doc;
    doc["zoneId"] = zoneId;
    doc["moistureLevel"] = moisture;
    doc["temperature"] = temp;
    doc["humidity"] = humidity;
    doc["timestamp"] = WiFi.getTime();
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    // Send POST request
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Data sent successfully: " + response);
    } else {
      Serial.println("Error sending data: " + String(httpResponseCode));
    }
    
    http.end();
  } else {
    Serial.println("WiFi disconnected");
  }
}
```

### Server-Side Integration

Add this endpoint to your `server/routes.ts` file:

```typescript
// Arduino sensor data endpoint
app.post("/api/sensor-data", async (req, res) => {
  try {
    // Optional: API key authentication
    const apiKey = req.headers.authorization?.replace('Bearer ', '');
    if (process.env.ARDUINO_API_KEY && apiKey !== process.env.ARDUINO_API_KEY) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    const { zoneId, moistureLevel, temperature, humidity, timestamp } = req.body;
    
    // Validate required fields
    if (!zoneId || moistureLevel === undefined || temperature === undefined || humidity === undefined) {
      return res.status(400).json({ error: "Missing required sensor data" });
    }

    // Store sensor reading
    const reading = await storage.createSensorReading({
      zoneId: parseInt(zoneId),
      moistureLevel: parseFloat(moistureLevel),
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      timestamp: timestamp ? new Date(timestamp) : new Date()
    });

    console.log(`Received sensor data from Arduino - Zone ${zoneId}: ${moistureLevel}% moisture, ${temperature}°C, ${humidity}% humidity`);
    
    res.status(201).json({ 
      message: "Sensor data received successfully", 
      readingId: reading.id 
    });
  } catch (error) {
    console.error("Error processing Arduino sensor data:", error);
    res.status(500).json({ error: "Failed to process sensor data" });
  }
});
```

## Method 2: Serial Communication

### Arduino Code (USB Connection)

```cpp
// Simple serial communication
void setup() {
  Serial.begin(9600);
}

void loop() {
  int moisture = analogRead(A0);
  int temperature = analogRead(A1);
  int humidity = analogRead(A2);
  
  // Send data in CSV format
  Serial.print("1,"); // Zone ID
  Serial.print(map(moisture, 0, 1023, 0, 100));
  Serial.print(",");
  Serial.print((temperature * 5.0 / 1023.0 - 0.5) * 100);
  Serial.print(",");
  Serial.println(map(humidity, 0, 1023, 0, 100));
  
  delay(30000);
}
```

### Server-Side Serial Reader

```typescript
// Add to server/index.ts
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

// Configure serial port
const port = new SerialPort({
  path: '/dev/ttyUSB0', // Adjust for your system
  baudRate: 9600
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

parser.on('data', async (data: string) => {
  try {
    const [zoneId, moisture, temperature, humidity] = data.trim().split(',');
    
    await storage.createSensorReading({
      zoneId: parseInt(zoneId),
      moistureLevel: parseFloat(moisture),
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      timestamp: new Date()
    });
    
    console.log(`Serial data received - Zone ${zoneId}: ${moisture}% moisture`);
  } catch (error) {
    console.error('Error parsing serial data:', error);
  }
});
```

## Method 3: MQTT Integration

### Arduino Code (MQTT)

```cpp
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* mqtt_server = "your-mqtt-broker.com";
const char* mqtt_topic = "irrigation/sensors";

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  // WiFi setup (same as HTTP method)
  client.setServer(mqtt_server, 1883);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  // Read and publish sensor data
  publishSensorData();
  delay(30000);
}

void publishSensorData() {
  StaticJsonDocument<200> doc;
  doc["zoneId"] = 1;
  doc["moistureLevel"] = map(analogRead(A0), 0, 1023, 0, 100);
  doc["temperature"] = (analogRead(A1) * 5.0 / 1023.0 - 0.5) * 100;
  doc["humidity"] = map(analogRead(A2), 0, 1023, 0, 100);
  doc["timestamp"] = millis();
  
  char buffer[256];
  serializeJson(doc, buffer);
  
  client.publish(mqtt_topic, buffer);
}
```

## Environment Configuration

Add these environment variables to your `.env` file:

```env
# Arduino Integration
ARDUINO_API_KEY=your-secure-api-key
ARDUINO_SERIAL_PORT=/dev/ttyUSB0
ARDUINO_MQTT_BROKER=mqtt://your-broker.com
ENABLE_REAL_SENSORS=true
```

## Sensor Calibration

### Moisture Sensor Calibration

```cpp
// Calibrate moisture sensor
const int dry_value = 595;   // Sensor value in dry soil
const int wet_value = 239;   // Sensor value in wet soil

int getMoisturePercentage(int sensorValue) {
  int moisture = map(sensorValue, wet_value, dry_value, 100, 0);
  return constrain(moisture, 0, 100);
}
```

### Temperature Sensor (DS18B20)

```cpp
#include <OneWire.h>
#include <DallasTemperature.h>

OneWire oneWire(2);
DallasTemperature sensors(&oneWire);

float getTemperature() {
  sensors.requestTemperatures();
  return sensors.getTempCByIndex(0);
}
```

## Hardware Setup

### Required Components
- **ESP32/ESP8266** (WiFi enabled) or **Arduino Uno + Ethernet Shield**
- **Soil Moisture Sensor** (Capacitive or Resistive)
- **Temperature Sensor** (DS18B20 or TMP36)
- **Humidity Sensor** (DHT22 or similar)
- **Breadboard and Jumper Wires**
- **Power Supply** (for outdoor installation)

### Wiring Diagram

```
ESP32/Arduino Uno:
├── A0 → Soil Moisture Sensor (Analog Out)
├── A1 → Temperature Sensor (Analog Out)
├── A2 → Humidity Sensor (Analog Out)
├── D2 → DS18B20 (Digital, if using)
├── 3.3V → Sensor VCC
└── GND → Sensor GND
```

## Switching from Simulation to Real Data

Update the `sensorDataService.ts` to use real data:

```typescript
// In server/services/sensorData.ts
export class SensorDataService {
  private useRealSensors: boolean;

  constructor() {
    this.useRealSensors = process.env.ENABLE_REAL_SENSORS === 'true';
  }

  startDataCollection() {
    if (this.useRealSensors) {
      console.log('Using real Arduino sensor data');
      // Real sensors will send data via API
    } else {
      console.log('Starting sensor data simulation');
      this.startSimulation();
    }
  }
}
```

## Testing Arduino Connection

1. **Upload Arduino code** with your WiFi credentials
2. **Monitor Serial output** to verify sensor readings
3. **Check server logs** for incoming data
4. **Verify database** entries in sensor_readings table
5. **View dashboard** to see real-time updates

## Troubleshooting

### Common Issues
- **WiFi connection fails**: Check credentials and signal strength
- **HTTP requests fail**: Verify server URL and firewall settings
- **Sensor readings incorrect**: Calibrate sensors and check wiring
- **Data not appearing**: Check API endpoint and authentication

### Debug Commands
```bash
# Check server logs
npm run dev

# Monitor database
npm run db:studio

# Test API endpoint
curl -X POST http://localhost:5000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"zoneId":1,"moistureLevel":45,"temperature":22,"humidity":60}'
```

## Security Considerations

1. **Use HTTPS** in production
2. **Implement API key authentication**
3. **Rate limiting** for Arduino endpoints
4. **Input validation** for all sensor data
5. **Secure WiFi** network for Arduino boards

This integration allows your Smart Irrigation System to work with real Arduino sensor hardware while maintaining the same dashboard and analytics features.