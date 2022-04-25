import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Table, Tag, Button, Select, notification, Timeline } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import userApis from "../apis/userApis";
import confirm from "antd/lib/modal/confirm";
import shipmentsApis from "../apis/shipmentsApis";
import { useSelector } from "react-redux";
import { parseTimeDMY } from "../utils/Utils";
const { Option } = Select;
const ShipmentDetails = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [shipment, setShipment] = useState();
  const shipmentId = searchParams.get("id");
  const [dataTable, setDataTable] = useState();
  const [listDriver, setListDriver] = useState();
  const [changePlag, setChangePlag] = useState(true);
  const warehouse = useSelector((state) => state.warehouse);
  let listTask = [];

  useEffect(() => {
    const fetchDriver = async () => {
      const params = {
        wareHouseId: warehouse.id,
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
      await shipmentsApis.getShipmentDetails(shipmentId).then((result) => {
        let index = 1;
        let listOrder = [];
        result.orders
          .map((order) => {
            listOrder.push({ index: index, ...order });
            index++;
          })
          
        setShipment(result);
        setDataTable(listOrder);
      }).catch((err) => {});

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
              notification.error({
                duration: 2,
                message: "Có lỗi xảy ra trong quá trình xử lý!",
              });
            });
          if (result === "Update Successfully!") {
            notification.success({
              duration: 2,
              message: "Lưu thành công!",
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
      notification.error({
        duration: 2,
        message: "Vui lòng chọn tài xế phụ trách!",
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
    // { title: "Ghi chú", dataIndex: "note", key: "note" },
    {
      title: "Ngày tạo",
      dataIndex: "createAt",
      key: "createAt",
      render: (text) => <div>{parseTimeDMY(text)}</div>,
    },
    // { title: "Hành động", key: "operation", render: () => <a>Publish</a> },
  ];

  return (
    <div style={{ marginLeft: 100, marginRight: 100 }}>
      <h2>
        <strong>Thông tin chuyến hàng</strong>
      </h2>
      {shipment && (
        <div style={{ marginLeft: 100, marginBottom: 30 }}>
          <h4>
            <strong>1. Mã chuyến hàng: </strong> <span>{shipment.code}</span>
          </h4>
          <h4>
            <strong>2. Điểm đi: </strong> {shipment.from}
          </h4>
          <h4>
            <strong style={{ display: "inline" }}>3. Điểm đến: </strong>{" "}
            {shipment.to}
            <Timeline style={{ marginLeft: 200 }}>
              {shipment && shipment.shipmentDestinations.map(destinations => (
                 <Timeline.Item>
                 <h4>{destinations.address}</h4>
               </Timeline.Item>
              ))}
            </Timeline>
          </h4>

          <br />
          <br />
        </div>
      )}
      {shipment && (
        <h3
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
                style={{ marginLeft: 10 }}
                type="primary"
                onClick={handleSave}
              >
                Cập Nhật
              </Button>
            </>
          ) : (
            <>{shipment.driverName}</>
          )}
        </h3>
      )}
      {shipment && (
        <>
          <h2 style={{ textAlign: "left" }}>
            <strong>Danh sách đơn hàng</strong>
          </h2>
          <Table
            className="components-table-demo-nested"
            columns={columns}
            dataSource={dataTable}
            pagination={{ position: ["bottomCenter"], pageSize: 10 }}
            loading={loading}
            style={{ margin: 20 }}
          />
        </>
      )}
    </div>
  );
};

export default ShipmentDetails;
