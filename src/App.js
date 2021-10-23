import { useEffect, useState } from "react";
import { InfiniteLoader, AutoSizer, List } from "react-virtualized";

const STATUS_LOADING = 1;
const STATUS_LOADED = 2;

const generateRandomList = (length = 1000) => {
  const list = Array(length)
    .fill({})
    .map((item, index) => ({ name: index, selected: false }));
  return list;
};

const originList = generateRandomList();

const App = () => {
  const [list, setList] = useState(originList);
  const [loadedRowCount, setLoadedRowCount] = useState(0);
  const [loadedRowsMap, setLoadedRowsMap] = useState({});
  const [loadingRowCount, setLoadingRowCount] = useState(0);

  const timeoutIdMap = {};

  const clearData = () => {
    setList(originList);
    setLoadedRowCount(0);
    setLoadedRowsMap({});
    setLoadingRowCount(0);
  };

  const handleRowLoaded = ({ index }) => !!loadedRowsMap[index];
  const handleMoreRows = ({ startIndex, stopIndex }) => {
    const increment = stopIndex - startIndex + 1;

    for (let i = startIndex; i <= stopIndex; i++) {
      loadedRowsMap[i] = STATUS_LOADING;
    }

    setLoadingRowCount(loadingRowCount + increment);

    let promiseResolver;
    const timeoutId = setTimeout(() => {
      if (timeoutIdMap[timeoutId]) delete timeoutIdMap[timeoutId];

      for (let i = startIndex; i <= stopIndex; i++) {
        loadedRowsMap[i] = STATUS_LOADED;
      }

      setLoadingRowCount(
        (prevLoadingRowCount) => prevLoadingRowCount - increment
      );
      setLoadedRowCount((prevLoadedRowCount) => prevLoadedRowCount + increment);

      promiseResolver();
    }, 1000 + Math.round(Math.random() * 1000));

    timeoutIdMap[timeoutId] = true;

    return new Promise((resolve) => {
      promiseResolver = resolve;
    });
  };

  const handleRowRenderer = ({ index, key, style }) => {
    const row = list[index];
    let content;

    if (loadedRowsMap[index] === STATUS_LOADED) {
      content = row.name;
    } else {
      content = "loading...";
    }

    return (
      <div
        key={key}
        style={style}
        onClick={() => {
          // TODO: Row render
          row.selected = true;
        }}
      >
        {content}
      </div>
    );
  };

  useEffect(() => {
    return () => {
      Object.keys(timeoutIdMap).forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
    };
  }, []);

  return (
    <div>
      <div>
        <h1>length: {list.length}</h1>
        <button onClick={() => setList((prev) => [...prev, ...prev])}>
          x2
        </button>
        <button onClick={clearData}>clear</button>
      </div>
      <h2>
        {loadingRowCount} loading... {loadedRowCount} loaded
      </h2>
      <InfiniteLoader
        isRowLoaded={handleRowLoaded}
        loadMoreRows={handleMoreRows}
        rowCount={list.length}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer>
            {({ width }) => (
              <List
                ref={registerChild}
                height={200}
                onRowsRendered={onRowsRendered}
                rowCount={list.length}
                rowHeight={({ index }) => {
                  // return index === 0 ? 50 : 30;
                  return list[index].selected ? 50 : 30;
                }}
                width={width}
                rowRenderer={handleRowRenderer}
              />
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    </div>
  );
};

export default App;
