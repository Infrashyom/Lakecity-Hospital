import { X } from "lucide-react";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel", 
  onConfirm, 
  onCancel,
  isDestructive = true
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-[100] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white overflow-hidden flex flex-col rounded-xl shadow-xl">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
          <h2 className="font-bold text-lg text-slate-800">{title}</h2>
          <button onClick={onCancel} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5"/>
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-slate-600">{message}</p>
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-slate-50/50">
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button 
            className={isDestructive ? "bg-red-600 hover:bg-red-700 text-white" : ""} 
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </Card>
    </div>
  );
}
