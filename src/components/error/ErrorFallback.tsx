import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home, RefreshCcw } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  onReset?: () => void;
}

const ErrorFallback = ({ error, errorInfo, onReset }: ErrorFallbackProps) => {
  const isDevelopment = import.meta.env.DEV;

  const handleReload = () => {
    if (onReset) {
      onReset();
    }
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-maroon/10 flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-maroon" strokeWidth={1.5} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-maroon mb-4">
          Something Went Wrong
        </h1>

        {/* Message */}
        <p className="text-gray-600 text-lg mb-8">
          We encountered an unexpected error. This has been logged, and we'll work to fix it.
        </p>

        {/* Error Details (Development Only) */}
        {isDevelopment && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-red-900 mb-2">Error Details (Development Mode)</h3>
            <p className="text-sm text-red-800 mb-2 font-mono break-all">
              {error.toString()}
            </p>
            {errorInfo && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-red-700 font-semibold">
                  Stack Trace
                </summary>
                <pre className="mt-2 text-xs text-red-600 overflow-auto max-h-64 bg-white p-3 rounded border border-red-200">
                  {errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleReload}
            className="bg-maroon hover:bg-maroon/90 text-white px-8 py-6 text-lg rounded-full gap-2"
          >
            <RefreshCcw className="w-5 h-5" />
            Try Again
          </Button>
          
          <Button
            variant="outline"
            asChild
            className="border-maroon text-maroon hover:bg-maroon/10 px-8 py-6 text-lg rounded-full gap-2"
          >
            <Link to="/">
              <Home className="w-5 h-5" />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Divider */}
        <div className="gold-line-accent my-12 opacity-50" />

        {/* Help Text */}
        <p className="text-sm text-gray-500">
          If this problem persists, please contact{' '}
          <a 
            href="mailto:sandeshaya@anandacollege.edu.lk"
            className="text-maroon hover:underline font-medium"
          >
            sandeshaya@anandacollege.edu.lk
          </a>
        </p>
      </div>
    </div>
  );
};

export default ErrorFallback;
