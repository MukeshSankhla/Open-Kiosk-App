
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminAccessProps {
  onAuthenticated: () => void;
}

const AdminAccess = ({ onAuthenticated }: AdminAccessProps) => {
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const ADMIN_PASSWORD = "admin123"; // In production, this should be environment variable

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onAuthenticated();
      setIsOpen(false);
      setPassword("");
      toast({
        title: "Access Granted",
        description: "Welcome to the admin panel",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password",
        variant: "destructive",
      });
      setPassword("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white hover:bg-gray-700"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Admin Access
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Enter Admin Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full"
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full">
            Access Admin Panel
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminAccess;
