import { cn } from "@/lib/utils";
import { BarChart3, Briefcase, DollarSign, TrendingUp } from "lucide-react";

interface SidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  isVisible: boolean;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: DollarSign },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { id: 'transactions', label: 'Transactions', icon: TrendingUp },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export function Sidebar({ currentSection, onSectionChange, isVisible }: SidebarProps) {
  if (!isVisible) return null;

  return (
    <div className="w-64 bg-white shadow-sm min-h-screen">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100",
                  isActive 
                    ? "bg-blue-50 text-primary" 
                    : "text-gray-700"
                )}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
