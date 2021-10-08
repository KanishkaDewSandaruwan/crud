import { VerticalAlignTopOutlined } from "@ant-design/icons";
import { Button, notification, Upload } from "antd";
import { parsePhoneNumber } from "libphonenumber-js";
import readXlsxFile from "read-excel-file";
import { getMaxId, addMany, uniqueCheckList } from "../util/APIUtils";
import { useState } from "react";

export default function ImportExcel(props) {
  const [loading, setLoading] = useState(false);

  let schema = {};

  const getType = (type) => {
    let dataType = null;
    switch (type) {
      case "input":
        dataType = String;
        break;
      case "inputNumber":
        dataType = Number;
        break;
      case "date":
        dataType = Date;
        break;
      case "phone":
        dataType = (value) => {
          const number = parsePhoneNumber(value);
          if (!number) {
            throw new Error("invalid");
          }
          return number;
        };
        break;
      case "select":
        dataType = String;
        break;
      case "email":
        dataType = (value) => {
          var mailformat = /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/;
          if (value.match(mailformat)) {
            return String;
          } else {
            throw new Error("invalid");
          }
        };
        break;
      default:
        dataType = String;
    }
    return dataType;
  };
  props.formData.formItemList.forEach((item) => {
    let itemObj = {
      prop: item.name,
      type: getType(item.type),
      required: item.required,
    };
    schema[item.name] = itemObj;
  });

  const handleFileChange1 = async (data) => {
    setLoading(true);
    let isValid = true;
    let processed = false;
    let rowData = await readXlsxFile(data, { schema });
    let count = 0;
    console.log("rowData", rowData);
    if (rowData) {
      if (rowData.errors.length > 0 || rowData.rows.length === 0) {
        notification["error"]({
          message: "File Not valid",
        });
        setLoading(false);
        return false;
      } else {
        props.formData.uniqueColumns.forEach((column) => {
          let uniqueItems = [
            ...new Set(rowData.rows.map((row) => row[column])),
          ];
          if (uniqueItems.length !== rowData.rows.length) {
            isValid = false;
            notification["error"]({
              message: `Duplicate ${column}  Found Try again`,
            });
            setLoading(false);
            return false;
          } else {
            uniqueCheckList(uniqueItems, props.formData.entityName, column)
              .then((result) => {
                count++;
                if (!result) {
                  isValid = false;
                  notification["error"]({
                    message: `Duplicate Error ${column} already Exist Try again`,
                  });
                  setLoading(false);
                  return false;
                } else if (
                  isValid &&
                  count === props.formData.uniqueColumns.length
                ) {
                  getMaxId(props.formData.entityName)
                    .then((id) => {
                      let key = id;
                      let reqList = rowData.rows.map((row) => {
                        row.key = key;
                        key++;
                        return row;
                      });
                      addMany(reqList, props.formData.entityName)
                        .then((res) => {
                          if (res.ok) {
                            notification["success"]({
                              message: "uploaded successfully",
                            });
                            props.loadData();
                            setLoading(false);
                            return false;
                          } else {
                            notification["error"]({
                              message: "Something went wrong",
                            });
                            setLoading(false);
                            return false;
                          }
                        })
                        .catch((error) => {
                          isValid = false;
                          setLoading(false);
                          notification["error"]({
                            message: error.message,
                          });
                          return false;
                        });
                    })
                    .catch((error) => {
                      isValid = false;
                      setLoading(false);
                      notification["error"]({
                        message: error.message,
                      });
                      return false;
                    });
                } else if (count === props.formData.uniqueColumns.length) {
                  setLoading(false);
                  return false;
                }
              })
              .catch((error) => {
                isValid = false;
                setLoading(false);
                notification["error"]({
                  message: error.message,
                });
                return false;
              });
          }
        });
      }
    }
  };

  return (
    <>
      <Upload
        accept=".xlsx"
        action={null}
        fileList={[]}
        beforeUpload={handleFileChange1}
      >
        <Button
          loading={loading}
          type="primary"
          icon={<VerticalAlignTopOutlined />}
        >
          Import Excel Data
        </Button>
      </Upload>
    </>
  );
}
