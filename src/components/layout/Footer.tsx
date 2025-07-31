import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: '#1e40af',
      color: 'white',
      padding: '40px 20px',
      marginTop: '80px',
      borderTop: '1px solid #e5e7eb'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '32px',
          marginBottom: '32px'
        }}>
          {/* School Info */}
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '16px',
              margin: '0 0 16px 0',
              color: '#fbbf24'
            }}>
              Archbishop Porter Girls
            </h3>
            <p style={{
              fontSize: '0.875rem',
              opacity: 0.9,
              lineHeight: '1.6',
              margin: 0
            }}>
              Leading the way in academic excellence and NSMQ preparation. 
              Empowering young women to achieve greatness in science and mathematics.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '16px',
              margin: '0 0 16px 0',
              color: '#fbbf24'
            }}>
              Quick Links
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <a href="/" style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '0.875rem',
                opacity: 0.9,
                transition: 'opacity 0.2s'
              }}>
                Home
              </a>
              <a href="/about" style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '0.875rem',
                opacity: 0.9,
                transition: 'opacity 0.2s'
              }}>
                About NSMQ
              </a>
              <a href="/practice" style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '0.875rem',
                opacity: 0.9,
                transition: 'opacity 0.2s'
              }}>
                Practice Quizzes
              </a>
              <a href="/contact" style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '0.875rem',
                opacity: 0.9,
                transition: 'opacity 0.2s'
              }}>
                Contact Us
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '16px',
              margin: '0 0 16px 0',
              color: '#fbbf24'
            }}>
              Contact
            </h3>
            <div style={{
              fontSize: '0.875rem',
              opacity: 0.9,
              lineHeight: '1.6'
            }}>
              <p style={{ margin: '0 0 8px 0' }}>
                📧 nsmq@apgss.edu.gh
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                📱 +233 XXX XXX XXXX
              </p>
              <p style={{ margin: 0 }}>
                📍 Cape Coast, Central Region
              </p>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p style={{
            margin: 0,
            fontSize: '0.875rem',
            opacity: 0.8
          }}>
            © 2025 NSMQ Recruitment Platform. Built for Archbishop Porter Girls.
          </p>
          
          <div style={{
            display: 'flex',
            gap: '16px',
            fontSize: '0.75rem',
            opacity: 0.7
          }}>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Student Code</span>
          </div>
        </div>

        {/* Motto */}
        <div style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <p style={{
            margin: 0,
            fontSize: '0.75rem',
            fontStyle: 'italic',
            opacity: 0.7,
            color: '#fbbf24'
          }}>
            "Empowering the next generation of NSMQ champions"
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;