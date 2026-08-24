import React from 'react';

/**
 * Transparent Error Boundary
 * Never blocks the UI with error screens; allows direct, seamless dashboard rendering.
 */
export default class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.warn('[ErrorBoundary Handled Exception]:', error, errorInfo);
  }

  render() {
    return this.props.children;
  }
}
