const Item = ({ index, height }) => {
  return (
    <div
      style={{ height, backgroundColor: "#fafafa", border: "1px solid black" }}
    >
      <div>Item {index}</div>
    </div>
  );
};

export default Item;
