import { useEffect, useState } from "react";
import VirtualList from "./list/VirtualList";
import useDebounce from "./hooks/useDebounce";

const App = () => {
  const [inputText, setInputText] = useState();
  const [offsetY, setOffsetY] = useState(0);

  const handleInputChange = (e) => {
    if (!e.target) return;
    const { value } = e.target;
    console.log("input change!", value);
    setInputText(value);
  };

  const debouncedHandler = useDebounce(handleInputChange);

  useEffect(() => {
    setTimeout(() => {
      setOffsetY(50);
    }, 4000);
  }, []);

  return (
    <>
      <input type="text" onChange={debouncedHandler} />
      <VirtualList filterKeyword={inputText} />
      <div
        width={50}
        style={{
          backgroundColor: "red",
          transform: `translateY(${offsetY}px)`,
        }}
      >
        .
      </div>
    </>
  );
};

export default App;
