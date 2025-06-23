
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";
import { useEffect } from "react";

interface VoiceSearchButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

const VoiceSearchButton = ({ onTranscript, className }: VoiceSearchButtonProps) => {
  const { isListening, transcript, startListening, stopListening, resetTranscript, isSupported, confidence } = useVoiceSearch();

  useEffect(() => {
    if (transcript && !isListening) {
      // Auto-search when voice stops
      onTranscript(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, onTranscript, resetTranscript]);

  if (!isSupported) {
    return null;
  }

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const getButtonText = () => {
    if (isListening) {
      return transcript ? `"${transcript}"` : "Listening...";
    }
    return "Voice";
  };

  const getButtonColor = () => {
    if (isListening) {
      if (confidence > 0.7) return "bg-green-500 hover:bg-green-600";
      if (confidence > 0.4) return "bg-yellow-500 hover:bg-yellow-600";
      return "bg-red-500 hover:bg-red-600";
    }
    return "";
  };

  return (
    <div className="relative">
      <Button
        variant={isListening ? "default" : "outline"}
        size="sm"
        onClick={handleClick}
        className={`${className} ${getButtonColor()} transition-all duration-200`}
      >
        {isListening ? (
          <>
            <MicOff className="w-4 h-4 animate-pulse" />
            <span className="ml-2 hidden sm:inline max-w-32 truncate">{getButtonText()}</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            <span className="ml-2 hidden sm:inline">Voice</span>
          </>
        )}
      </Button>
      {isListening && (
        <div className="absolute -bottom-8 left-0 right-0 text-xs text-center text-gray-500">
          {confidence > 0 && `${Math.round(confidence * 100)}% confident`}
        </div>
      )}
    </div>
  );
};

export default VoiceSearchButton;
