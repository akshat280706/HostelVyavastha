import { DollarSign, TrendingUp, AlertCircle, Users } from 'lucide-react';

export default function FeeSummaryCards({ feeData }) {
  const totalCollected = feeData.reduce((sum, f) => sum + f.paid, 0);
  const totalPending = feeData.reduce((sum, f) => sum + f.due, 0);
  const totalStudents = feeData.length;
  const defaulters = feeData.filter(f => f.status === 'due').length;
  
  const cards = [
    {
      title: 'Total Collected',
      value: `₹${totalCollected.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      title: 'Total Pending',
      value: `₹${totalPending.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
    {
      title: 'Defaulters',
      value: defaulters,
      icon: AlertCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      subtitle: `${totalStudents - defaulters} paid / ${totalStudents} total`,
    },
    {
      title: 'Collection Rate',
      value: `${Math.round((totalCollected / (totalCollected + totalPending)) * 100)}%`,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${card.bg}`}>
              <card.icon size={20} className={card.color} />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">{card.title}</p>
          <p className="text-2xl font-bold text-white">{card.value}</p>
          {card.subtitle && (
            <p className="text-xs text-gray-500 mt-2">{card.subtitle}</p>
          )}
        </div>
      ))}
    </div>
  );
}