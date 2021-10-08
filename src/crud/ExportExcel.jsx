import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function ExportExcel(props) {
  return (
    <ExcelFile
      element={
        <Button type="primary" icon={<VerticalAlignBottomOutlined />}>
          Export Data to Excel
        </Button>
      }
    >
      <ExcelSheet data={props.tableData} name={props.formData.entityName}>
          {props.formData.formItemList.map(formItem =><ExcelColumn label={formItem.name} value={formItem.name} />)}
      </ExcelSheet>
    </ExcelFile>
  );
}
