import { useState } from 'react';
import { Download, CreditCard } from 'lucide-react';

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
    ],
  };

  const paymentHistory = [
    { id: 1, date: 'Jan 15, 2026', amount: 10000, method: 'Credit Card', transactionId: 'TXN123456' },
    { id: 2, date: 'Feb 20, 2026', amount: 5000, method: 'UPI', transactionId: 'TXN789012' },
    { id: 3, date: 'Mar 10, 2026', amount: 5000, method: 'Net Banking', transactionId: 'TXN345678' },
  ];

  const tabStyle = (active) => ({
    padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '500',
    cursor: 'pointer', border: '1px solid', transition: 'all 0.15s ease',
    background: active ? 'var(--accent-blue)' : 'white',
    color: active ? 'white' : 'var(--text-secondary)',
    borderColor: active ? 'var(--accent-blue)' : 'var(--border-medium)',
  });

  return (
    <div>
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-card-label">Total Fees</div>
          <div className="stat-card-value">₹{feeDetails.total.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Amount Paid</div>
          <div className="stat-card-value" style={{ color: 'var(--status-green)' }}>₹{feeDetails.paid.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Due Amount</div>
          <div className="stat-card-value" style={{ color: 'var(--status-red)' }}>₹{feeDetails.due.toLocaleString()}</div>
        </div>
      </div>

      <div className="form-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '8px' }}>
          <button onClick={() => setSelectedTab('summary')} style={tabStyle(selectedTab === 'summary')}>Fee Summary</button>
          <button onClick={() => setSelectedTab('history')} style={tabStyle(selectedTab === 'history')}>Payment History</button>
        </div>

        <div style={{ padding: '20px' }}>
          {selectedTab === 'summary' ? (
            <div>
              <h3 style={{ marginBottom: '16px' }}>Fee Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {feeDetails.breakdown.map((item, idx) => (
                  <div key={idx} style={{ padding: '16px', background: 'var(--bg-surface-hover)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{item.item}</span>
                      <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>₹{item.amount.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--status-green)' }}>Paid: ₹{item.paid.toLocaleString()}</span>
                      <span style={{ color: 'var(--status-red)' }}>Due: ₹{item.due.toLocaleString()}</span>
                    </div>
                    <div style={{ width: '100%', background: '#e2e8f0', borderRadius: '4px', height: '6px' }}>
                      <div style={{ width: `${(item.paid / item.amount) * 100}%`, background: 'var(--status-green)', borderRadius: '4px', height: '6px' }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '20px', padding: '16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '2px' }}>Due Date</p>
                    <p style={{ fontWeight: '500', color: 'var(--text-primary)' }}>April 30, 2026</p>
                  </div>
                  <button className="btn-submit" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px' }}>
                    <CreditCard size={16} /> Pay Now
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 style={{ marginBottom: '16px' }}>Payment History</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {paymentHistory.map((payment) => (
                  <div key={payment.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--bg-surface-hover)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                    <div>
                      <p style={{ fontWeight: '500', color: 'var(--text-primary)' }}>₹{payment.amount.toLocaleString()}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{payment.date}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{payment.method}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>ID: {payment.transactionId}</p>
                    </div>
                    <Download size={16} style={{ color: 'var(--text-tertiary)', cursor: 'pointer' }} />
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
