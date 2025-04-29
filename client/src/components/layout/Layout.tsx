import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [location] = useLocation();
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(false);

  // Public routes don't need authentication
  const isPublicRoute = ["/", "/login", "/signup"].includes(location);

  useEffect(() => {
    // Hide sidebar on mobile by default
    setShowSidebar(!isMobile);
    
    // Default to collapsed sidebar on tablet-sized screens
    setSidebarCollapsed(window.innerWidth < 1024 && window.innerWidth >= 768);
  }, [isMobile]);

  // Handle sidebar visibility and collapse for mobile/desktop
  const toggleSidebar = () => {
    if (isMobile) {
      setShowSidebar(!showSidebar);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If not a public route and user is not authenticated, don't render children
  if (!isPublicRoute && !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Authentication Required</h1>
          <p className="mt-2 text-muted-foreground">Please log in to access this page</p>
          <Button className="mt-4 game-button" asChild>
            <a href="/login">Login</a>
          </Button>
        </div>
      </div>
    );
  }

  // For landing page and auth pages, only show navbar
  if (isPublicRoute) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  // For authenticated pages, show sidebar and navbar
  return (
    <div className="flex min-h-screen">
      {showSidebar && (
        <Sidebar
          collapsed={sidebarCollapsed}
          className={cn(
            "fixed inset-y-0 z-50 transition-all duration-300",
            sidebarCollapsed ? "w-[70px]" : "w-[240px]",
            isMobile && "shadow-lg"
          )}
        />
      )}
      
      <div className={cn(
        "flex flex-col flex-1 transition-all duration-300",
        showSidebar && (sidebarCollapsed ? "md:ml-[70px]" : "md:ml-[240px]")
      )}>
        <Navbar />
        <div className="container mx-auto p-4 md:p-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mb-4 md:mb-6"
          >
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
