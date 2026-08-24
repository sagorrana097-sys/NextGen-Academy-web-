import React from 'react';
import StudentDashboard from './StudentDashboard';

/**
 * NextGen Academy — Unified Dashboard Route Wrapper
 * Both /student and /parent seamlessly route to the unified student-parent dashboard.
 */
export default function ParentDashboard(props) {
  return <StudentDashboard {...props} />;
}
