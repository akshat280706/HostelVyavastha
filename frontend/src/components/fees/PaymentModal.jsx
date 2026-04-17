import { useState } from 'react';
import { X, CreditCard, AlertCircle } from 'lucide-react';

export default function PaymentModal({ student, onClose, onPayment }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const paymentAmount = parseFloat(amount);
    
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (paymentAmount > student.due) {
      setError(`Amount cannot exceed due amount of ₹${student.due.toLocaleString()}`);
      return;
    }
    
    onPayment(student.id, paymentAmount);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-md border border-gray-700 shadow-xl">
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-white">Record Payment</h2>
            <p className="text-sm text-gray-400 mt-1">{student.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5">
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Total Amount</span>
              <span className="text-white font-medium">₹{student.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Already Paid</span>
              <span className="text-green-400 font-medium">₹{student.paid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-gray-700">
              <span className="text-gray-400">Due Amount</span>
              <span className="text-red-400 font-medium">₹{student.due.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Payment Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full pl-8 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg mb-4">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard size={18} />
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}