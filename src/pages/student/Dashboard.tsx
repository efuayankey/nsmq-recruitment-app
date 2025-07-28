import React from 'react';

const StudentDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-nsmq-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-nsmq-blue mb-8">
          Student Dashboard
        </h1>
        
        <div className="nsmq-card p-8 text-center">
          <p className="text-nsmq-gray-500 text-lg">
            🚧 Student dashboard coming soon!
          </p>
          <p className="text-sm text-nsmq-gray-400 mt-2">
            This will include practice quizzes, scores, and progress tracking.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;