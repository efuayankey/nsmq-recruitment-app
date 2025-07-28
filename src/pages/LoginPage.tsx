import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#1e40af',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 4px 12px rgba(30, 64, 175, 0.2)'
          }}>
            <span style={{ 
              fontSize: '2rem', 
              color: 'white',
              fontWeight: 'bold'
            }}>
              🎓
            </span>
          </div>
          
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1e40af',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>
            Welcome Back
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#6b7280',
            margin: 0
          }}>
            Access your NSMQ training dashboard
          </p>
        </div>
        
        {/* Coming Soon Notice */}
        <div style={{
          textAlign: 'center',
          padding: '32px 24px',
          backgroundColor: '#f0f9ff',
          borderRadius: '12px',
          marginBottom: '32px',
          border: '2px dashed #3b82f6'
        }}>
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: '16px',
            filter: 'grayscale(20%)'
          }}>
            🚧
          </div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1e40af',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>
            Login System Coming Soon!
          </h3>
          <p style={{ 
            color: '#6b7280', 
            marginBottom: '16px',
            margin: '0 0 16px 0',
            lineHeight: '1.5'
          }}>
            We're building a secure authentication system for all Archbishop Porter Girls students.
          </p>
          <div style={{
            backgroundColor: '#dbeafe',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#1e40af'
          }}>
            <strong>Coming Features:</strong><br />
            • Student ID verification<br />
            • Secure password protection<br />
            • Quiz progress tracking
          </div>
        </div>
        
        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link to="/" style={{
            backgroundColor: '#1e40af',
            color: 'white',
            padding: '14px 24px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: '600',
            display: 'block',
            textAlign: 'center',
            fontSize: '1rem',
            transition: 'background-color 0.2s',
            boxShadow: '0 2px 4px rgba(30, 64, 175, 0.2)'
          }}>
            ← Back to Home
          </Link>
          
          <div style={{
            textAlign: 'center',
            padding: '16px 0',
            borderTop: '1px solid #e5e7eb',
            marginTop: '8px'
          }}>
            <span style={{ 
              color: '#6b7280', 
              fontSize: '0.875rem' 
            }}>
              Don't have an account?{' '}
            </span>
            <Link to="/register" style={{
              color: '#1e40af',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}>
              Sign up here
            </Link>
          </div>
        </div>
        
        {/* School branding */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid #f3f4f6'
        }}>
          <p style={{
            fontSize: '0.75rem',
            color: '#9ca3af',
            margin: 0
          }}>
            Archbishop Porter Girls Secondary School<br />
            NSMQ Recruitment Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;