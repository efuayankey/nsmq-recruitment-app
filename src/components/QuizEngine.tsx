import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Sample NSMQ-style questions
const sampleQuestions = [
  {
    id: 1,
    question: "What is the chemical formula for water?",
    options: ["H₂O", "CO₂", "NaCl", "C₆H₁₂O₆"],
    correctAnswer: 0,
    subject: "Chemistry",
    difficulty: "Easy"
  },
  {
    id: 2,
    question: "If 2x + 5 = 15, what is the value of x?",
    options: ["3", "5", "7", "10"],
    correctAnswer: 1,
    subject: "Mathematics",
    difficulty: "Easy"
  },
  {
    id: 3,
    question: "What is the SI unit of electric current?",
    options: ["Volt", "Ampere", "Ohm", "Watt"],
    correctAnswer: 1,
    subject: "Physics",
    difficulty: "Medium"
  },
  {
    id: 4,
    question: "Which organelle is known as the 'powerhouse of the cell'?",
    options: ["Nucleus", "Ribosome", "Mitochondria", "Chloroplast"],
    correctAnswer: 2,
    subject: "Biology",
    difficulty: "Easy"
  },
  {
    id: 5,
    question: "What is the derivative of x² with respect to x?",
    options: ["x", "2x", "x²", "2x²"],
    correctAnswer: 1,
    subject: "Mathematics",
    difficulty: "Medium"
  }
];

interface QuizState {
  currentQuestion: number;
  selectedAnswers: (number | null)[];
  timeRemaining: number;
  isCompleted: boolean;
  showResults: boolean;
}

