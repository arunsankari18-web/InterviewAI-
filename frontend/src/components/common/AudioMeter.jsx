import React from 'react';

export function AudioMeter({ level = 0, isLive = true }) {
  const bars = 16;
  const activeCount = Math.round((level / 100) * bars);

  return (
    <div className="flex items-center space-x-1.5 py-1">
      <div className="flex items-center space-x-0.5 h-6">
        {Array.from({ length: bars }).map((_, idx) => {
          const isActive = isLive && idx < activeCount;
          let barColor = 'bg-slate-200';
          if (isActive) {
            if (idx < 10) barColor = 'bg-emerald-500';
            else if (idx < 14) barColor = 'bg-amber-500';
            else barColor = 'bg-red-500';
          }

          return (
            <div
              key={idx}
              className={`w-1.5 rounded-full transition-all duration-75 ${barColor}`}
              style={{
                height: `${Math.max(20, (idx / bars) * 100)}%`
              }}
            />
          );
        })}
      </div>
      <span className="text-xs font-mono font-medium text-slate-500 min-w-[32px] text-right">
        {level}%
      </span>
    </div>
  );
}
