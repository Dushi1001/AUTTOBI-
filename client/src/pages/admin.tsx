import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Sidebar from "@/components/layout/SidebarComponent";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FaCheck, FaExclamationTriangle, FaHourglass, FaSearch } from "react-icons/fa";

interface UserData {
  id: string;
  username: string;
  email: string;
  ipAddress: string;
  lastLogin: string;
  kycStatus: 'verified' | 'pending' | 'rejected';
  walletAddress: string;
  totalBalance: number;
}

// Sample data for demonstration
const sampleUsers: UserData[] = [
  {
    id: "1",
    username: "johndoe",
    email: "john@example.com",
    ipAddress: "192.168.1.1",
    lastLogin: "2023-05-12 14:30",
    kycStatus: "verified",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    totalBalance: 2.45
  },
  {
    id: "2",
    username: "janedoe",
    email: "jane@example.com",
    ipAddress: "192.168.1.2",
    lastLogin: "2023-05-11 09:15",
    kycStatus: "pending",
    walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
    totalBalance: 0.87
  },
  {
    id: "3",
    username: "bobsmith",
    email: "bob@example.com",
    ipAddress: "192.168.1.3",
    lastLogin: "2023-05-10 18:45",
    kycStatus: "rejected",
    walletAddress: "0x7890abcdef1234567890abcdef1234567890abcd",
    totalBalance: 0
  }
];

export default function AdminPanel() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>(sampleUsers);
  
  useEffect(() => {
    document.title = "Admin Panel | AUTTOBI Crypto";
    
    // In real application, fetch users from API
    // For now, just filter the sample data based on search term
    if (searchTerm) {
      setFilteredUsers(
        sampleUsers.filter(user => 
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.ipAddress.includes(searchTerm) ||
          user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(sampleUsers);
    }
  }, [searchTerm]);

  const handleKycAction = (userId: string, action: 'approve' | 'reject') => {
    // In a real application, this would call the API to update KYC status
    toast({
      title: action === 'approve' ? "KYC Approved" : "KYC Rejected",
      description: `User ID: ${userId} has been ${action === 'approve' ? 'approved' : 'rejected'}.`,
    });
  };

  const handleIpLookup = (ipAddress: string) => {
    // In a real application, this would call an IP geolocation API
    toast({
      title: "IP Lookup",
      description: `Looking up details for IP: ${ipAddress}. This would show geolocation data.`,
    });
  };

  const getKycBadge = (status: 'verified' | 'pending' | 'rejected') => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500"><FaCheck className="mr-1 h-3 w-3" /> Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500"><FaHourglass className="mr-1 h-3 w-3" /> Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500"><FaExclamationTriangle className="mr-1 h-3 w-3" /> Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold font-display text-white">AUTTOBI Admin Panel</h1>
          <p className="text-muted-foreground mt-1">Manage users, monitor transactions, and verify KYC</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="users">Users & KYC</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage user accounts and KYC verification</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <FaSearch className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search users..." 
                      className="pl-9" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>List of AUTTOBI users and KYC status</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>KYC Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {user.ipAddress}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8" 
                              onClick={() => handleIpLookup(user.ipAddress)}
                            >
                              <FaSearch className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell>{getKycBadge(user.kycStatus)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant={user.kycStatus === 'verified' ? 'outline' : 'default'} 
                              className="h-8"
                              disabled={user.kycStatus === 'verified'}
                              onClick={() => handleKycAction(user.id, 'approve')}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant={user.kycStatus === 'rejected' ? 'outline' : 'destructive'} 
                              className="h-8"
                              disabled={user.kycStatus === 'rejected'}
                              onClick={() => handleKycAction(user.id, 'reject')}
                            >
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>KYC Statistics</CardTitle>
                  <CardDescription>KYC verification status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Verified Users</span>
                      <Badge className="bg-green-500">1</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pending Verification</span>
                      <Badge className="bg-yellow-500">1</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Rejected Applications</span>
                      <Badge className="bg-red-500">1</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>New users over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
                    Chart would be displayed here
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>IP Locations</CardTitle>
                  <CardDescription>Top user locations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>United States</span>
                      <span className="text-sm">45%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>United Kingdom</span>
                      <span className="text-sm">21%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Germany</span>
                      <span className="text-sm">15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Other</span>
                      <span className="text-sm">19%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Monitoring</CardTitle>
                <CardDescription>Monitor and verify cryptocurrency transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-muted p-4 text-center">
                  <h3 className="text-lg font-medium">Transaction monitoring module</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    This module would display a table of transactions with filtering options.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
                <CardDescription>Configure admin panel and API integration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">API Integration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="kycApi">KYC API Endpoint</Label>
                        <Input id="kycApi" defaultValue="https://api.kycprovider.com/verify" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ipLookupApi">IP Geolocation API</Label>
                        <Input id="ipLookupApi" defaultValue="https://api.iplookup.com" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Notification Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emailNotifications">Email for Notifications</Label>
                        <Input id="emailNotifications" defaultValue="admin@auttobi.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slackWebhook">Slack Webhook URL</Label>
                        <Input id="slackWebhook" defaultValue="https://hooks.slack.com/services/..." />
                      </div>
                    </div>
                  </div>
                  
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}