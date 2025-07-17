import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { 
  Leaf, 
  BarChart3, 
  Settings, 
  Users, 
  Bell, 
  ChevronDown, 
  LogOut,
  Cloud,
  Sun,
  Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function NavigationHeader() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  const { data: weather } = useQuery({
    queryKey: ["/api/weather"],
    refetchInterval: 600000, // 10 minutes
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isActive = (path: string) => {
    return location === path;
  };

  const NavigationItems = () => (
    <>
      <Link href="/">
        <Button 
          variant={isActive("/") ? "default" : "ghost"}
          className="justify-start"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Dashboard
        </Button>
      </Link>
      
      <Link href="/analytics">
        <Button 
          variant={isActive("/analytics") ? "default" : "ghost"}
          className="justify-start"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Analytics
        </Button>
      </Link>
      
      <Link href="/irrigation">
        <Button 
          variant={isActive("/irrigation") ? "default" : "ghost"}
          className="justify-start"
        >
          <Settings className="h-4 w-4 mr-2" />
          Irrigation Control
        </Button>
      </Link>
      
      {user?.role === "admin" && (
        <Link href="/users">
          <Button 
            variant={isActive("/users") ? "default" : "ghost"}
            className="justify-start"
          >
            <Users className="h-4 w-4 mr-2" />
            User Management
          </Button>
        </Link>
      )}
    </>
  );

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Leaf className="h-8 w-8 text-primary mr-3" />
              <span className="text-xl font-bold text-gray-900">AgriSmart</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-2">
              <NavigationItems />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Weather Widget */}
            <div className="hidden lg:flex items-center text-sm text-gray-600">
              <Sun className="h-4 w-4 text-orange-500 mr-2" />
              <span>{weather?.temperature || 24}°C</span>
              <span className="mx-2">|</span>
              <span>{weather?.humidity || 65}% RH</span>
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                  1
                </Badge>
              </Button>
            </div>
            
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="flex items-center mb-8">
                  <Leaf className="h-8 w-8 text-primary mr-3" />
                  <span className="text-xl font-bold text-gray-900">AgriSmart</span>
                </div>
                <nav className="flex flex-col space-y-2">
                  <NavigationItems />
                </nav>
              </SheetContent>
            </Sheet>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                    {user?.username?.slice(0, 2).toUpperCase() || "U"}
                  </div>
                  <span className="hidden md:block">{user?.username}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
