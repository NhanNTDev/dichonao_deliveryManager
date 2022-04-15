import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import farmOrderApis from "../apis/farmOrderApis";
import { Table, Tag, Button, message, Select, notification } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import userApis from "../apis/userApis";
import confirm from "antd/lib/modal/confirm";
import warehouseApis from "../apis/warehouseApis";
import { useSelector } from "react-redux";
import orderApis from "../apis/orderApis";
const { Option } = Select;
const OrderDetail = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState();
  const orderId = searchParams.get("id");
  const [listDriver, setListDriver] = useState();
  const [changePlag, setChangePlag] = useState(true);
  const [products, setProducts] = useState([]);
  let listTask = [];
  let listProducts = [];

  const warehouse = useSelector((state) => state.warehouse);
  useEffect(() => {
    const fetchDriver = async () => {
      const params = {
        wareHouseId: warehouse.id,
        type: 1,
      };
      const result = await userApis.getListDriverByWarehouseId(params);
      setListDriver(result);
    };
    fetchDriver();
  }, []);
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const result = await orderApis.getOderDetail(orderId);
      setOrder(result);
      if (result.harvestOrders) {
        let index = 1;
        result.harvestOrders.map((harvestOrder) => {
          listProducts.push({ index: index++, ...harvestOrder });
        });
      }
      setProducts(listProducts);
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
          const result = await orderApis
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
    } else showDeleteConfirm();
  };

  const hanldeSelectedDriver = (props) => {
    listTask = listTask.filter((item) => item.id !== props.id);
    listTask.push({ driverId: props.driverId, id: props.id });
    listTask = listTask.filter((item) => item.driverId !== "0");
    console.log(listTask)
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
    },
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
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      key: "total",
    },
  ];

  return (
    <div style={{ marginLeft: 100, marginRight: 100 }}>
      {order && (
        <div style={{ marginLeft: 100, marginBottom: 30 }}>
          <h1>
            <strong>Tên chiến dịch: </strong> {order.campaignName}
          </h1>
          <h1>
            <strong>Mã đơn hàng: </strong> {order.code}
          </h1>
          <h1>
            <strong>Tên khách hàng: </strong> {order.customerName}
          </h1>
          <h1>
            <strong>Số điện thoại: </strong> {order.phone}
          </h1>
          <h1>
            <strong>Địa chỉ: </strong> {order.address}
          </h1>
          <h1>
            <strong>Trạng thái: </strong> {order.status}
          </h1>
          <br />
          <br />
        </div>
      )}
      {order && (
        <h1
          style={{
            display: "inline",
            marginBottom: 50,
            marginRight: 100,
            float: "right",
          }}
        >
          <strong>Người phụ trách: </strong>{" "}
          {order.driverId === null ? (
            <>
              <Select
                defaultValue="0"
                onSelect={(currentValue) => {
                  hanldeSelectedDriver({
                    driverId: currentValue,
                    id: order.id,
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
            <>{order.driverName}</>
          )}
        </h1>
      )}
      <Table
        className="components-table-demo-nested"
        columns={columns}
        dataSource={products}
        pagination={{ position: ["bottomCenter"], pageSize: 10 }}
        loading={loading}
      />
    </div>
  );
};

export default OrderDetail;
