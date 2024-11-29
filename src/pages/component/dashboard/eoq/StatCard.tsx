import React, { useState } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  tooltip?: string; // Agregar la prop tooltip
}

export function StatCard({ title, value, icon, tooltip }: StatCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1 flex items-center">
            {title}
            {tooltip && (
              <span
                className="ml-2 cursor-pointer text-gray-500"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                ℹ️ {/* Ícono de información */}
                {showTooltip && (
                  <span className="absolute bg-gray-700 text-white text-sm rounded p-1 z-10">
                    {tooltip}
                  </span>
                )}
              </span>
            )}
          </p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="text-blue-500">{icon}</div>
      </div>
    </div>
  );
}