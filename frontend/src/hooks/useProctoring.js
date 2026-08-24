import { useEffect, useRef, useState, useCallback } from 'react';
import { proctoringAPI } from '../services/api';

/**
 * Custom Hook: useProctoring
 * Real-time tab activity tracking using Page Visibility API + Blur/Focus events
 * Automatically sends SMS notifications for EXAM_START, EXAM_ABANDON, CLASS_JOIN, and TAB_SWITCH (>5s hidden)
 */
export function useProctoring({
  type = 'EXAM', // 'EXAM' | 'CLASS'
  name = 'মডেল টেস্ট',
  className = '',
  studentId = null,
  enabled = true,
  isSubmitted = false
}) {
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [lastWarning, setLastWarning] = useState(null);

  const hiddenTimerRef = useRef(null);
  const isSubmittedRef = useRef(isSubmitted);
  isSubmittedRef.current = isSubmitted;

  const triggerEvent = useCallback(async (eventType, customName = null) => {
    if (!enabled) return;
    try {
      await proctoringAPI.sendEvent({
        eventType,
        examName: customName || name,
        className,
        studentId
      });
    } catch (err) {
      console.warn('[Proctoring Event Error]:', err.message);
    }
  }, [enabled, name, className, studentId]);

  useEffect(() => {
    if (!enabled) return;

    // Trigger 1 / Trigger 3: Session Start on mount
    const startEvent = type === 'CLASS' ? 'CLASS_JOIN' : 'EXAM_START';
    triggerEvent(startEvent);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsTabHidden(true);
        // Start 5-second timer for tab switch / cheat attempt detection
        hiddenTimerRef.current = setTimeout(() => {
          setTabSwitchCount((prev) => prev + 1);
          setLastWarning('সতর্কতা: ট্যাব পরিবর্তনের কারণে অভিভাবকের ফোনে স্বয়ংক্রিয় SMS পাঠানো হয়েছে।');
          triggerEvent('TAB_SWITCH');
        }, 5000);
      } else {
        setIsTabHidden(false);
        if (hiddenTimerRef.current) {
          clearTimeout(hiddenTimerRef.current);
          hiddenTimerRef.current = null;
        }
      }
    };

    const handleBlur = () => {
      if (!hiddenTimerRef.current && !document.hidden) {
        hiddenTimerRef.current = setTimeout(() => {
          setTabSwitchCount((prev) => prev + 1);
          setLastWarning('সতর্কতা: উইন্ডো ফোকাস হারানোর কারণে প্রক্টরিং সতর্কতা রেকর্ড করা হয়েছে।');
          triggerEvent('TAB_SWITCH');
        }, 5000);
      }
    };

    const handleFocus = () => {
      if (hiddenTimerRef.current) {
        clearTimeout(hiddenTimerRef.current);
        hiddenTimerRef.current = null;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);

      if (hiddenTimerRef.current) {
        clearTimeout(hiddenTimerRef.current);
      }

      // Trigger 2: If unmounting exam before clicking Submit, send EXAM_ABANDON
      if (type === 'EXAM' && !isSubmittedRef.current) {
        triggerEvent('EXAM_ABANDON');
      }
    };
  }, [enabled, type, triggerEvent]);

  return {
    tabSwitchCount,
    isTabHidden,
    lastWarning,
    clearWarning: () => setLastWarning(null)
  };
}
