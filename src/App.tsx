import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import components from separate files
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/student/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
// THIS IS THE KEY IMPORT! ⬇️
import QuizEngine from './components/QuizEngine';

// Simple Footer Component
const SimpleFooter: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: '#1e40af',
      color: 'white',
      padding: '32px 20px',
      marginTop: '60px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <p style={{
          margin: '0 0 8px 0',
          fontSize: '1rem',
          fontWeight: '500'
        }}>
          © 2025 NSMQ Recruitment Platform. Built for Archbishop Porter Girls.
        </p>
        <p style={{
          margin: 0,
          fontSize: '0.875rem',
          opacity: 0.8
        }}>
          Empowering the next generation of NSMQ champions
        </p>
      </div>
    </footer>
  );
};

function App() {
  return (
    <Router>
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Navigation */}
        <Navbar />
        
        {/* Main content */}
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* QUIZ ROUTES USING IMPORTED COMPONENT ⬇️ */}
            <Route path="/quiz" element={<QuizEngine />} />
            <Route path="/practice" element={<QuizEngine />} />
            <Route path="/student/*" element={<StudentDashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            
            {/* 404 Page */}
            <Route path="*" element={
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '60vh',
                padding: '40px 20px'
              }}>
                <div style={{ 
                  textAlign: 'center',
                  backgroundColor: 'white',
                  padding: '48px',
                  borderRadius: '16px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}>
                  <h1 style={{ 
                    fontSize: '4rem', 
                    fontWeight: 'bold', 
                    color: '#1e40af', 
                    margin: '0 0 16px 0'
                  }}>
                    404
                  </h1>
                  <p style={{ 
                    color: '#6b7280', 
                    margin: '0 0 24px 0'
                  }}>
                    Page not found
                  </p>
                  <a href="/" style={{
                    backgroundColor: '#1e40af',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}>
                    ← Back to Home
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </main>
        
        {/* Footer */}
        <SimpleFooter />
      </div>
    </Router>
  );
}

export default App;