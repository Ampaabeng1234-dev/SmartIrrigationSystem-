import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import AnalyticsPage from "@/pages/analytics-page";
import IrrigationControlPage from "@/pages/irrigation-control-page";
import UserManagementPage from "@/pages/user-management-page";
import ChatManagementPage from "@/pages/chat-management-page";
import ProfilePage from "@/pages/profile-page";
import NotFound from "@/pages/not-found";
import { ChatWidget } from "@/components/dashboard/chat-widget";

function Router() {
  return (
    <>
      <Switch>
        <ProtectedRoute path="/" component={HomePage} />
        <ProtectedRoute path="/analytics" component={AnalyticsPage} />
        <ProtectedRoute path="/irrigation" component={IrrigationControlPage} />
        <ProtectedRoute path="/users" component={UserManagementPage} />
        <ProtectedRoute path="/chat" component={ChatManagementPage} />
        <ProtectedRoute path="/profile" component={ProfilePage} />
        <Route path="/auth" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
      <ChatWidget />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
