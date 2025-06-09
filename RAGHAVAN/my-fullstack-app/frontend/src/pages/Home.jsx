import React from 'react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to My Fullstack App</h1>
      <p className="text-lg text-gray-700 mb-8">This is the home page of your application.</p>
      <a href="/dashboard" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Go to Dashboard
      </a>
    </div>
  );
};

export default Home;