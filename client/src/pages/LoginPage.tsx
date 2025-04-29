import LoginForm from "@/features/auth/LoginForm";
import { Gamepad2 } from "lucide-react";
import { Link } from "wouter";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <div className="container flex flex-col items-center justify-center flex-1 px-6 py-12">
        <div className="flex items-center mb-8">
          <Link href="/" className="flex items-center">
            <Gamepad2 className="h-8 w-8 mr-2 text-primary" />
            <span className="text-2xl font-bold">GamingApp</span>
          </Link>
        </div>
        
        <LoginForm />
        
        <p className="mt-8 text-center text-sm text-muted-foreground">
          By continuing, you agree to our 
          <a href="#" className="text-primary hover:underline ml-1">Terms of Service</a> 
          <span className="mx-1">and</span>
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
