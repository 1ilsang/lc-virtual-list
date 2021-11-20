import { useEffect, useState } from "react";
import { InfiniteLoader, AutoSizer, List, MultiGrid } from "react-virtualized";

const STATUS_LOADING = 1;
const STATUS_LOADED = 2;
const COLUMN_COUNT = 5;

const STYLE_TOP_RIGHT_GRID = {
  borderBottom: "2px solid #aaa",
  fontWeight: "bold",
};

const generateRandomList = (length = 100) => {
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
    console.log("more", startIndex, stopIndex);
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

  const handleCellClick = () => {
    alert("hi");
  };

  const handleCellLoaded = ({ columnIndex, key, rowIndex, style }) => {
    if (rowIndex === 0) {
      return (
        <div key={key} style={style}>
          Header
        </div>
      );
    }
    return (
      <div key={key} style={style} onClick={handleCellClick}>
        {columnIndex}, {rowIndex}
      </div>
    );
  };

  const handleSectionRendered = (params, onRowsRendered) => {
    const { columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex } =
      params;
    const startIndex = rowStartIndex * COLUMN_COUNT + columnStartIndex;
    const stopIndex = rowStopIndex * COLUMN_COUNT + columnStopIndex;

    console.log(startIndex, stopIndex);
    onRowsRendered({ startIndex, stopIndex });
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
        {({ onRowsRendered, registerChild }) => {
          return (
            <AutoSizer disableHeight>
              {({ width }) => (
                <MultiGrid
                  ref={registerChild}
                  fixedRowCount={1}
                  cellRenderer={handleCellLoaded}
                  columnWidth={75}
                  columnCount={COLUMN_COUNT}
                  height={300}
                  rowHeight={40}
                  rowCount={list.length / COLUMN_COUNT}
                  width={width}
                  styleTopRightGrid={STYLE_TOP_RIGHT_GRID}
                  onSectionRendered={(params) =>
                    handleSectionRendered(params, onRowsRendered)
                  }
                />
              )}
            </AutoSizer>
          );
        }}
      </InfiniteLoader>
    </div>
  );
};

export default App;
