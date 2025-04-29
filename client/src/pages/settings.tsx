import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RootState } from "@/store/store";
import Sidebar from "@/components/layout/SidebarComponent";
import { updateUsername } from "@/store/slices/userSlice";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const user = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email || '',
    displayName: user.displayName || '',
  });
  
  useEffect(() => {
    document.title = "Settings | Gaming App";
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateUsername(formData.username));
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleConfigUpdate = () => {
    toast({
      title: "Configuration Updated",
      description: "Build configuration has been updated successfully.",
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold font-display text-white">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and application settings</p>
        </header>

        <Tabs defaultValue="profile">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Username" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input 
                        id="displayName" 
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        placeholder="Display Name" 
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="mt-6">
                    Update Profile
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="config">
            <Card>
              <CardHeader>
                <CardTitle>Build Configuration</CardTitle>
                <CardDescription>Manage your project settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Build Tool</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="relative flex items-center space-x-3 rounded-lg border border-muted p-4 shadow-sm transition-all hover:border-primary">
                      <input
                        type="radio"
                        name="buildTool"
                        value="vite"
                        id="vite"
                        className="peer sr-only"
                        defaultChecked
                      />
                      <Label htmlFor="vite" className="cursor-pointer w-full">
                        <div>
                          <h4 className="font-medium">Vite</h4>
                          <p className="text-sm text-muted-foreground">
                            Modern, fast build tool with hot module replacement
                          </p>
                        </div>
                      </Label>
                      <div className="absolute right-4 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-muted peer-checked:border-primary peer-checked:bg-primary text-primary peer-checked:text-primary-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="relative flex items-center space-x-3 rounded-lg border border-muted p-4 shadow-sm transition-all hover:border-primary">
                      <input
                        type="radio"
                        name="buildTool"
                        value="reactScripts"
                        id="reactScripts"
                        className="peer sr-only"
                      />
                      <Label htmlFor="reactScripts" className="cursor-pointer w-full">
                        <div>
                          <h4 className="font-medium">React Scripts</h4>
                          <p className="text-sm text-muted-foreground">
                            Standard Create React App build tool
                          </p>
                        </div>
                      </Label>
                      <div className="absolute right-4 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-muted peer-checked:border-primary peer-checked:bg-primary text-primary peer-checked:text-primary-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Configuration Files</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-muted">
                      <div>
                        <h4 className="font-medium">vite.config.ts</h4>
                        <p className="text-sm text-muted-foreground">Vite configuration file</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg border border-muted">
                      <div>
                        <h4 className="font-medium">netlify.toml</h4>
                        <p className="text-sm text-muted-foreground">Netlify deployment configuration</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg border border-muted">
                      <div>
                        <h4 className="font-medium">jest.config.js</h4>
                        <p className="text-sm text-muted-foreground">Jest test configuration</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg border border-muted">
                      <div>
                        <h4 className="font-medium">tsconfig.json</h4>
                        <p className="text-sm text-muted-foreground">TypeScript configuration</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Build Options</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Generate Sourcemaps</Label>
                        <p className="text-sm text-muted-foreground">Include source maps in build output</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Minify Output</Label>
                        <p className="text-sm text-muted-foreground">Minify JavaScript and CSS in production build</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Generate Bundle Analysis</Label>
                        <p className="text-sm text-muted-foreground">Analyze bundle size during build</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleConfigUpdate}>Save Configuration</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the application appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Theme</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="relative flex items-center space-x-3 rounded-lg border border-muted p-4 shadow-sm transition-all hover:border-primary">
                      <input
                        type="radio"
                        name="theme"
                        value="dark"
                        id="dark"
                        className="peer sr-only"
                        defaultChecked
                      />
                      <Label htmlFor="dark" className="cursor-pointer w-full">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-background"></div>
                          <div>
                            <h4 className="font-medium">Dark</h4>
                            <p className="text-sm text-muted-foreground">
                              Dark theme
                            </p>
                          </div>
                        </div>
                      </Label>
                      <div className="absolute right-4 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-muted peer-checked:border-primary peer-checked:bg-primary text-primary peer-checked:text-primary-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="relative flex items-center space-x-3 rounded-lg border border-muted p-4 shadow-sm transition-all hover:border-primary">
                      <input
                        type="radio"
                        name="theme"
                        value="light"
                        id="light"
                        className="peer sr-only"
                      />
                      <Label htmlFor="light" className="cursor-pointer w-full">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-white border border-gray-200"></div>
                          <div>
                            <h4 className="font-medium">Light</h4>
                            <p className="text-sm text-muted-foreground">
                              Light theme
                            </p>
                          </div>
                        </div>
                      </Label>
                      <div className="absolute right-4 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-muted peer-checked:border-primary peer-checked:bg-primary text-primary peer-checked:text-primary-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="relative flex items-center space-x-3 rounded-lg border border-muted p-4 shadow-sm transition-all hover:border-primary">
                      <input
                        type="radio"
                        name="theme"
                        value="system"
                        id="system"
                        className="peer sr-only"
                      />
                      <Label htmlFor="system" className="cursor-pointer w-full">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-background to-white"></div>
                          <div>
                            <h4 className="font-medium">System</h4>
                            <p className="text-sm text-muted-foreground">
                              Follow system
                            </p>
                          </div>
                        </div>
                      </Label>
                      <div className="absolute right-4 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-muted peer-checked:border-primary peer-checked:bg-primary text-primary peer-checked:text-primary-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sidebar Collapsed</Label>
                      <p className="text-sm text-muted-foreground">Show only icons in sidebar</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Animations</Label>
                      <p className="text-sm text-muted-foreground">Enable UI animations</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Reduced Motion</Label>
                      <p className="text-sm text-muted-foreground">Minimize animations for accessibility</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Appearance</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Change Password</h3>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    
                    <Button type="submit">Update Password</Button>
                  </form>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Session Management</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-muted">
                      <div>
                        <h4 className="font-medium">Current Session</h4>
                        <p className="text-sm text-muted-foreground">Chrome on Windows • Active now</p>
                      </div>
                      <Button variant="outline" size="sm" disabled>Current</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg border border-muted">
                      <div>
                        <h4 className="font-medium">Mobile App</h4>
                        <p className="text-sm text-muted-foreground">iOS • Last active 3 hours ago</p>
                      </div>
                      <Button variant="outline" size="sm">Logout</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <div className="space-y-2 w-full">
                  <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground">
                    Once you delete your account, there is no going back. This action cannot be undone.
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
