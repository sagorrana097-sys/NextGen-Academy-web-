import React, { useState, useEffect, useRef } from 'react';

// Global Z-Index stack manager
let topZIndex = 100;
export const getNextZIndex = () => ++topZIndex;

/**
 * High-performance, butter-smooth draggable floating container
 * Uses CSS 3D Transforms (translate3d) + Pointer Events for 60fps dragging
 * Supports mouse & multi-touch gestures, auto-bounds checking, and localStorage persistence.
 */
export default function DraggableFloatingContainer({
  id = 'widget',
  initialPosition = { x: 20, y: 100 },
  className = '',
  style = {},
  children,
  handleSelector = '[data-drag-handle]',
  onDragStart,
  onDragEnd,
  minimized = false,
  width = 'auto',
  height = 'auto'
}) {
  const [position, setPosition] = useState(() => {
    try {
      const saved = localStorage.getItem(`nextgen_pos_${id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return parsed;
        }
      }
    } catch (e) {}
    return initialPosition;
  });

  const [zIndex, setZIndex] = useState(() => getNextZIndex());
  const [isDragging, setIsDragging] = useState(false);
  const elementRef = useRef(null);
  const dragDataRef = useRef({
    startX: 0,
    startY: 0,
    elemX: 0,
    elemY: 0,
    active: false,
    hasMoved: false,
    rafId: null
  });

  // Bring widget to top of stack when clicked
  const bringToFront = () => {
    const nextZ = getNextZIndex();
    setZIndex(nextZ);
  };

  // Keep inside viewport on window resize
  useEffect(() => {
    const handleResize = () => {
      if (!elementRef.current) return;
      const rect = elementRef.current.getBoundingClientRect();
      const maxX = Math.max(10, window.innerWidth - (rect.width || 100) - 10);
      const maxY = Math.max(10, window.innerHeight - (rect.height || 60) - 10);

      setPosition(prev => {
        const clampedX = Math.min(Math.max(10, prev.x), maxX);
        const clampedY = Math.min(Math.max(10, prev.y), maxY);
        return { x: clampedX, y: clampedY };
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerDown = (e) => {
    // Check if clicked inside an interactive button, input, link, or custom non-drag area
    const isInteractive = e.target.closest('button, input, select, textarea, a, [data-no-drag]');
    const isHandle = handleSelector ? e.target.closest(handleSelector) : true;

    // If handleSelector is specified, require click on handle; if clicked on interactive element inside handle, skip
    if (!isHandle || isInteractive) {
      bringToFront();
      return;
    }

    // Start drag
    e.preventDefault();
    bringToFront();
    setIsDragging(true);

    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;

    dragDataRef.current = {
      startX: clientX,
      startY: clientY,
      elemX: position.x,
      elemY: position.y,
      active: true,
      hasMoved: false,
      rafId: null
    };

    if (onDragStart) onDragStart();

    const onPointerMove = (moveEvent) => {
      if (!dragDataRef.current.active) return;

      const curX = moveEvent.clientX ?? (moveEvent.touches && moveEvent.touches[0]?.clientX) ?? 0;
      const curY = moveEvent.clientY ?? (moveEvent.touches && moveEvent.touches[0]?.clientY) ?? 0;

      const deltaX = curX - dragDataRef.current.startX;
      const deltaY = curY - dragDataRef.current.startY;

      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        dragDataRef.current.hasMoved = true;
      }

      if (dragDataRef.current.rafId) {
        cancelAnimationFrame(dragDataRef.current.rafId);
      }

      dragDataRef.current.rafId = requestAnimationFrame(() => {
        const elemW = elementRef.current?.offsetWidth || 100;
        const elemH = elementRef.current?.offsetHeight || 60;

        const maxX = Math.max(10, window.innerWidth - elemW - 10);
        const maxY = Math.max(10, window.innerHeight - elemH - 10);

        const newX = Math.min(Math.max(10, dragDataRef.current.elemX + deltaX), maxX);
        const newY = Math.min(Math.max(10, dragDataRef.current.elemY + deltaY), maxY);

        setPosition({ x: newX, y: newY });
      });
    };

    const onPointerUp = () => {
      dragDataRef.current.active = false;
      setIsDragging(false);

      if (dragDataRef.current.rafId) {
        cancelAnimationFrame(dragDataRef.current.rafId);
      }

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      // Save position to localStorage
      try {
        setPosition(cur => {
          localStorage.setItem(`nextgen_pos_${id}`, JSON.stringify(cur));
          return cur;
        });
      } catch (err) {}

      if (onDragEnd) onDragEnd(dragDataRef.current.hasMoved);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  return (
    <div
      ref={elementRef}
      onPointerDown={handlePointerDown}
      onClick={bringToFront}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        zIndex,
        touchAction: 'none',
        willChange: isDragging ? 'transform' : 'auto',
        ...style
      }}
      className={`select-none no-print ${
        isDragging ? 'cursor-grabbing opacity-95 scale-[1.02] shadow-2xl transition-none' : 'transition-transform duration-75'
      } ${className}`}
    >
      {typeof children === 'function' ? children({ isDragging, position, bringToFront }) : children}
    </div>
  );
}
