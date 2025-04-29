import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Gamepad2, LayoutDashboard, TrendingUp, Trophy, Settings, CircleDollarSign, Users } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
}

export default function Sidebar({ collapsed = false, className }: SidebarProps) {
  const [location] = useLocation();
  
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Games",
      href: "/games",
      icon: <Gamepad2 className="h-5 w-5" />,
    },
    {
      title: "Portfolio",
      href: "/portfolio",
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      title: "Tournaments",
      href: "/tournaments",
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      title: "Marketplace",
      href: "/marketplace",
      icon: <CircleDollarSign className="h-5 w-5" />,
    },
    {
      title: "Community",
      href: "/community",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className={cn("h-screen border-r border-sidebar-border bg-sidebar", className)}>
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <Link href="/" className="flex items-center gap-2">
          <Gamepad2 className="h-6 w-6 text-sidebar-primary" />
          {!collapsed && <span className="font-bold text-lg text-sidebar-foreground">GamingApp</span>}
        </Link>
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="px-3 py-4">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                className={cn(
                  "justify-start text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-accent",
                  location === item.href && "bg-sidebar-accent/10 text-sidebar-accent font-medium",
                  collapsed && "justify-center"
                )}
              >
                <Link href={item.href} className="flex items-center gap-3">
                  {item.icon}
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      </ScrollArea>
    </div>
  );
}
