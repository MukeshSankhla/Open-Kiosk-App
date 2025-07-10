
import { TrendingUp, TrendingDown, Clock, Play } from 'lucide-react';

interface TestStatsProps {
  passed: number;
  failed: number;
  pending: number;
  running: number;
  total: number;
}

const TestStats = ({ passed, failed, pending, running, total }: TestStatsProps) => {
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {/* Passed Tests */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-2xl font-bold text-emerald-700">{passed}</span>
        </div>
        <p className="text-emerald-600 font-medium">Passed</p>
      </div>

      {/* Failed Tests */}
      <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-red-100 rounded-lg">
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <span className="text-2xl font-bold text-red-700">{failed}</span>
        </div>
        <p className="text-red-600 font-medium">Failed</p>
      </div>

      {/* Pending Tests */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <span className="text-2xl font-bold text-orange-700">{pending}</span>
        </div>
        <p className="text-orange-600 font-medium">Pending</p>
      </div>

      {/* Running Tests */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Play className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-2xl font-bold text-blue-700">{running}</span>
        </div>
        <p className="text-blue-600 font-medium">Running</p>
      </div>

      {/* Pass Rate */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <span className="text-2xl font-bold text-purple-700">{passRate}%</span>
        </div>
        <p className="text-purple-600 font-medium">Pass Rate</p>
      </div>
    </div>
  );
};

export default TestStats;
