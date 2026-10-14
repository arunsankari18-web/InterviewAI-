import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';

export function PasswordStrength({ password = '' }) {
  const analysis = useMemo(() => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    let score = 0;
    if (hasMinLength) score++;
    if (hasUpperCase) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    let label = 'Weak';
    let colorClass = 'bg-red-500 text-red-700';
    let barWidth = 'w-1/4';

    if (score === 2) {
      label = 'Fair';
      colorClass = 'bg-amber-500 text-amber-700';
      barWidth = 'w-2/4';
    } else if (score === 3) {
      label = 'Good';
      colorClass = 'bg-blue-500 text-blue-700';
      barWidth = 'w-3/4';
    } else if (score === 4) {
      label = 'Strong';
      colorClass = 'bg-emerald-500 text-emerald-700';
      barWidth = 'w-full';
    }

    return {
      score,
      label,
      colorClass,
      barWidth,
      criteria: [
        { label: 'At least 8 characters', met: hasMinLength },
        { label: 'Uppercase letter (A-Z)', met: hasUpperCase },
        { label: 'Number (0-9)', met: hasNumber },
        { label: 'Special character (!@#$...)', met: hasSpecial }
      ]
    };
  }, [password]);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2 text-xs">
      <div className="flex items-center justify-between font-medium">
        <span className="text-slate-500">Password Strength:</span>
        <span className={`font-semibold ${
          analysis.score <= 1 ? 'text-red-600' :
          analysis.score === 2 ? 'text-amber-600' :
          analysis.score === 3 ? 'text-blue-600' : 'text-emerald-600'
        }`}>
          {analysis.label}
        </span>
      </div>

      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-300 ${analysis.colorClass} ${analysis.barWidth}`} />
      </div>

      <div className="grid grid-cols-2 gap-1 pt-1 text-[11px] text-slate-500">
        {analysis.criteria.map((c, i) => (
          <div key={i} className="flex items-center space-x-1">
            {c.met ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
            )}
            <span className={c.met ? 'text-slate-700' : 'text-slate-400'}>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
