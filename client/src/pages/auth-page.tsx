import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Leaf, Droplets, BarChart3, Shield, CheckCircle, AlertCircle, Home } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({ 
    username: "", 
    email: "", 
    password: "", 
    role: "user" 
  });
  const [forgotPasswordData, setForgotPasswordData] = useState({ email: "" });
  const [resetPasswordData, setResetPasswordData] = useState({ token: "", newPassword: "", confirmPassword: "" });
  const [showResetForm, setShowResetForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Redirect if already logged in using useEffect to avoid hooks violation
  useEffect(() => {
    if (user) {
      setIsRedirecting(true);
      setLocation("/");
    }
  }, [user, setLocation]);

  // Create mutations for forgot password functionality
  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await apiRequest("POST", "/api/forgot-password", data);
      return response.json();
    },
    onSuccess: () => {
      setSuccessMessage("Password reset instructions have been sent to your email.");
      setErrorMessage("");
    },
    onError: (error: any) => {
      setErrorMessage(error?.message || "Failed to send reset email. Please try again.");
      setSuccessMessage("");
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { token: string; newPassword: string }) => {
      const response = await apiRequest("POST", "/api/reset-password", data);
      return response.json();
    },
    onSuccess: () => {
      setSuccessMessage("Password has been reset successfully. You can now log in with your new password.");
      setErrorMessage("");
      setShowResetForm(false);
      setResetPasswordData({ token: "", newPassword: "", confirmPassword: "" });
    },
    onError: (error: any) => {
      setErrorMessage(error?.message || "Failed to reset password. Please try again.");
      setSuccessMessage("");
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      await loginMutation.mutateAsync(loginData);
      setLocation("/");
    } catch (error: any) {
      console.error("Login failed:", error);
      setErrorMessage(error?.message || "Login failed. Please check your credentials.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      await registerMutation.mutateAsync(registerData);
      setLocation("/");
    } catch (error: any) {
      console.error("Registration failed:", error);
      setErrorMessage(error?.message || "Registration failed. Please try again.");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    forgotPasswordMutation.mutate(forgotPasswordData.email);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    
    if (!resetPasswordData.token.trim()) {
      setErrorMessage("Reset token is required");
      return;
    }

    if (!resetPasswordData.newPassword.trim()) {
      setErrorMessage("New password is required");
      return;
    }

    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (resetPasswordData.newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return;
    }

    resetPasswordMutation.mutate({
      token: resetPasswordData.token,
      newPassword: resetPasswordData.newPassword
    });
  };

  // Show redirect message if user is already logged in
  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Authentication Forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Back to Home Button */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
                <Home className="h-4 w-4" />
                <span>Back to App</span>
              </Button>
            </Link>
          </div>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Leaf className="h-10 w-10 text-primary mr-2" />
              <h1 className="text-3xl font-bold text-gray-900">AgriSmart</h1>
            </div>
            <p className="text-gray-600">Smart Irrigation Management System</p>
          </div>

          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
              <TabsTrigger value="forgot">Reset</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to your AgriSmart account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        value={loginData.username}
                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    Join AgriSmart to start managing your irrigation system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-username">Username</Label>
                      <Input
                        id="reg-username"
                        type="text"
                        value={registerData.username}
                        onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input
                        id="reg-email"
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forgot">
              <Card>
                <CardHeader>
                  <CardTitle>Reset Password</CardTitle>
                  <CardDescription>
                    {showResetForm ? 
                      "Enter your new password below" : 
                      "Enter your email to receive reset instructions"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {successMessage && (
                    <Alert className="mb-4">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                  )}
                  
                  {errorMessage && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  )}

                  {!showResetForm ? (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="forgot-email">Email Address</Label>
                        <Input
                          id="forgot-email"
                          type="email"
                          value={forgotPasswordData.email}
                          onChange={(e) => setForgotPasswordData({ email: e.target.value })}
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={forgotPasswordMutation.isPending}
                      >
                        {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Instructions"}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reset-token">Reset Token</Label>
                        <Input
                          id="reset-token"
                          type="text"
                          value={resetPasswordData.token}
                          onChange={(e) => setResetPasswordData({ ...resetPasswordData, token: e.target.value })}
                          placeholder="Enter reset token from email"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={resetPasswordData.newPassword}
                          onChange={(e) => setResetPasswordData({ ...resetPasswordData, newPassword: e.target.value })}
                          placeholder="Enter new password"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={resetPasswordData.confirmPassword}
                          onChange={(e) => setResetPasswordData({ ...resetPasswordData, confirmPassword: e.target.value })}
                          placeholder="Confirm new password"
                          required
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => {
                            setShowResetForm(false);
                            setResetPasswordData({ token: "", newPassword: "", confirmPassword: "" });
                            setSuccessMessage("");
                            setErrorMessage("");
                          }}
                        >
                          Back
                        </Button>
                        <Button 
                          type="submit" 
                          className="flex-1"
                          disabled={resetPasswordMutation.isPending}
                        >
                          {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Hero Section */}
      <div className="flex-1 bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          <h2 className="text-4xl font-bold mb-6">Smart Irrigation Made Simple</h2>
          <p className="text-xl mb-8 text-green-100">
            Monitor soil moisture, control irrigation, and optimize water usage with our intelligent system
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <Droplets className="h-12 w-12 mx-auto mb-2 text-blue-200" />
              <h3 className="font-semibold mb-1">Water Management</h3>
              <p className="text-sm text-green-100">Optimize water usage with smart sensors</p>
            </div>
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 text-blue-200" />
              <h3 className="font-semibold mb-1">Real-time Analytics</h3>
              <p className="text-sm text-green-100">Track moisture levels and trends</p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-2 text-blue-200" />
              <h3 className="font-semibold mb-1">Secure Access</h3>
              <p className="text-sm text-green-100">Role-based user management</p>
            </div>
            <div className="text-center">
              <Leaf className="h-12 w-12 mx-auto mb-2 text-blue-200" />
              <h3 className="font-semibold mb-1">Crop Optimization</h3>
              <p className="text-sm text-green-100">Tailored irrigation for different crops</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
