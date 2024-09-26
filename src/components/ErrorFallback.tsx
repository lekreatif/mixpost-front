import React from "react";

interface ErrorFallbackProps {
  error: Error;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Oops! Something went wrong.
        </h2>
        <p className="text-gray-700 mb-4">
          We're sorry, but an error occurred while processing your request.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Error details: {error.message}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
        >
          Refresh the page
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
