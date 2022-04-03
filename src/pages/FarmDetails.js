import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import farmOrderApis from "../apis/farmOrderApis";
import { Table, Tag, Button, message, Select } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import userApis from "../apis/userApis";
import confirm from "antd/lib/modal/confirm";
import warehouseApis from "../apis/warehouseApis";
import { useSelector } from "react-redux";
const { Option } = Select;
const FarmDetails = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState();
  const farmId = searchParams.get("farmId");
  const [listDriver, setListDriver] = useState();
  const [changePlag, setChangePlag] = useState(true);
  let listTask = [];
  
  const warehouse = useSelector(state => state.warehouse);
  useEffect(() => {
    const fetchDriver = async () => {
      const params = {
        wareHouseId: warehouse.id,
        type: 1,
    }
      const result = await userApis.getListDriverByWarehouseId(params);
      setListDriver(result);
    }
    fetchDriver();
  }, []);
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const result = await farmOrderApis.getFarmOderByFarmId(farmId);
      setOrders(result);
      setLoading(false);
    };
    fetchData();
  }, [changePlag]);

  const showDeleteConfirm = () => {
    confirm({
      title: "Bạn có chắc muốn lưu thay đổi này",
      icon: <ExclamationCircleOutlined />,
      content: "Bấm nút lưu để lưu thay đổi này!",
      okText: "Lưu",
      cancelText: "Hủy",
      onOk() {
        const saveDriverTask = async () => {
          const result = await farmOrderApis
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
    } else showDeleteConfirm();
  };

  const hanldeSelectedDriver = (props) => {
    listTask = listTask.filter((item) => item.farmId !== orders[0].farmId);
    listTask.push({ driverId: props.driverId, farmId: orders[0].farmId });
    listTask = listTask.filter((item) => item.driverId !== "0");
  };

  const RenderexpandedRowRender = (record) => {
    const columns = [
      {
        title: "Tên sản phẩm",
        dataIndex: "productName",
        key: "productName",
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
      },
      {
        title: "Đơn vị",
        dataIndex: "unit",
        key: "unit",
      },
    ];

    return (
      <Table
        style={{ marginLeft: 200, marginRight: "60%" }}
        columns={columns}
        // showHeader={false}
        dataSource={record.harvestOrders}
        pagination={false}
        bordered={true}
        fixed={true}
      />
    );
  };

  const columns = [
    { title: "STT", dataIndex: "id", key: "id" },
    { title: "Mã đơn hàng", dataIndex: "code", key: "code" },
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
      {orders && (
        <div style={{ marginLeft: 100, marginBottom: 30 }}>
          <h1>
            <strong>Tên nông trại: </strong> {orders[0].farmName}
          </h1>
          <h1>
            <strong>Địa chỉ: </strong> {orders[0].farmAddress}
          </h1>
          <h1>
            <strong>Số điện thoại: </strong> {orders[0].phone}
          </h1>
          <br />
          <br />
        </div>
      )}
      {orders && (
        <h1
          style={{
            display: "inline",
            marginBottom: 50,
            marginRight: 100,
            float: "right",
          }}
        >
          <strong>Người phụ trách: </strong>{" "}
          {orders[0].driverId === null ? (
            <>
              <Select
                defaultValue="0"
                onSelect={(currentValue) => {
                  hanldeSelectedDriver({
                    driverId: currentValue,
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
            <>{orders[0].driverName}</>
          )}
        </h1>
      )}
      <Table
        className="components-table-demo-nested"
        columns={columns}
        expandable={{
          expandedRowRender: (record) => RenderexpandedRowRender(record),
          columnWidth: 100,
        }}
        dataSource={orders}
        pagination={{ position: ["bottomCenter"], pageSize: 10 }}
        loading={loading}
      />
    </div>
  );
};

export default FarmDetails;
