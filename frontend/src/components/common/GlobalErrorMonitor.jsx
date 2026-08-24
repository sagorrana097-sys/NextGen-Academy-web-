import React from 'react';

/**
 * Transparent Error Boundary
 * Prevents UI crash overlays and ensures smooth uninterrupted dashboard rendering.
 */
export default class GlobalErrorMonitor extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.warn('[GlobalErrorMonitor Caught Error]:', error, errorInfo);
  }

  render() {
    return this.props.children;
  }
}
