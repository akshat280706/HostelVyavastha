import { useState, useEffect } from 'react';
import { feeData, getFeesByStatus } from '../../data/feeData';
import { studentsData } from '../../data/studentsData';
import { Search, DollarSign, Eye, Download, CreditCard, X } from 'lucide-react';

export default function AdminFees() {
  const [fees, setFees] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  
  useEffect(() => {
    // Merge fee data with student details
    const mergedData = feeData.map(fee => {
      const student = studentsData.find(s => s.id === fee.studentId);
      return {
        ...fee,
        studentName: student?.name,
        rollNumber: student?.rollNumber,
        roomNumber: student?.roomNumber
      };
    });
    setFees(mergedData);
  }, []);
  
  const filteredFees = fees.filter(fee => {
    const matchesFilter = filter === 'all' || fee.status === filter;
    const matchesSearch = fee.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fee.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  const stats = {
    totalCollected: fees.reduce((sum, f) => sum + f.paid, 0),
    totalPending: fees.reduce((sum, f) => sum + f.due, 0),
    totalStudents: fees.length,
    paid: fees.filter(f => f.status === 'paid').length,
    partial: fees.filter(f => f.status === 'partial').length,
    due: fees.filter(f => f.status === 'due').length
  };
  
  const handlePayment = () => {
    if (selectedStudent && paymentAmount) {
      const amount = parseFloat(paymentAmount);
      if (amount > 0 && amount <= selectedStudent.due) {
        setFees(prev => prev.map(fee =>
          fee.id === selectedStudent.id
            ? {
                ...fee,
                paid: fee.paid + amount,
                due: fee.due - amount,
                status: fee.due - amount === 0 ? 'paid' : 'partial'
              }
            : fee
        ));
        setShowPaymentModal(false);
        setSelectedStudent(null);
        setPaymentAmount('');
      }
    }
  };
  
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
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Fee Management</h2>
          <p className="text-gray-400 text-sm">Track and manage student fees</p>
        </div>
        <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm flex items-center gap-2">
          <Download size={16} />
          Export Report
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-xs text-gray-400">Total Collected</p>
          <p className="text-2xl font-bold text-green-400">₹{(stats.totalCollected / 100000).toFixed(1)}L</p>
          <p className="text-xs text-gray-500">From {stats.paid} students</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-xs text-gray-400">Total Pending</p>
          <p className="text-2xl font-bold text-red-400">₹{(stats.totalPending / 100000).toFixed(1)}L</p>
          <p className="text-xs text-gray-500">From {stats.due + stats.partial} students</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-xs text-gray-400">Collection Rate</p>
          <p className="text-2xl font-bold text-blue-400">
            {Math.round((stats.totalCollected / (stats.totalCollected + stats.totalPending)) * 100)}%
          </p>
          <p className="text-xs text-gray-500">Overall progress</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-xs text-gray-400">Defaulters</p>
          <p className="text-2xl font-bold text-red-400">{stats.due}</p>
          <p className="text-xs text-gray-500">Students with due payments</p>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'paid', 'partial', 'due'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {status} ({stats[status === 'all' ? 'totalStudents' : status]})
            </button>
          ))}
        </div>
      </div>
      
      {/* Fee Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/50">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Student</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Roll No</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Room</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Total</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Paid</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Due</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFees.map((fee) => {
                const statusBadge = getStatusBadge(fee.status);
                return (
                  <tr key={fee.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="py-3 px-4">
                      <p className="text-white font-medium">{fee.studentName}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-300 text-sm">{fee.rollNumber}</td>
                    <td className="py-3 px-4 text-gray-300 text-sm">{fee.roomNumber || '—'}</td>
                    <td className="py-3 px-4 text-right text-white">₹{fee.total.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-green-400">₹{fee.paid.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-red-400">₹{fee.due.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium border ${statusBadge.color}`}>
                        {statusBadge.text}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedStudent(fee);
                          setShowPaymentModal(true);
                        }}
                        disabled={fee.due === 0}
                        className={`p-1.5 rounded-lg transition-colors ${
                          fee.due === 0
                            ? 'bg-gray-700 cursor-not-allowed opacity-50'
                            : 'bg-blue-600/20 hover:bg-blue-600'
                        }`}
                      >
                        <CreditCard size={16} className={fee.due === 0 ? 'text-gray-500' : 'text-blue-400'} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Payment Modal */}
      {showPaymentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center p-5 border-b border-gray-800">
              <div>
                <h3 className="text-lg font-semibold text-white">Record Payment</h3>
                <p className="text-sm text-gray-400">{selectedStudent.studentName}</p>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5">
              <div className="mb-4 p-3 bg-gray-800 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Amount</span>
                  <span className="text-white font-medium">₹{selectedStudent.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Already Paid</span>
                  <span className="text-green-400 font-medium">₹{selectedStudent.paid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-gray-700">
                  <span className="text-gray-400">Due Amount</span>
                  <span className="text-red-400 font-medium">₹{selectedStudent.due.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Payment Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 p-5 border-t border-gray-800">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={!paymentAmount || parseFloat(paymentAmount) > selectedStudent.due}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}