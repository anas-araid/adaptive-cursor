import { useState, useEffect } from "react";

// unused
const useMousePosition = () => {
  const [ mousePosition, setMousePosition] = useState<{x: number, y:  number}>({
    x: 0,
    y: 0
  });
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
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