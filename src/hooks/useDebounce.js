import { useRef } from "react";

const useDebounce = (fn, delay = 225) => {
  const timer = useRef(null);

  return (...params) => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      console.log("Debounce fire!", params);
      fn(...params);
      timer.current = null;
    }, delay);
  };
};

export default useDebounce;
