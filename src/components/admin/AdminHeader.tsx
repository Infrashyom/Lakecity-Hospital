import { Button } from "@/src/components/ui/Button";
import { Menu, Plus } from "lucide-react";

interface HeaderProps {
  title: string;
  onAddClick?: () => void;
  onMenuClick?: () => void;
  addLabel?: string;
}

export function AdminHeader({ title, onAddClick, onMenuClick, addLabel = "Add New" }: HeaderProps) {
  return (
    <header className="flex justify-between items-center mb-10 pt-4 lg:pt-0">
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
          onClick={onMenuClick}
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 capitalize">{title}</h1>
          <p className="text-slate-500 hidden sm:block">Managing hospital resources and patient visits</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {onAddClick && (
          <Button className="gap-2 shrink-0" onClick={onAddClick}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{addLabel}</span>
          </Button>
        )}
      </div>
    </header>
  );
}
