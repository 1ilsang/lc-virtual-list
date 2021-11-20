import { useCallback, useEffect, useState } from "react";
import useScroll from "../hooks/useScroll";
import fetchItem from "../mockApi/fetchItem";
import Item from "./Item";

const itemHeight = 48;
const scrollViewPortHeight = 480;

const VirtualList = ({ filterKeyword }) => {
  const [scrollTop, scrollContainerRef] = useScroll();
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [page, setPage] = useState(0);

  const totalItemCount = Math.max(list.length, 30);
  const containerHeight = Math.max(
    scrollViewPortHeight,
    itemHeight * totalItemCount
  );
  const startIndex = Math.max(Math.floor(scrollTop / itemHeight), 0);
  const offsetY = startIndex * itemHeight;
  const visibleNodes = list.slice(
    startIndex,
    startIndex + scrollViewPortHeight / itemHeight
  );

  const getItem = useCallback(async () => {
    const apiData = {
      result: undefined,
      success: undefined,
    };

    try {
      const data = await fetchItem(page);
      apiData.result = data;
      apiData.success = true;
    } catch (e) {
      console.error(e);
      apiData.success = false;
    }

    if (!apiData.success) {
      alert("API call error!");
      return;
    }

    console.log("getItem!", page);
    setList(list.concat(apiData.result));
  }, [page]);

  useEffect(() => {
    if (typeof filterKeyword === "undefined") return;
    if (filterKeyword.length === 0) {
      setFilteredList([]);
      return;
    }

    const filteredList = list.filter(
      ({ index }) => index % filterKeyword === 0
    );
    setFilteredList(filteredList);
  }, [filterKeyword]);

  useEffect(() => {
    getItem();
  }, [page]);

  useEffect(() => {
    const BUFFER_AREA = scrollViewPortHeight / 3;
    if (scrollTop + scrollViewPortHeight >= containerHeight - BUFFER_AREA) {
      setPage(page + 1);
    }
  }, [scrollTop]);

  return (
    <div
      ref={scrollContainerRef}
      style={{
        border: "1px solid black",
        width: 200,
        margin: "auto",
        height: scrollViewPortHeight,
        overflowY: "auto",
      }}
    >
      <div style={{ height: containerHeight, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            width: "100%",
            transform: `translateY(${offsetY}px)`,
          }}
        >
          {(filteredList.length > 0 ? filteredList : visibleNodes).map(
            ({ index, url }) => (
              <Item key={index} url={url} index={index} height={itemHeight} />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualList;
