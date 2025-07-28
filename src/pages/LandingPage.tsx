import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', fontSize: '16px' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #8b5cf6 100%)',
        color: 'white',
        padding: '80px 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}>
          {/* Left side - Text content */}
          <div>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '24px',
              lineHeight: '1.2',
              margin: '0 0 24px 0'
            }}>
              Join the Legacy of
              <br />
              <span style={{ color: '#fbbf24' }}>NSMQ Champions</span>
            </h1>
            <p style={{
              fontSize: '1.25rem',
              marginBottom: '32px',
              opacity: 0.9,
              lineHeight: '1.6',
              margin: '0 0 32px 0'
            }}>
              Train, compete, and represent Archbishop Porter Girls in Ghana's most prestigious academic competition.
            </p>
            
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
              <Link to="/register" style={{
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                display: 'inline-block',
                fontSize: '1rem'
              }}>
                Start Your Journey
              </Link>
              <Link to="/login" style={{
                backgroundColor: 'white',
                color: '#1e40af',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                display: 'inline-block',
                fontSize: '1rem'
              }}>
                Already Registered?
              </Link>
            </div>

            {/* Quick stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24', margin: '0 0 4px 0' }}>100+</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.75, margin: 0 }}>Students Trained</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24', margin: '0 0 4px 0' }}>95%</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.75, margin: 0 }}>Time Saved</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24', margin: '0 0 4px 0' }}>24/7</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.75, margin: 0 }}>Practice Access</div>
              </div>
            </div>
          </div>

          {/* Right side - Photo placeholder */}
          <div>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(139, 92, 246, 0.2))',
                height: '320px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    backgroundColor: '#fbbf24', 
                    borderRadius: '50%',
                    margin: '0 auto 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    color: '#1e40af'
                  }}>
                    ★
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                    Add Your 2022 Team Photo
                  </h3>
                  <p style={{ opacity: 0.8, margin: '8px 0', fontSize: '1rem' }}>Western Zonal Champions</p>
                  <p style={{ fontSize: '0.875rem', opacity: 0.6, margin: '16px 0 0 0' }}>
                    [Replace with your contestants photo]
                  </p>
                </div>
              </div>
              
              {/* Achievement badge */}
              <div style={{
                position: 'absolute',
                top: '-16px',
                right: '-16px',
                backgroundColor: '#fbbf24',
                color: '#1e40af',
                padding: '8px 16px',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }}>
                2022 Champions
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        backgroundColor: 'white',
        padding: '80px 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#1e40af',
              marginBottom: '16px',
              margin: '0 0 16px 0'
            }}>
              Why Choose Our Platform?
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Revolutionizing NSMQ recruitment with cutting-edge technology and proven results.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px'
          }}>
            {/* Feature 1 */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'rgba(30, 64, 175, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '1.5rem',
                color: '#1e40af',
                fontWeight: 'bold'
              }}>
                ⚡
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1e40af',
                marginBottom: '12px',
                margin: '0 0 12px 0'
              }}>
                Instant Results
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6', margin: 0, fontSize: '1rem' }}>
                Get your scores immediately after completing any quiz. No more waiting weeks for results.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '1.5rem',
                color: '#ef4444',
                fontWeight: 'bold'
              }}>
                📚
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1e40af',
                marginBottom: '12px',
                margin: '0 0 12px 0'
              }}>
                Unlimited Practice
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6', margin: 0, fontSize: '1rem' }}>
                Practice as much as you want with our extensive question bank covering all NSMQ subjects.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '1.5rem',
                color: '#8b5cf6',
                fontWeight: 'bold'
              }}>
                📊
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1e40af',
                marginBottom: '12px',
                margin: '0 0 12px 0'
              }}>
                Performance Analytics
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6', margin: 0, fontSize: '1rem' }}>
                Track your progress with detailed analytics and identify areas for improvement.
              </p>
            </div>

            {/* Feature 4 */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '1.5rem',
                color: '#fbbf24',
                fontWeight: 'bold'
              }}>
                ★
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1e40af',
                marginBottom: '12px',
                margin: '0 0 12px 0'
              }}>
                Champion Training
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6', margin: 0, fontSize: '1rem' }}>
                Follow the same training path used by our previous NSMQ representatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #8b5cf6 100%)',
        color: 'white',
        padding: '80px 20px'
      }}>        
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '24px',
            margin: '0 0 24px 0'
          }}>
            Ready to Begin Your NSMQ Journey?
          </h2>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '32px',
            opacity: 0.9,
            margin: '0 0 32px 0'
          }}>
            Join Archbishop Porter Girls' next generation of NSMQ champions. Registration opens soon!
          </p>
          
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link to="/register" style={{
              backgroundColor: '#ef4444',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              display: 'inline-block',
              fontSize: '1rem'
            }}>
              Register Now
            </Link>
            <Link to="/login" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              display: 'inline-block',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontSize: '1rem'
            }}>
              Practice Quiz
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;