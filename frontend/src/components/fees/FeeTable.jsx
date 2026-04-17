import { DollarSign, Eye } from 'lucide-react';

export default function FeeTable({ feeData, onPayment }) {
  const getStatusBadge = (status) => {
    switch(status) {
      case 'paid':
        return { text: 'Paid', color: 'bg-green-500/10 text-green-400 border-green-500/20' };
      case 'partial':
        return { text: 'Partial', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' };
      default:
        return { text: 'Due', color: 'bg-red-500/10 text-red-400 border-red-500/20' };
    }
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Student</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Roll No</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Room</th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Total</th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Paid</th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Due</th>
            <th className="text-center py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
            <th className="text-center py-3 px-4 text-gray-400 font-medium text-sm">Action</th>
          </tr>
        </thead>
        <tbody>
          {feeData.map((fee) => {
            const statusBadge = getStatusBadge(fee.status);
            return (
              <tr key={fee.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                <td className="py-3 px-4">
                  <div>
                    <p className="text-white font-medium">{fee.name}</p>
                    <p className="text-xs text-gray-500">{fee.email || 'student@university.edu'}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-300 text-sm">{fee.rollNumber}</td>
                <td className="py-3 px-4 text-gray-300 text-sm">{fee.roomNumber}</td>
                <td className="py-3 px-4 text-right text-white font-medium">₹{fee.total.toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-green-400">₹{fee.paid.toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-red-400">₹{fee.due.toLocaleString()}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium border ${statusBadge.color}`}>
                    {statusBadge.text}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => onPayment(fee)}
                    className="p-1.5 bg-blue-600/20 hover:bg-blue-600 rounded-lg transition-colors"
                  >
                    <DollarSign size={16} className="text-blue-400" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}