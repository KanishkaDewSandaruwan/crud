import { Button, Empty, message, notification, Popconfirm, Table } from "antd";
import { remove } from "../util/APIUtils";
import { useState } from "react";
import AddForm from "./AddForm";

export default function AddTable(props) {
  const [loading, setLoading] = useState(false);

  function confirm(record) {
    setLoading(true);
    remove(props.formData.entityName, record.key)
      .then(() => {
        props.loadData();
        setLoading(false);
        notification["success"]({
          message: "Removed Successfully",
        });
      })
      .catch((error) => {
        notification["error"]({
          message: error,
        });
      });
  }

  function cancel(e) {
    console.log(e);
    message.error("Click on No");
  }

  let columns = [];
  if (props.tableData.length > 0) {
    columns = props.formData.formItemList.map((k) => {
      let name = "";
      k.name.split("_").forEach((nm) => (name += " " + nm));
      name = name.trim().toUpperCase();
      let rowData = {
        title: name,
        dataIndex: k.name,
        key: k.name,
        sorter: (a, b) => k.type==="inputNumber"?(a[k.name]-b[k.name]):a[k.name].localeCompare(b[k.name]),
        sortDirections: ["descend", "ascend"],
      };
      return rowData;
    });
  }

  columns.push({
    title: "EDIT",
    render: (text, record) => (
      <AddForm
        formValues={record}
        formData={props.formData}
        loadData={props.loadData}
      />
    ),
  });
  columns.push({
    title: "DELETE",
    render: (text, record) => (
      <Popconfirm
        title="Are you sure to delete this record?"
        onConfirm={() => confirm(record)}
        onCancel={cancel}
        okText="Yes"
        cancelText="No"
      >
        <Button loading={loading} type="primary">
          Delete
        </Button>
      </Popconfirm>
    ),
  });

  return (
    <>     
        <Table
          style={{ width: "100%" }}
          columns={columns}
          dataSource={props.tableData}
          loading={props.loading}
          hasData={props.tableData.length === 0 ?false : true}
        />
    </>
  );
}
