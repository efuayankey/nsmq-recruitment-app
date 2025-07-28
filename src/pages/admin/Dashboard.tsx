import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div style={{
      minHeight: '60vh',
      backgroundColor: '#f9fafb',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#1e40af',
          marginBottom: '32px',
          textAlign: 'center',
          margin: '0 0 32px 0'
        }}>
          Admin Dashboard
        </h1>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '48px',
          textAlign: 'center',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '24px' }}>👨‍🏫</div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1e40af',
            marginBottom: '16px',
            margin: '0 0 16px 0'
          }}>
            NSMQ Coordinator Dashboard
          </h2>
          <p style={{
            color: '#6b7280',
            fontSize: '1.125rem',
            margin: '0 0 32px 0',
            lineHeight: '1.6'
          }}>
            🚧 Admin dashboard coming soon! This will include quiz creation, student management, analytics, and reporting tools.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;