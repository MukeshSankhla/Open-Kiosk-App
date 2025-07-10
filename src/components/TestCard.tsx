
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Test {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'pending' | 'running';
  duration?: number;
  error?: string;
}

interface TestCardProps {
  test: Test;
}

const TestCard = ({ test }: TestCardProps) => {
  const getStatusIcon = () => {
    switch (test.status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (test.status) {
      case 'passed':
        return 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50';
      case 'failed':
        return 'border-red-200 bg-gradient-to-br from-red-50 to-rose-50';
      case 'pending':
        return 'border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50';
      case 'running':
        return 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50';
    }
  };

  return (
    <div className={cn(
      "p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      getStatusColor()
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800 mb-2 leading-tight">
            {test.name}
          </h3>
        </div>
        {getStatusIcon()}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Status:</span>
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            {
              'bg-emerald-100 text-emerald-700': test.status === 'passed',
              'bg-red-100 text-red-700': test.status === 'failed',
              'bg-orange-100 text-orange-700': test.status === 'pending',
              'bg-blue-100 text-blue-700': test.status === 'running',
            }
          )}>
            {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
          </span>
        </div>

        {test.duration && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Duration:</span>
            <span className="text-slate-800 font-medium">{test.duration}ms</span>
          </div>
        )}

        {test.error && (
          <div className="mt-3 p-2 bg-red-100 rounded-lg">
            <p className="text-red-700 text-xs">{test.error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCard;
