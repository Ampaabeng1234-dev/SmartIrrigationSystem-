import { NavigationHeader } from "@/components/dashboard/navigation-header";
import { IrrigationZones } from "@/components/dashboard/irrigation-zones";
import { SystemControl } from "@/components/dashboard/system-control";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function IrrigationControlPage() {
  const [scheduleForm, setScheduleForm] = useState({
    zone: "",
    time: "",
    duration: "",
    repeat: "daily"
  });

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle schedule creation
    console.log("Schedule created:", scheduleForm);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Irrigation Control</h1>
          <p className="text-gray-600">Manage irrigation zones and scheduling</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <IrrigationZones />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Schedule Irrigation</CardTitle>
              <CardDescription>Create automated irrigation schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="zone">Select Zone</Label>
                  <Select value={scheduleForm.zone} onValueChange={(value) => setScheduleForm({ ...scheduleForm, zone: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zone1">Field A - Zone 1</SelectItem>
                      <SelectItem value="zone2">Field A - Zone 2</SelectItem>
                      <SelectItem value="zone3">Field B - Zone 1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Irrigation Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={scheduleForm.duration}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, duration: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="repeat">Repeat</Label>
                  <Select value={scheduleForm.repeat} onValueChange={(value) => setScheduleForm({ ...scheduleForm, repeat: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" className="w-full">Create Schedule</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <SystemControl />
      </div>
    </div>
  );
}
