import { useRef } from "react";

const useThrottle = (fn, delay = 225) => {
  const timer = useRef(null);

  return (...params) => {
    if (timer.current) return;

    timer.current = setTimeout(() => {
      fn(...params);
      timer.current = null;
    }, delay);
  };
};

export default useThrottle;
