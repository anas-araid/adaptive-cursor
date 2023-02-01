import { useMotionValue } from "framer-motion";
import { useState, useEffect } from "react";

const useMousePosition = () => {
  const [ mousePosition, setMousePosition] = useState<{x: number, y:  number}>({
    x: 0,
    y: 0
  });
  // const cursorX = useMotionValue(0);
  // const cursorY = useMotionValue(0);
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      // cursorX.set(e.clientX);
      // cursorY.set(e.clientY);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);
  return mousePosition;
};

export default useMousePosition;