import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { 
  MessageCircle, 
  Send, 
  User, 
  Bot, 
  Clock, 
  Users,
  MessageSquare,
  Headphones
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ChatMessage {
  id: number;
  userId: number;
  message: string;
  isFromAdmin: boolean;
  createdAt: string;
  username: string;
}

interface Conversation {
  userId: number;
  username: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export default function ChatManagementPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p>Access denied. Admin privileges required.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: conversations, isLoading: conversationsLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/chat/conversations"],
    refetchInterval: 10000, // Poll every 10 seconds
  });

  const { data: messages, isLoading: messagesLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/messages", selectedUserId],
    enabled: !!selectedUserId,
    refetchInterval: 5000, // Poll every 5 seconds when viewing conversation
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, userId }: { message: string; userId: number }) => {
      const response = await apiRequest("POST", "/api/chat/messages", {
        message,
        userId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages", selectedUserId] });
      queryClient.invalidateQueries({ queryKey: ["/api/chat/conversations"] });
      setMessage("");
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the user.",
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && selectedUserId) {
      sendMessageMutation.mutate({ 
        message: message.trim(), 
        userId: selectedUserId 
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const selectedConversation = conversations?.find(conv => conv.userId === selectedUserId);
  const totalUnreadMessages = conversations?.reduce((sum, conv) => sum + conv.unreadCount, 0) || 0;

  return (
    <div className="container mx-auto p-6 h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Chat Management</h1>
          <p className="text-gray-600 mt-2">Manage customer support conversations</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-blue-50">
            <Users className="h-4 w-4 mr-1" />
            {conversations?.length || 0} Conversations
          </Badge>
          {totalUnreadMessages > 0 && (
            <Badge variant="destructive">
              <MessageSquare className="h-4 w-4 mr-1" />
              {totalUnreadMessages} Unread
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-120px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {conversationsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : conversations && conversations.length > 0 ? (
                <div className="space-y-1 p-4">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.userId}
                      onClick={() => setSelectedUserId(conversation.userId)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedUserId === conversation.userId
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-medium">{conversation.username}</span>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-1">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(conversation.lastMessageTime))} ago
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500 p-4">
                  <MessageCircle className="h-8 w-8 mb-2 text-gray-400" />
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs text-gray-400">Users will appear here when they send messages</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              {selectedConversation ? (
                <>
                  <Headphones className="h-5 w-5 mr-2" />
                  Chat with {selectedConversation.username}
                </>
              ) : (
                <>
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Select a conversation
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-[500px]">
            {selectedUserId ? (
              <>
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : messages && messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.isFromAdmin ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] ${msg.isFromAdmin ? 'order-2' : 'order-1'}`}>
                            <div
                              className={`rounded-lg px-3 py-2 ${
                                msg.isFromAdmin
                                  ? 'bg-primary text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="text-sm">{msg.message}</p>
                            </div>
                            <div className={`flex items-center mt-1 text-xs text-gray-500 ${
                              msg.isFromAdmin ? 'justify-end' : 'justify-start'
                            }`}>
                              {msg.isFromAdmin ? (
                                <Bot className="h-3 w-3 mr-1" />
                              ) : (
                                <User className="h-3 w-3 mr-1" />
                              )}
                              <span>{msg.isFromAdmin ? 'You' : msg.username}</span>
                              <Clock className="h-3 w-3 ml-2 mr-1" />
                              <span>{formatDistanceToNow(new Date(msg.createdAt))} ago</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                      <MessageCircle className="h-8 w-8 mb-2 text-gray-400" />
                      <p className="text-sm">No messages in this conversation</p>
                    </div>
                  )}
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t p-4">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`Reply to ${selectedConversation?.username}...`}
                      disabled={sendMessageMutation.isPending}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={!message.trim() || sendMessageMutation.isPending}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {sendMessageMutation.isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">Select a conversation</p>
                  <p className="text-sm text-gray-400">Choose a user from the left to start chatting</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}