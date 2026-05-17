"use client";

import { useState, useEffect, useRef } from "react";

export default function AnimatedCounter({ end, duration = 1500 }) {
  const [count, setCount] = useState(0);
  const [suffix, setSuffix] = useState("");
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Parse any non-numeric suffix (e.g. "+", "%")
    const cleanEnd = typeof end === "string" ? end : String(end);
    const numericPart = parseInt(cleanEnd.replace(/\D/g, ""), 10) || 0;
    const nonNumericPart = cleanEnd.replace(/[0-9]/g, "");
    setSuffix(nonNumericPart);

    if (numericPart === 0) {
      setCount(cleanEnd);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          
          let startTime = null;
          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic for a beautiful smooth deceleration
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(easeOutCubic * numericPart);
            
            setCount(currentValue);
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(numericPart);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = elementRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [end, duration]);

  return <span ref={elementRef}>{count}{suffix}</span>;
}
