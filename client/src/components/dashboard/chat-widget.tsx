import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2,
  User,
  Bot,
  HelpCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ChatMessage {
  id: number;
  userId: number;
  message: string;
  isFromAdmin: boolean;
  createdAt: string;
}

export function ChatWidget() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/messages"],
    enabled: isOpen && user,
    refetchInterval: isOpen ? 5000 : false, // Poll every 5 seconds when open
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat/messages", {
        message,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
      setMessage("");
      toast({
        title: "Message Sent",
        description: "Your message has been sent to support.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const unreadMessages = messages?.filter(msg => msg.isFromAdmin && 
    // Consider messages from the last 24 hours as potentially unread
    new Date(msg.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length || 0;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessageMutation.mutate(message.trim());
    }
  };

  // Don't show chat widget on auth page or for admin users on chat management page
  if (!user || location === "/auth" || (user.role === "admin" && location === "/chat")) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-80 h-96 shadow-xl border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary text-white rounded-t-lg">
            <CardTitle className="text-sm font-medium flex items-center">
              <HelpCircle className="h-4 w-4 mr-2" />
              Customer Support
            </CardTitle>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          
          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-80">
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : messages && messages.length > 0 ? (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isFromAdmin ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`max-w-[80%] ${msg.isFromAdmin ? 'order-1' : 'order-2'}`}>
                          <div
                            className={`rounded-lg px-3 py-2 text-sm ${
                              msg.isFromAdmin
                                ? 'bg-gray-100 text-gray-900 border'
                                : 'bg-primary text-white'
                            }`}
                          >
                            <p>{msg.message}</p>
                          </div>
                          <div className={`flex items-center mt-1 text-xs text-gray-500 ${
                            msg.isFromAdmin ? 'justify-start' : 'justify-end'
                          }`}>
                            {msg.isFromAdmin ? (
                              <>
                                <Bot className="h-3 w-3 mr-1" />
                                <span>Support</span>
                              </>
                            ) : (
                              <>
                                <User className="h-3 w-3 mr-1" />
                                <span>You</span>
                              </>
                            )}
                            <span className="ml-2">{formatDistanceToNow(new Date(msg.createdAt))} ago</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                    <MessageCircle className="h-8 w-8 mb-2 text-gray-400" />
                    <p className="text-sm text-center">
                      Welcome! Send us a message and we'll get back to you shortly.
                    </p>
                  </div>
                )}
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t p-3">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={sendMessageMutation.isPending}
                    className="flex-1 text-sm"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!message.trim() || sendMessageMutation.isPending}
                    className="bg-primary hover:bg-primary/90 h-8 w-8"
                  >
                    {sendMessageMutation.isPending ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    ) : (
                      <Send className="h-3 w-3" />
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          )}
        </Card>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg relative"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadMessages > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
              {unreadMessages}
            </Badge>
          )}
        </Button>
      )}
    </div>
  );
}