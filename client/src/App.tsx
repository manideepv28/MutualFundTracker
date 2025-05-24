import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthService } from "@/lib/auth";
import type { User } from "@shared/schema";

import { Navigation } from "@/components/navigation";
import { Sidebar } from "@/components/sidebar";
import { AuthModal } from "@/components/auth-modal";
import { Dashboard } from "@/pages/dashboard";
import { Portfolio } from "@/pages/portfolio";
import { Transactions } from "@/pages/transactions";
import { Analytics } from "@/pages/analytics";
import NotFound from "@/pages/not-found";

import { LineChart, Briefcase, DollarSign } from "lucide-react";

function WelcomeSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="max-w-4xl mx-auto py-16">
      <div className="text-center">
        <div className="mb-8">
          <LineChart className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to MutualTracker</h1>
          <p className="text-xl text-gray-600 mb-8">Your personal mutual fund portfolio management solution</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <DollarSign className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Track Portfolio</h3>
            <p className="text-gray-600">Monitor your mutual fund investments and track performance in real-time</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <LineChart className="h-8 w-8 text-success mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Visual Analytics</h3>
            <p className="text-gray-600">Get insights with interactive charts and performance analytics</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <Briefcase className="h-8 w-8 text-warning mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Transaction History</h3>
            <p className="text-gray-600">Keep detailed records of all your investment transactions</p>
          </div>
        </div>
        
        <button 
          onClick={onGetStarted}
          className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition duration-200"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

function Router() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentSection('dashboard');
  };

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setCurrentSection('dashboard');
  };

  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  const renderContent = () => {
    if (!currentUser) {
      return <WelcomeSection onGetStarted={handleGetStarted} />;
    }

    switch (currentSection) {
      case 'dashboard':
        return <Dashboard userId={currentUser.id} />;
      case 'portfolio':
        return <Portfolio userId={currentUser.id} />;
      case 'transactions':
        return <Transactions userId={currentUser.id} />;
      case 'analytics':
        return <Analytics userId={currentUser.id} />;
      default:
        return <Dashboard userId={currentUser.id} />;
    }
  };

  return (
    <Switch>
      <Route path="/">
        <div className="min-h-screen bg-background">
          <Navigation 
            currentUser={currentUser}
            onAuthClick={() => setShowAuthModal(true)}
            onLogout={handleLogout}
          />
          
          <div className="flex">
            <Sidebar 
              currentSection={currentSection}
              onSectionChange={setCurrentSection}
              isVisible={!!currentUser}
            />
            
            <div className="flex-1 p-6">
              {renderContent()}
            </div>
          </div>

          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={handleAuthSuccess}
          />
        </div>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
