import React from 'react';

export default function AccountStats({ isMobile = false }) {
  const stats = [
    { label: isMobile ? 'Orders' : 'Orders Placed', value: '12', color: 'blue' },
    { label: 'Completed', value: '8', color: 'green' },
    { label: isMobile ? 'Spent' : 'Total Spent', value: '₹2,450', color: 'purple' }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-100 text-[#229799]',
      green: 'bg-green-50 border-green-100 text-green-600',
      purple: 'bg-purple-50 border-purple-100 text-purple-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className={`grid grid-cols-3 gap-${isMobile ? '3' : '4'} pt-6 border-t border-gray-200`}>
      {stats.map((stat, index) => (
        <div key={index} className={`text-center p-${isMobile ? '3' : '4'} rounded-xl border ${getColorClasses(stat.color)}`}>
          <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>
            {stat.value}
          </div>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}