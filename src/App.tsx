import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Simple placeholder components
const LoginPage = () => (
  <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="nsmq-card p-8" style={{ maxWidth: '400px', width: '100%' }}>
      <h2 className="text-3xl font-bold text-nsmq-blue text-center mb-6">Sign In</h2>
      <p className="text-center text-nsmq-gray-500 mb-4">🚧 Login form coming soon!</p>
      <Link to="/" className="nsmq-btn-primary" style={{ width: '100%', textAlign: 'center' }}>
        ← Back to Home
      </Link>
    </div>
  </div>
);

const RegisterPage = () => (
  <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="nsmq-card p-8" style={{ maxWidth: '400px', width: '100%' }}>
      <h2 className="text-3xl font-bold text-nsmq-blue text-center mb-6">Join NSMQ</h2>
      <p className="text-center text-nsmq-gray-500 mb-4">🚧 Registration coming soon!</p>
      <Link to="/" className="nsmq-btn-primary" style={{ width: '100%', textAlign: 'center' }}>
        ← Back to Home
      </Link>
    </div>
  </div>
);

const LandingPage = () => (
  <div>
    {/* Hero Section */}
    <section className="nsmq-gradient text-white" style={{ padding: '80px 0' }}>
      <div className="container">
        <div className="grid grid-cols-2 gap-8 items-center">
          {/* Left side */}
          <div>
            <h1 className="text-4xl font-bold mb-6">
              Join the Legacy of <br />
              <span className="text-nsmq-gold">NSMQ Champions</span>
            </h1>
            <p className="text-xl mb-8" style={{ opacity: 0.9 }}>
              Train, compete, and represent [Your School Name] in Ghana's most prestigious academic competition.
            </p>
            
            <div className="flex space-x-4">
              <Link to="/register" className="nsmq-btn-secondary">
                Start Your Journey
              </Link>
              <Link to="/login" className="bg-white text-nsmq-blue px-6 py-3 rounded-lg font-medium" 
                    style={{ textDecoration: 'none', borderRadius: '8px' }}>
                Already Registered?
              </Link>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-nsmq-gold">100+</div>
                <div className="text-sm" style={{ opacity: 0.75 }}>Students Trained</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-nsmq-gold">95%</div>
                <div className="text-sm" style={{ opacity: 0.75 }}>Time Saved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-nsmq-gold">24/7</div>
                <div className="text-sm" style={{ opacity: 0.75 }}>Practice Access</div>
              </div>
            </div>
          </div>

          {/* Right side - Photo placeholder */}
          <div>
            <div className="nsmq-card p-8 text-center">
              <div style={{ 
                background: 'linear-gradient(135deg, #fbbf24, #8b5cf6)', 
                height: '300px', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <div>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
                  <h3 className="text-xl font-bold">Your 2022 NSMQ Team</h3>
                  <p style={{ opacity: 0.8, marginTop: '0.5rem' }}>Western Zonal Champions</p>
                  <p style={{ fontSize: '0.875rem', opacity: 0.6, marginTop: '1rem' }}>
                    [Add your contestants photo here]
                  </p>
                </div>
              </div>
              <div style={{ 
                position: 'relative',
                top: '-20px',
                right: '-20px',
                background: '#fbbf24',
                color: '#1e40af',
                padding: '8px 16px',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                display: 'inline-block'
              }}>
                2022 Champions
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section className="bg-white" style={{ padding: '80px 0' }}>
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-nsmq-blue mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-nsmq-gray-500">
            Revolutionizing NSMQ recruitment with cutting-edge technology.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="nsmq-card p-6 text-center">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
            <h3 className="text-xl font-semibold text-nsmq-blue mb-3">Instant Results</h3>
            <p className="text-nsmq-gray-500">
              Get your scores immediately after completing any quiz. No more waiting weeks for results.
            </p>
          </div>

          <div className="nsmq-card p-6 text-center">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
            <h3 className="text-xl font-semibold text-nsmq-blue mb-3">Unlimited Practice</h3>
            <p className="text-nsmq-gray-500">
              Practice as much as you want with our extensive question bank covering all NSMQ subjects.
            </p>
          </div>

          <div className="nsmq-card p-6 text-center">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
            <h3 className="text-xl font-semibold text-nsmq-blue mb-3">Performance Analytics</h3>
            <p className="text-nsmq-gray-500">
              Track your progress with detailed analytics and identify areas for improvement.
            </p>
          </div>

          <div className="nsmq-card p-6 text-center">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
            <h3 className="text-xl font-semibold text-nsmq-blue mb-3">Champion Training</h3>
            <p className="text-nsmq-gray-500">
              Follow the same training path used by our previous NSMQ representatives.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="nsmq-gradient text-white" style={{ padding: '80px 0' }}>
      <div className="container text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Begin Your NSMQ Journey?
        </h2>
        <p className="text-xl mb-8" style={{ opacity: 0.9 }}>
          Join [Your School Name]'s next generation of NSMQ champions!
        </p>
        
        <div className="flex justify-center space-x-4">
          <Link to="/register" className="nsmq-btn-secondary">
            Register Now
          </Link>
          <Link to="/login" 
                className="bg-white text-nsmq-blue px-6 py-3 rounded-lg font-medium"
                style={{ textDecoration: 'none', borderRadius: '8px' }}>
            Practice Quiz
          </Link>
        </div>
      </div>
    </section>
  </div>
);

const Navbar = () => (
  <nav className="navbar">
    <div className="container">
      <Link to="/" className="logo">
        <div style={{ 
          width: '40px', 
          height: '40px', 
          background: '#1e40af', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem'
        }}>
          🎓
        </div>
        <div>
          <div className="text-xl font-bold text-nsmq-blue">NSMQ Recruit</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '-2px' }}>
            [Your School]
          </div>
        </div>
      </Link>

      <div className="flex items-center space-x-4">
        <Link to="/login" className="text-nsmq-blue font-medium" style={{ textDecoration: 'none' }}>
          Sign In
        </Link>
        <Link to="/register" className="nsmq-btn-primary">
          Get Started
        </Link>
      </div>
    </div>
  </nav>
);

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <Navbar />
        
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '50vh' 
              }}>
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-nsmq-blue mb-4">404</h1>
                  <p className="text-nsmq-gray-500">Page not found</p>
                </div>
              </div>
            } />
          </Routes>
        </main>

        <footer className="bg-nsmq-blue text-white" style={{ padding: '32px 0', marginTop: '64px' }}>
          <div className="container text-center">
            <p>© 2025 NSMQ Recruitment Platform. Built for [Your School Name].</p>
            <p style={{ fontSize: '0.875rem', marginTop: '8px', opacity: 0.75 }}>
              Empowering the next generation of NSMQ champions
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;