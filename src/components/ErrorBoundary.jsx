import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="h-full flex flex-col items-center justify-center px-6 py-12 bg-offwhite"
        >
          <div className="max-w-md text-center space-y-4">
            <span className="text-4xl block" aria-hidden="true">😔</span>
            <h2 className="text-xl font-semibold text-warmgray">
              Something went wrong
            </h2>
            <p className="text-gray-500 leading-relaxed">
              We're sorry about that. Please refresh the page to start over.
              Your previous conversation was not saved.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-teal text-white rounded-xl font-medium hover:bg-teal-dark transition-colors"
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
