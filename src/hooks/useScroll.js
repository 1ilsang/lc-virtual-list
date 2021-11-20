import { useEffect, useRef, useState } from "react";
import useThrottle from "./useThrottle";

const useScroll = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const ref = useRef();

  const handleScroll = (e) => {
    const curScrollTop = e.target.scrollTop;
    console.log("scroll!", curScrollTop);
    requestAnimationFrame(() => {
      setScrollTop(curScrollTop);
    });
  };

  const throttleOnScroll = useThrottle((e) => {
    console.log("Throttled!");
    handleScroll(e);
  });

  useEffect(() => {
    const scrollContainer = ref.current;
    // INTO: THROTTLE SCROLL
    scrollContainer.addEventListener("scroll", throttleOnScroll);
    // INTO: RAW SCROLL
    // scrollContainer.addEventListener("scroll", handleScroll);
    setScrollTop(scrollContainer.scrollTop);

    return () => {
      scrollContainer.removeEventListener("scroll", throttleOnScroll);
      // scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return [scrollTop, ref];
};

export default useScroll;
