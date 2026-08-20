import React, { useEffect, useState } from 'react';
import { BarChart3, Clock, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Analytics() {
  const [benchmark, setBenchmark] = useState(null);

  useEffect(() => {
    fetch('/api/analytics/benchmark')
      .then((res) => res.json())
      .then((data) => setBenchmark(data));
  }, []);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-blue-400" />
          <span>DBMS Query Performance & Benchmark Analysis</span>
        </h1>
        <p className="text-xs text-gray-400">Comparing Traditional DBMS Multi-Table JOIN search times against DERIS Relationship Index lookups.</p>
      </div>

      {/* Speedup Highlight Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 space-y-3">
        <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
          <Zap className="w-4 h-4" />
          <span>99.9% Query Latency Reduction</span>
        </div>
        <p className="text-sm text-white font-semibold">
          {benchmark ? benchmark.benchmark_summary : 'Loading benchmark stats...'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-3 rounded-xl bg-gray-900/80 border border-rose-500/30">
            <div className="font-mono font-bold text-rose-400">Traditional DBMS Time Complexity</div>
            <div className="text-gray-300 font-mono mt-1">{benchmark ? benchmark.time_complexity_traditional : 'O(N*M*K)'}</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-900/80 border border-emerald-500/30">
            <div className="font-mono font-bold text-emerald-400">DERIS DBMS Time Complexity</div>
            <div className="text-gray-300 font-mono mt-1">{benchmark ? benchmark.time_complexity_deris : 'O(1)'}</div>
          </div>
        </div>
      </div>

      {/* Latency Comparison Table */}
      <div className="rounded-2xl glass-panel p-6 border border-gray-800 space-y-4">
        <h2 className="text-sm font-bold text-white">Empirical Scaling Latency Benchmark (Milliseconds)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-[11px] font-mono font-bold text-gray-400 uppercase">
                <th className="p-3">Database Dataset Scale (Records)</th>
                <th className="p-3">Traditional 14-Table JOIN (ms)</th>
                <th className="p-3 text-cyan-400">DERIS Pre-Indexed Lookup (ms)</th>
                <th className="p-3 text-emerald-400">Speedup Multiplier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-xs font-mono">
              {benchmark && benchmark.data && benchmark.data.map((row, i) => (
                <tr key={i} className="hover:bg-gray-800/40">
                  <td className="p-3 text-white font-bold">{row.records.toLocaleString()} cases</td>
                  <td className="p-3 text-rose-400">{row.traditional_ms} ms</td>
                  <td className="p-3 text-cyan-300 font-bold">{row.deris_ms} ms</td>
                  <td className="p-3 text-emerald-400 font-bold">
                    {(row.traditional_ms / row.deris_ms).toFixed(0)}x Faster ⚡
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
