import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
          <div className="bg-red-900/20 border-2 border-red-500 rounded-xl p-8 max-w-2xl">
            <h1 className="text-3xl font-bold text-red-400 mb-4">⚠️ Something went wrong</h1>
            <p className="text-gray-300 mb-4">
              The application encountered an error. Please refresh the page to try again.
            </p>
            <details className="bg-slate-900/50 p-4 rounded-lg">
              <summary className="text-orange-400 cursor-pointer font-semibold mb-2">
                Error Details
              </summary>
              <pre className="text-sm text-gray-400 overflow-auto">
                {this.state.error?.toString()}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg hover:scale-105 transition-transform"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
