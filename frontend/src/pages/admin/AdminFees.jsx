import { useState, useEffect } from 'react';
import { feeService, userService } from '../../services/api';
import { Search, Download, CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminFees() {
  const [fees, setFees] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    setLoading(true);
    const response = await feeService.getFees({ limit: 100 });
    if (response.success) {
      setFees(response.data || []);
    }
    setLoading(false);
  };

  const filteredFees = fees.filter(fee => {
    const matchesFilter = filter === 'all' || fee.status === filter;
    const matchesSearch = 
      fee.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.roll_number?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    totalCollected: fees.reduce((sum, f) => sum + (f.status === 'paid' ? f.amount : 0), 0),
    totalPending: fees.reduce((sum, f) => sum + (f.status !== 'paid' ? f.amount : 0), 0),
    totalStudents: fees.length,
    paid: fees.filter(f => f.status === 'paid').length,
    partial: fees.filter(f => f.status === 'partial').length,
    due: fees.filter(f => f.status === 'pending').length,
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading fees data...</div>;
  }

  return (
    <div>
      <h1 className="page-title">Fee Management</h1>
      
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-card-label">Total Collected</div>
          <div className="stat-card-value">₹{(stats.totalCollected / 100000).toFixed(1)}L</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Total Pending</div>
          <div className="stat-card-value">₹{(stats.totalPending / 100000).toFixed(1)}L</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Collection Rate</div>
          <div className="stat-card-value">
            {Math.round((stats.totalCollected / (stats.totalCollected + stats.totalPending || 1)) * 100)}%
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Defaulters</div>
          <div className="stat-card-value">{stats.due}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '40px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'paid', 'partial', 'pending'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`filter-btn ${filter === s ? 'active' : ''}`}>
              {s} ({stats[s === 'all' ? 'totalStudents' : s]})
            </button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: 'auto', background: 'white', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Student</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Room</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Amount</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Paid</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Due</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredFees.map(fee => (
              <tr key={fee.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: '500' }}>{fee.student_name}</div>
                </td>
                <td style={{ padding: '12px 16px' }}>{fee.room_number || '—'}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>₹{fee.amount?.toLocaleString()}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', color: '#22c55e' }}>₹{fee.paid_amount?.toLocaleString() || 0}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', color: '#ef4444' }}>₹{fee.due_amount?.toLocaleString() || fee.amount}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    background: fee.status === 'paid' ? '#d1fae5' : fee.status === 'partial' ? '#fef3c7' : '#fee2e2',
                    color: fee.status === 'paid' ? '#065f46' : fee.status === 'partial' ? '#92400e' : '#991b1b'
                  }}>
                    {fee.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}