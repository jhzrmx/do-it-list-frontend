import React from "react";
import { Link, useRouteError } from "react-router";

interface ErrorPageProps {
  resetErrorBoundary?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ resetErrorBoundary }) => {
  const error = useRouteError() as Error | undefined;

  return (
    <div className="bg-secondary flex flex-col items-center justify-center min-h-screen p-6 text-center font-sans">
      <h1 className="text-4xl font-bold text-primary mb-4">
        Unexpected Error!
      </h1>
      <p className="text-semi-primary mb-2">
        Oops! Something went wrong in the application.
      </p>

      {error && (
        <pre className="text-primary text-left text-sm p-4 rounded-lg max-w-md overflow-auto mb-4">
          Error message: {error.message}
        </pre>
      )}

      <div className="flex gap-4">
        {resetErrorBoundary && (
          <button className="px-4 py-2 bg-primary text-white rounded hover:bg-accent transition">
            Retry
          </button>
        )}
        <Link
          to="/"
          className="px-4 py-2 bg-primary text-white rounded hover:bg-semi-primary transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
