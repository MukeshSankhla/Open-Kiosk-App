
import SettingsPanel from "@/components/SettingsPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

export default function AdminSettings() {
  const { currentCurrency, currencies, updateCurrency, loading } = useSettings();

  return (
    <div className="space-y-6">
      <SettingsPanel />
    </div>
  );
}
