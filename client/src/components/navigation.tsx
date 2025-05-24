import { AuthService } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LineChart, LogOut } from "lucide-react";

interface NavigationProps {
  currentUser: any;
  onAuthClick: () => void;
  onLogout: () => void;
}

export function Navigation({ currentUser, onAuthClick, onLogout }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary flex items-center">
                <LineChart className="mr-2 h-6 w-6" />
                MutualTracker
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">{currentUser.fullName}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onLogout}
                  className="text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={onAuthClick} className="bg-primary hover:bg-blue-700">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
