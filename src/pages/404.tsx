import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary text-gray-800 p-4">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-sm text-center mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="px-3 py-2 text-sm bg-primary text-white rounded-lg hover:opacity-80 transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
