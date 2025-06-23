
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wifi, WifiOff, Usb, RefreshCw } from "lucide-react";
import { esp32Printer } from "@/services/esp32PrinterService";
import { useToast } from "@/hooks/use-toast";
import { useStoreSettings } from "@/hooks/useStoreSettings";

interface UartPortSelectorProps {
  onPortSelected?: (comPort: string) => void;
  onPrintRequested?: (comPort: string) => void;
  showPrintButton?: boolean;
}

const UartPortSelector = ({ onPortSelected, onPrintRequested, showPrintButton = false }: UartPortSelectorProps) => {
  const [comPortInput, setComPortInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { settings } = useStoreSettings();

  useEffect(() => {
    checkConnectionStatus();
    // Load COM port from settings if available
    if (settings?.comPort) {
      setComPortInput(settings.comPort);
    }
  }, [settings]);

  const checkConnectionStatus = () => {
    setIsConnected(esp32Printer.isConnected());
  };

  const handleConnect = async () => {
    if (!comPortInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a COM port (e.g., COM3)",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const connected = await esp32Printer.connectToComPort(comPortInput.trim());
      if (connected) {
        setIsConnected(true);
        onPortSelected?.(comPortInput.trim());
        toast({
          title: "Success",
          description: `Connected to ${comPortInput.trim()} successfully`
        });
      } else {
        throw new Error('Failed to connect');
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Error",
        description: `Failed to connect to ${comPortInput.trim()}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await esp32Printer.disconnect();
      setIsConnected(false);
      toast({
        title: "Disconnected",
        description: "UART port disconnected"
      });
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const handleTestPrint = () => {
    if (comPortInput.trim()) {
      onPrintRequested?.(comPortInput.trim());
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Usb className="w-5 h-5 mr-2" />
            UART Port Connection
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={checkConnectionStatus}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-green-600 mr-2" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-600 mr-2" />
            )}
            <span className="text-sm">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          {isConnected && comPortInput && (
            <Badge variant="outline">
              {comPortInput}
            </Badge>
          )}
        </div>

        {/* COM Port Input */}
        <div className="space-y-2">
          <Label htmlFor="comPort">COM Port</Label>
          <Input
            id="comPort"
            placeholder="e.g., COM3, COM4, COM5..."
            value={comPortInput}
            onChange={(e) => setComPortInput(e.target.value)}
            disabled={loading}
          />
          <p className="text-xs text-gray-500">
            Enter the COM port number where your ESP32 printer is connected
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!isConnected ? (
            <Button
              onClick={handleConnect}
              disabled={loading || !comPortInput.trim()}
              className="flex-1"
            >
              {loading ? 'Connecting...' : 'Connect'}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleDisconnect}
              className="flex-1"
            >
              Disconnect
            </Button>
          )}
        </div>

        {/* Print Test Button */}
        {showPrintButton && isConnected && comPortInput && (
          <Button
            onClick={handleTestPrint}
            className="w-full"
          >
            Send Test Print to ESP32
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default UartPortSelector;
