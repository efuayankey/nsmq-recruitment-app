import React from 'react';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
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
            backgroundColor: '#ef4444',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
          }}>
            <span style={{ 
              fontSize: '2rem', 
              color: 'white',
              fontWeight: 'bold'
            }}>
              ★
            </span>
          </div>
          
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1e40af',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>
            Join the Team
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#6b7280',
            margin: 0
          }}>
            Start your NSMQ journey with Archbishop Porter Girls
          </p>
        </div>
        
        {/* Coming Soon Notice */}
        <div style={{
          textAlign: 'center',
          padding: '32px 24px',
          backgroundColor: '#fef3f2',
          borderRadius: '12px',
          marginBottom: '32px',
          border: '2px dashed #ef4444'
        }}>
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: '16px',
            filter: 'grayscale(20%)'
          }}>
            🚀
          </div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#ef4444',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>
            Registration Opening Soon!
          </h3>
          <p style={{ 
            color: '#6b7280', 
            marginBottom: '16px',
            margin: '0 0 16px 0',
            lineHeight: '1.5'
          }}>
            Get ready to join Archbishop Porter Girls' elite NSMQ training program.
          </p>
          <div style={{
            backgroundColor: '#fee2e2',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#dc2626'
          }}>
            <strong>What You'll Need:</strong><br />
            • Valid student ID number<br />
            • School email address<br />
            • Parent/guardian consent<br />
            • Academic transcripts
          </div>
        </div>
        
        {/* Requirements Preview */}
        <div style={{
          backgroundColor: '#f8fafc',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '24px',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#1e40af',
            marginBottom: '12px',
            margin: '0 0 12px 0'
          }}>
            NSMQ Team Requirements:
          </h4>
          <ul style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: 0,
            paddingLeft: '20px',
            lineHeight: '1.6'
          }}>
            <li>Minimum 85% in Mathematics & Science subjects</li>
            <li>Form 2 or Form 3 students only</li>
            <li>Strong analytical and problem-solving skills</li>
            <li>Commitment to training schedule</li>
          </ul>
        </div>
        
        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link to="/" style={{
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '14px 24px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: '600',
            display: 'block',
            textAlign: 'center',
            fontSize: '1rem',
            transition: 'background-color 0.2s',
            boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
          }}>
            ← Back to Home
          </Link>
          
          <Link to="/login" style={{
            backgroundColor: 'transparent',
            color: '#6b7280',
            padding: '12px 24px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: '500',
            display: 'block',
            textAlign: 'center',
            fontSize: '0.875rem',
            border: '1px solid #e5e7eb',
            transition: 'all 0.2s'
          }}>
            Get Notified When Registration Opens
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
              Already have an account?{' '}
            </span>
            <Link to="/login" style={{
              color: '#1e40af',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}>
              Sign in here
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

export default RegisterPage;