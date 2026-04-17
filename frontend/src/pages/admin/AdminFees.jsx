import { useState, useEffect } from 'react';
import { feeData } from '../../data/feeData';
import { studentsData } from '../../data/studentsData';
import { Search, Download, CreditCard, X } from 'lucide-react';

export default function AdminFees() {
  const [fees, setFees] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');

  useEffect(() => {
    const mergedData = feeData.map(fee => {
      const student = studentsData.find(s => s.id === fee.studentId);
      return { ...fee, studentName: student?.name, rollNumber: student?.rollNumber, roomNumber: student?.roomNumber };
    });
    setFees(mergedData);
  }, []);

  const filteredFees = fees.filter(fee => {
    const matchesFilter = filter === 'all' || fee.status === filter;
    const matchesSearch =
      fee.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    totalCollected: fees.reduce((sum, f) => sum + f.paid, 0),
    totalPending: fees.reduce((sum, f) => sum + f.due, 0),
    totalStudents: fees.length,
    paid: fees.filter(f => f.status === 'paid').length,
    partial: fees.filter(f => f.status === 'partial').length,
    due: fees.filter(f => f.status === 'due').length,
  };

  const handlePayment = () => {
    if (selectedStudent && paymentAmount) {
      const amount = parseFloat(paymentAmount);
      if (amount > 0 && amount <= selectedStudent.due) {
        setFees(prev => prev.map(fee =>
          fee.id === selectedStudent.id
            ? { ...fee, paid: fee.paid + amount, due: fee.due - amount, status: fee.due - amount === 0 ? 'paid' : 'partial' }
            : fee
        ));
        setShowPaymentModal(false);
        setSelectedStudent(null);
        setPaymentAmount('');
      }
    }
  };

  const statusBadgeStyle = (status) => {
    switch (status) {
      case 'paid': return { background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' };
      case 'partial': return { background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' };
      default: return { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' };
    }
  };

  const filterBtnStyle = (active) => ({
    padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '500',
    cursor: 'pointer', border: '1px solid', textTransform: 'capitalize', transition: 'all 0.15s ease',
    background: active ? 'var(--accent-blue)' : 'white',
    color: active ? 'white' : 'var(--text-secondary)',
    borderColor: active ? 'var(--accent-blue)' : 'var(--border-medium)',
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Fee Management</h1>
        <button className="btn-submit" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}>
          <Download size={16} /> Export Report
        </button>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-card-label">Total Collected</div>
          <div className="stat-card-value" style={{ color: 'var(--status-green)' }}>₹{(stats.totalCollected / 100000).toFixed(1)}L</div>
          <div className="stat-card-trend">From {stats.paid} students</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Total Pending</div>
          <div className="stat-card-value" style={{ color: 'var(--status-red)' }}>₹{(stats.totalPending / 100000).toFixed(1)}L</div>
          <div className="stat-card-trend" style={{ color: 'var(--status-red)' }}>From {stats.due + stats.partial} students</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Collection Rate</div>
          <div className="stat-card-value" style={{ color: 'var(--accent-blue)' }}>
            {Math.round((stats.totalCollected / (stats.totalCollected + stats.totalPending || 1)) * 100)}%
          </div>
          <div className="stat-card-trend">Overall progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Defaulters</div>
          <div className="stat-card-value" style={{ color: 'var(--status-red)' }}>{stats.due}</div>
          <div className="stat-card-trend" style={{ color: 'var(--status-red)' }}>Due payments</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: '200px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '40px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'paid', 'partial', 'due'].map((s) => (
            <button key={s} onClick={() => setFilter(s)} style={filterBtnStyle(filter === s)}>
              {s} ({stats[s === 'all' ? 'totalStudents' : s]})
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-hover)', borderBottom: '1px solid var(--border-light)' }}>
                {['Student', 'Roll No', 'Room', 'Total', 'Paid', 'Due', 'Status', 'Action'].map((h, i) => (
                  <th key={h} style={{ textAlign: i >= 3 && i <= 5 ? 'right' : i === 6 || i === 7 ? 'center' : 'left', padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '500' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredFees.map((fee) => (
                <tr key={fee.id} style={{ borderBottom: '1px solid var(--border-light)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px', fontWeight: '500', color: 'var(--text-primary)' }}>{fee.studentName}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '13px' }}>{fee.rollNumber}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '13px' }}>{fee.roomNumber || '—'}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-primary)' }}>₹{fee.total.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--status-green)', fontWeight: '500' }}>₹{fee.paid.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--status-red)', fontWeight: '500' }}>₹{fee.due.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', fontWeight: '500', ...statusBadgeStyle(fee.status) }}>
                      {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <button
                      onClick={() => { setSelectedStudent(fee); setShowPaymentModal(true); }}
                      disabled={fee.due === 0}
                      style={{
                        padding: '6px 10px', borderRadius: '6px', border: 'none', cursor: fee.due === 0 ? 'not-allowed' : 'pointer',
                        background: fee.due === 0 ? '#f3f4f6' : 'var(--accent-blue)', opacity: fee.due === 0 ? 0.5 : 1,
                      }}
                    >
                      <CreditCard size={16} style={{ color: fee.due === 0 ? 'var(--text-tertiary)' : 'white' }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPaymentModal && selectedStudent && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-light)' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>Record Payment</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{selectedStudent.studentName}</p>
              </div>
              <button onClick={() => setShowPaymentModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                {[
                  ['Total Amount', `₹${selectedStudent.total.toLocaleString()}`, 'var(--text-primary)'],
                  ['Already Paid', `₹${selectedStudent.paid.toLocaleString()}`, 'var(--status-green)'],
                  ['Due Amount', `₹${selectedStudent.due.toLocaleString()}`, 'var(--status-red)'],
                ].map(([label, value, color], i) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingTop: i === 2 ? '8px' : 0, marginTop: i === 2 ? '8px' : 0, borderTop: i === 2 ? '1px solid var(--border-light)' : 'none', marginBottom: i < 2 ? '6px' : 0 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                    <span style={{ fontWeight: '500', color }}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label className="form-label">Payment Amount</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}>₹</span>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="form-input"
                    style={{ paddingLeft: '28px' }}
                  />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', padding: '16px 24px', borderTop: '1px solid var(--border-light)' }}>
              <button
                onClick={() => setShowPaymentModal(false)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'white', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px' }}
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={!paymentAmount || parseFloat(paymentAmount) > selectedStudent.due}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: 'var(--status-green)', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '500', opacity: (!paymentAmount || parseFloat(paymentAmount) > selectedStudent.due) ? 0.5 : 1 }}
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
