import ReactJSONView from "react-json-view";

function Previewer({ data }: { data?: any }) {
  if (!data) {
    return null;
  }

  return (
    <ReactJSONView
      style={{ flex: 1, overflow: "auto", padding: 16, borderRadius: 8 }}
      src={data}
      theme="chalk"
      displayDataTypes={false}
      iconStyle="square"
      collapsed={4}
    />
  );
}

export default Previewer;