const QuizEngine: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    selectedAnswers: new Array(sampleQuestions.length).fill(null),
    timeRemaining: 300, // 5 minutes for demo
    isCompleted: false,
    showResults: false
  });

  // Timer effect
  useEffect(() => {
    if (quizState.timeRemaining > 0 && !quizState.isCompleted) {
      const timer = setTimeout(() => {
        setQuizState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);

      return () => clearTimeout(timer);
    } else if (quizState.timeRemaining === 0 && !quizState.isCompleted) {
      // Auto-submit when time runs out
      handleSubmitQuiz();
    }
  }, [quizState.timeRemaining, quizState.isCompleted]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...quizState.selectedAnswers];
    newAnswers[quizState.currentQuestion] = answerIndex;
    setQuizState(prev => ({
      ...prev,
      selectedAnswers: newAnswers
    }));
  };

  const handleNextQuestion = () => {
    if (quizState.currentQuestion < sampleQuestions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1
      }));
    }
  };

  const handlePreviousQuestion = () => {
    if (quizState.currentQuestion > 0) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1
      }));
    }
  };

  const handleSubmitQuiz = () => {
    setQuizState(prev => ({
      ...prev,
      isCompleted: true,
      showResults: true
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    quizState.selectedAnswers.forEach((answer, index) => {
      if (answer === sampleQuestions[index].correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: sampleQuestions.length,
      percentage: Math.round((correct / sampleQuestions.length) * 100)
    };
  };

  const restartQuiz = () => {
    setQuizState({
      currentQuestion: 0,
      selectedAnswers: new Array(sampleQuestions.length).fill(null),
      timeRemaining: 300,
      isCompleted: false,
      showResults: false
    });
  };

  // Results View
  if (quizState.showResults) {
    const score = calculateScore();
    return (
      <div style={{
        minHeight: '80vh',
        backgroundColor: '#f9fafb',
        padding: '40px 20px'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Header */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            marginBottom: '32px'
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '24px',
              color: score.percentage >= 70 ? '#10b981' : score.percentage >= 50 ? '#f59e0b' : '#ef4444'
            }}>
              {score.percentage >= 70 ? '🎉' : score.percentage >= 50 ? '📊' : '📚'}
            </div>
            
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#1e40af',
              margin: '0 0 16px 0'
            }}>
              Quiz Complete!
            </h1>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '24px',
              marginTop: '32px'
            }}>
              <div style={{
                padding: '20px',
                backgroundColor: '#f0f9ff',
                borderRadius: '12px',
                border: '2px solid #3b82f6'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af' }}>
                  {score.correct}/{score.total}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Questions Correct</div>
              </div>
              
              <div style={{
                padding: '20px',
                backgroundColor: score.percentage >= 70 ? '#f0fdf4' : score.percentage >= 50 ? '#fefbeb' : '#fef2f2',
                borderRadius: '12px',
                border: `2px solid ${score.percentage >= 70 ? '#10b981' : score.percentage >= 50 ? '#f59e0b' : '#ef4444'}`
              }}>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  color: score.percentage >= 70 ? '#10b981' : score.percentage >= 50 ? '#f59e0b' : '#ef4444'
                }}>
                  {score.percentage}%
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Overall Score</div>
              </div>
              
              <div style={{
                padding: '20px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '2px solid #64748b'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#64748b' }}>
                  {formatTime(300 - quizState.timeRemaining)}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Time Taken</div>
              </div>
            </div>

            {/* Performance message */}
            <div style={{
              marginTop: '32px',
              padding: '20px',
              backgroundColor: score.percentage >= 70 ? '#dcfce7' : score.percentage >= 50 ? '#fef3c7' : '#fee2e2',
              borderRadius: '12px',
              border: `1px solid ${score.percentage >= 70 ? '#16a34a' : score.percentage >= 50 ? '#d97706' : '#dc2626'}`
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                margin: '0 0 8px 0',
                color: score.percentage >= 70 ? '#16a34a' : score.percentage >= 50 ? '#d97706' : '#dc2626'
              }}>
                {score.percentage >= 70 
                  ? 'Excellent Work!' 
                  : score.percentage >= 50 
                    ? 'Good Effort!' 
                    : 'Keep Practicing!'}
              </h3>
              <p style={{
                margin: 0,
                color: '#374151',
                fontSize: '1rem'
              }}>
                {score.percentage >= 70 
                  ? 'You have strong potential for the NSMQ team! Keep up the excellent work.' 
                  : score.percentage >= 50 
                    ? 'You\'re on the right track. Focus on your weak areas and keep practicing.' 
                    : 'Don\'t worry! Use this as a learning opportunity. Practice more and try again.'}
              </p>
            </div>

            {/* Action buttons */}
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              marginTop: '32px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={restartQuiz}
                style={{
                  backgroundColor: '#1e40af',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                Try Again
              </button>
              
              <Link to="/" style={{
                backgroundColor: 'transparent',
                color: '#1e40af',
                padding: '12px 24px',
                borderRadius: '8px',
                border: '2px solid #1e40af',
                fontWeight: '600',
                fontSize: '1rem',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'all 0.2s'
              }}>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = sampleQuestions[quizState.currentQuestion];
  const progress = ((quizState.currentQuestion + 1) / sampleQuestions.length) * 100;

  return (
    <div style={{
      minHeight: '80vh',
      backgroundColor: '#f9fafb',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header with timer and progress */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1e40af',
              margin: '0 0 8px 0'
            }}>
              NSMQ Practice Quiz
            </h1>
            <p style={{
              margin: 0,
              color: '#6b7280',
              fontSize: '0.875rem'
            }}>
              Question {quizState.currentQuestion + 1} of {sampleQuestions.length} • {currentQ.subject}
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              backgroundColor: quizState.timeRemaining < 60 ? '#fef2f2' : '#f0f9ff',
              color: quizState.timeRemaining < 60 ? '#dc2626' : '#1e40af',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1.125rem',
              border: `2px solid ${quizState.timeRemaining < 60 ? '#dc2626' : '#1e40af'}`
            }}>
              ⏱️ {formatTime(quizState.timeRemaining)}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Progress</span>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e40af' }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: '#1e40af',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>

        {/* Question card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <span style={{
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              {currentQ.subject}
            </span>
            <span style={{
              backgroundColor: currentQ.difficulty === 'Easy' ? '#dcfce7' : '#fef3c7',
              color: currentQ.difficulty === 'Easy' ? '#16a34a' : '#d97706',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              {currentQ.difficulty}
            </span>
          </div>

          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '32px',
            lineHeight: '1.6',
            margin: '0 0 32px 0'
          }}>
            {currentQ.question}
          </h2>

          <div style={{
            display: 'grid',
            gap: '12px'
          }}>
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  textAlign: 'left',
                  border: `2px solid ${
                    quizState.selectedAnswers[quizState.currentQuestion] === index 
                      ? '#1e40af' 
                      : '#e5e7eb'
                  }`,
                  borderRadius: '12px',
                  backgroundColor: quizState.selectedAnswers[quizState.currentQuestion] === index 
                    ? '#dbeafe' 
                    : 'white',
                  color: quizState.selectedAnswers[quizState.currentQuestion] === index 
                    ? '#1e40af' 
                    : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '1rem',
                  fontWeight: quizState.selectedAnswers[quizState.currentQuestion] === index ? '600' : '400'
                }}
              >
                <span style={{ 
                  marginRight: '12px',
                  fontWeight: 'bold',
                  color: '#6b7280'
                }}>
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <button
            onClick={handlePreviousQuestion}
            disabled={quizState.currentQuestion === 0}
            style={{
              backgroundColor: quizState.currentQuestion === 0 ? '#f3f4f6' : 'transparent',
              color: quizState.currentQuestion === 0 ? '#9ca3af' : '#1e40af',
              padding: '12px 20px',
              borderRadius: '8px',
              border: `2px solid ${quizState.currentQuestion === 0 ? '#e5e7eb' : '#1e40af'}`,
              fontWeight: '600',
              cursor: quizState.currentQuestion === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              fontSize: '0.875rem'
            }}
          >
            ← Previous
          </button>

          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            {sampleQuestions.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: index === quizState.currentQuestion 
                    ? '#1e40af' 
                    : quizState.selectedAnswers[index] !== null 
                      ? '#10b981' 
                      : '#e5e7eb',
                  transition: 'background-color 0.2s'
                }}
              ></div>
            ))}
          </div>

          {quizState.currentQuestion === sampleQuestions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                fontSize: '0.875rem'
              }}
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              style={{
                backgroundColor: '#1e40af',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                fontSize: '0.875rem'
              }}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizEngine;