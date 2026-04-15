import { useState } from 'react';
import { Download, CreditCard, History } from 'lucide-react';

export default function MyFees() {
  const [selectedTab, setSelectedTab] = useState('summary');
  
  const feeDetails = {
    total: 40000,
    paid: 20000,
    due: 20000,
    status: 'partial',
    breakdown: [
      { item: 'Accommodation Fee', amount: 25000, paid: 15000, due: 10000 },
      { item: 'Mess Fee', amount: 15000, paid: 5000, due: 10000 },
    ]
  };
  
  const paymentHistory = [
    { id: 1, date: 'Jan 15, 2026', amount: 10000, method: 'Credit Card', transactionId: 'TXN123456' },
    { id: 2, date: 'Feb 20, 2026', amount: 5000, method: 'UPI', transactionId: 'TXN789012' },
    { id: 3, date: 'Mar 10, 2026', amount: 5000, method: 'Net Banking', transactionId: 'TXN345678' },
  ];
  
  return (
    <div>
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-card-label">Total Fees</div>
          <div className="stat-card-value">₹{feeDetails.total.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Amount Paid</div>
          <div className="stat-card-value text-green-400">₹{feeDetails.paid.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Due Amount</div>
          <div className="stat-card-value text-red-400">₹{feeDetails.due.toLocaleString()}</div>
        </div>
      </div>
      
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="border-b border-gray-800">
          <div className="flex gap-2 p-4">
            <button
              onClick={() => setSelectedTab('summary')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTab === 'summary' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Fee Summary
            </button>
            <button
              onClick={() => setSelectedTab('history')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTab === 'history' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Payment History
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {selectedTab === 'summary' ? (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Fee Breakdown</h3>
              <div className="space-y-3">
                {feeDetails.breakdown.map((item, idx) => (
                  <div key={idx} className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-white">{item.item}</span>
                      <span className="text-white font-medium">₹{item.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">Paid: ₹{item.paid.toLocaleString()}</span>
                      <span className="text-red-400">Due: ₹{item.due.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${(item.paid / item.amount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-300">Due Date</p>
                    <p className="text-white font-medium">April 30, 2026</p>
                  </div>
                  <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <CreditCard size={16} />
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Payment History</h3>
              <div className="space-y-3">
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
                    <div>
                      <p className="text-white font-medium">₹{payment.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">{payment.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-300">{payment.method}</p>
                      <p className="text-xs text-gray-500">ID: {payment.transactionId}</p>
                    </div>
                    <Download size={16} className="text-gray-400 cursor-pointer hover:text-white" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}