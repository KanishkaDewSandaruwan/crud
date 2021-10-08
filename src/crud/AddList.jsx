import { Row, Input, Col, Popconfirm, Button, notification } from "antd";
import { useEffect, useState } from "react";
import { getAll, removeAll } from "../util/APIUtils";
import AddForm from "./AddForm";
import AddTable from "./AddTable";
import ExportExcel from "./ExportExcel";
import ImportExcel from "./ImportExcel";

const { Search } = Input;

export default function AddList(props) {
  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSearch = (value) => {
    setSearchText(value.target.value.toLowerCase());
  };

  const loadData = () => {
    setLoading(true);
    getAll(props.formData.entityName).then((data) => {
      setLoading(false);
      setTableData(data);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  let fiteredData = [...tableData];
  if (searchText) {
    fiteredData = fiteredData.map((d) => {
      let searchText = "";
      props.formData.filterColumns.forEach((column) => {
        searchText = searchText + " " + d[column];
      });
      d.searchText = searchText.toLowerCase();

      return d;
    });

    fiteredData = fiteredData.filter((item) =>
      item.searchText.includes(searchText)
    );
  }

  const deleteAllData = () => {
    setLoading(true);
    removeAll(props.formData.entityName)
      .then((result) => {
        loadData();
        setLoading(false);
        notification["success"]({
          message: "All Deleted Successfully",
        });
      })
      .catch((error) => {
        setLoading(false);
        notification["error"]({
          message: error,
        });
      });
  };

  return (
    <>
      <Row>
        <h2>{props.moduleName}</h2>
      </Row>
      <Row style={{ margin: 20 }} justify="space-around">
        <Col>
          <AddForm formData={props.formData} loadData={loadData} />
        </Col>
        <Col>
          <ImportExcel formData={props.formData} loadData={loadData} />
        </Col>
        {tableData.length>0? (
          <Col>
            <ExportExcel tableData={tableData} formData={props.formData} />
          </Col>
        ) : null}
        {tableData.length>0? (
          <Col>
            <Popconfirm
              title={"Are you sure to delete all the records?"}
              onConfirm={deleteAllData}
              okText="Yes"
              cancelText="No"
            >
              <Button loading={loading} type="primary">Delete all records</Button>
            </Popconfirm>
          </Col>
        ) : null}
        {tableData.length>0 ? (
          <Col span={10}>
            <Input placeholder="search" onChange={onSearch} allowClear />
          </Col>
        ) : null}
      </Row>
      {props.table ? (
        <Row justify="center">
          <AddTable
            formData={props.formData}
            tableData={fiteredData}
            loadData={loadData}
            loading={loading}
          />
        </Row>
      ) : null}
    </>
  );
}
