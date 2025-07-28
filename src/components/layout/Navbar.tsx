import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Practice', href: '/practice' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav style={{
      backgroundColor: 'white',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px'
        }}>
          {/* Logo and brand */}
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none'
          }}>
            {/* School Logo */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {/* APGSS Crest placeholder */}
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#1e40af',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <div style={{ color: 'white', fontSize: '1.2rem' }}>⚜️</div>
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '16px',
                  height: '16px',
                  backgroundColor: '#ef4444',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'white',
                    borderRadius: '50%'
                  }}></div>
                </div>
              </div>
              
              {/* NSMQ Logo placeholder */}
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#1e40af',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ color: 'white', fontSize: '0.875rem' }}>🔬</div>
              </div>
            </div>
            
            <div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1e40af'
              }}>
                NSMQ Recruit
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                marginTop: '-2px'
              }}>
                Archbishop Porter Girls
              </div>
            </div>
          </Link>

          {/* Desktop navigation and auth - Always visible */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            {/* Navigation links */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px'
            }}>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  style={{
                    padding: '8px 12px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    textDecoration: 'none',
                    borderBottom: isActive(item.href) ? '2px solid #1e40af' : '2px solid transparent',
                    color: isActive(item.href) ? '#1e40af' : '#6b7280',
                    transition: 'color 0.2s, border-color 0.2s'
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Auth buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}>
              <Link
                to="/login"
                style={{
                  color: '#1e40af',
                  padding: '8px 12px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                style={{
                  backgroundColor: '#1e40af',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s'
                }}
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile menu button - For future mobile version */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              display: 'none', // Hidden for now to avoid complexity
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#6b7280',
              cursor: 'pointer',
              transition: 'color 0.2s, background-color 0.2s'
            }}
          >
            {isOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu - Simplified for now */}
      {isOpen && (
        <div style={{
          backgroundColor: 'white',
          borderTop: '1px solid #e5e7eb',
          padding: '16px'
        }}>
          <p style={{ textAlign: 'center', color: '#6b7280' }}>
            Mobile menu coming soon!
          </p>
        </div>
      )}
    </nav>
  );
};

export default Navbar;