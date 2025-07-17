import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  Droplets,
  Thermometer,
  Cloud,
  Users,
  MessageCircle,
  X
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: "alert" | "info" | "success" | "warning";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  category: "system" | "irrigation" | "weather" | "user" | "chat";
}

export function NotificationDropdown() {
  const { user } = useAuth();
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());

  // Get real-time notifications from API
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    refetchInterval: 30000, // Check every 30 seconds
  });

  // Merge API notifications with local read state
  const processedNotifications = notifications.map(notification => ({
    ...notification,
    isRead: readNotifications.has(notification.id)
  }));

  const unreadCount = processedNotifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setReadNotifications(prev => new Set([...prev, id]));
  };

  const markAllAsRead = () => {
    const allIds = processedNotifications.map(n => n.id);
    setReadNotifications(new Set(allIds));
  };

  const removeNotification = (id: string) => {
    setReadNotifications(prev => new Set([...prev, id]));
  };

  const getNotificationIcon = (type: string, category: string) => {
    if (category === "irrigation") return <Droplets className="h-4 w-4" />;
    if (category === "weather") return <Cloud className="h-4 w-4" />;
    if (category === "user") return <Users className="h-4 w-4" />;
    if (category === "chat") return <MessageCircle className="h-4 w-4" />;
    
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "warning":
        return "border-l-orange-400 bg-orange-50";
      case "alert":
        return "border-l-red-400 bg-red-50";
      case "success":
        return "border-l-green-400 bg-green-50";
      default:
        return "border-l-blue-400 bg-blue-50";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 hover:bg-red-500">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2">
          <DropdownMenuLabel className="text-sm font-semibold">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs h-6 px-2"
            >
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        
        {processedNotifications.length > 0 ? (
          <ScrollArea className="h-80">
            <div className="space-y-1 p-1">
              {processedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative p-3 rounded-lg border-l-4 transition-colors cursor-pointer ${
                    getNotificationColor(notification.type)
                  } ${!notification.isRead ? 'bg-opacity-100' : 'bg-opacity-50'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2 flex-1">
                      {getNotificationIcon(notification.type, notification.category)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${
                            !notification.isRead ? 'text-gray-900' : 'text-gray-600'
                          }`}>
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(notification.timestamp)} ago
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Bell className="h-8 w-8 mb-2 text-gray-400" />
            <p className="text-sm">No notifications</p>
          </div>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}