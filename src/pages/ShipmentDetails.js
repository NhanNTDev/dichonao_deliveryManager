import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import farmOrderApis from "../apis/farmOrderApis";
import { Table, Tag, Button, message, Select } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import userApis from "../apis/userApis";
import confirm from "antd/lib/modal/confirm";
import shipmentsApis from "../apis/shipmentsApis";
const { Option } = Select;
const ShipmentDetails = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [shipment, setShipment] = useState();
  const shipmentId = searchParams.get("id");
  const [dataTable, setDataTable] = useState();
  const [listDriver, setListDriver] = useState();
  const [changePlag, setChangePlag] = useState(true);
  let listTask = [];
  let listOrder = [];

  useEffect(() => {
    const fetchDriver = async () => {
      const params = {
        wareHouseId: 3,
        type: 2,
      };
      const result = await userApis.getListDriverByWarehouseId(params);
      setListDriver(result);
    };
    fetchDriver();
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const result = await shipmentsApis.getShipmentDetails(shipmentId);
      let index = 1;
      result.orders.map((order) => {
        listOrder.push({ index: index, ...order });
        index++;
      });
      setShipment(result);
      setDataTable(listOrder);
      setLoading(false);
    };
    fetchData();
  }, [changePlag]);

  const showUpdateConfirm = () => {
    confirm({
      title: "Bạn có chắc muốn lưu thay đổi này",
      icon: <ExclamationCircleOutlined />,
      content: "Bấm nút lưu để lưu thay đổi này!",
      okText: "Lưu",
      cancelText: "Hủy",
      onOk() {
        const saveDriverTask = async () => {
          const result = await shipmentsApis
            .assignDriver(listTask)
            .catch((err) => {
              message.error({
                duration: 2,
                content: "Có lỗi xảy ra trong quá trình xử lý!",
              });
            });
          if (result === "Update Successfully!") {
            message.success({
              duration: 2,
              content: "Lưu thành công!",
            });
            setChangePlag(!changePlag);
          }
        };
        saveDriverTask();
      },
      onCancel() {},
    });
  };
  const handleSave = () => {
    if (listTask.length === 0) {
      message.error({
        duration: 2,
        content: "Vui lòng chọn tài xế phụ trách!",
      });
    } else showUpdateConfirm();
  };

  const hanldeSelectedDriver = (props) => {
    listTask = listTask.filter((item) => item.id !== props.id);
    listTask.push({ driverId: props.driverId, id: props.id });
    listTask = listTask.filter((item) => item.driverId !== "0");
  };

  const columns = [
    { title: "STT", dataIndex: "index", key: "index" },
    { title: "Mã đơn hàng", dataIndex: "code", key: "code" },
    { title: "Tên khách hàng", dataIndex: "customerName", key: "customerName" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => <Tag color="geekblue">{text}</Tag>,
    },
    { title: "Ghi chú", dataIndex: "note", key: "note" },
    { title: "Ngày tạo", dataIndex: "createAt", key: "createAt" },
    // { title: "Hành động", key: "operation", render: () => <a>Publish</a> },
  ];

  return (
    <div style={{ marginLeft: 100, marginRight: 100 }}>
      {shipment && (
        <div style={{ marginLeft: 100, marginBottom: 30 }}>
          <h1>
            <strong>Mã chuyến hàng: </strong> {shipment.code}
          </h1>
          <h1>
            <strong>Điểm đi: </strong> {shipment.from}
          </h1>
          <h1>
            <strong>Điểm đến </strong> {shipment.to}
          </h1>
          <br />
          <br />
        </div>
      )}
      {shipment && (
        <h1
          style={{
            display: "inline",
            marginBottom: 50,
            marginRight: 100,
            float: "right",
          }}
        >
          <strong>Người phụ trách: </strong>{" "}
          {shipment.driverId === null ? (
            <>
              <Select
                defaultValue="0"
                onSelect={(currentValue) => {
                  hanldeSelectedDriver({
                    driverId: currentValue,
                    id: shipment.id,
                  });
                }}
              >
                <Option key="0" value="0">
                  Chọn tài xế
                </Option>
                {listDriver &&
                  listDriver.map((driver) => {
                    return (
                      <Option key={driver.id} value={driver.id}>
                        {driver.name}
                      </Option>
                    );
                  })}
              </Select>{" "}
              <Button
                style={{ marginLeft: 50 }}
                type="primary"
                onClick={handleSave}
              >
                Cập Nhật
              </Button>
            </>
          ) : (
            <>{shipment.driverName}</>
          )}
        </h1>
      )}
      {shipment && (
        <>
          <h2 style={{ textAlign: "left"}}>Danh sách đơn hàng</h2>
          <Table
            className="components-table-demo-nested"
            columns={columns}
            dataSource={dataTable}
            pagination={{ position: ["bottomCenter"], pageSize: 10 }}
            loading={loading}
          />
        </>
      )}
    </div>
  );
};

export default ShipmentDetails;
