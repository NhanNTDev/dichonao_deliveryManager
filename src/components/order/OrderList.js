import { Button, Select, Table, Tag, Tabs, message, notification } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import confirm from "antd/lib/modal/confirm";
import orderApis from "../../apis/orderApis";
import userApis from "../../apis/userApis";

const OrderList = ({reload}) => {
  const [loading, setLoading] = useState(false);
  const [changePlag, setChangePlag] = useState(true);
  const [dataTable, setDataTable] = useState([]);
  const [listDriver, setListDriver] = useState();
  const [listDriverClone, setListDriverClone] = useState([]);
  const [listTask, setListTask] = useState([]);
  const data = [];
  const { Option } = Select;
  const warehouse = useSelector((state) => state.warehouse);
  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      const params1 = {
        warehouseId: warehouse.id,
        type: 1,
      };
      await userApis
        .getListDriverByWarehouseId(params1)
        .then((result) => {
          setListDriver(result);
          let list = [];
          result.map((driver) => {
            list.push(driver);
          });
          setListDriverClone(list);
        })
        .catch((err) => {});
      const params = {
        warehouseId: warehouse.id,
        assigned: false,
      };
      await orderApis
        .getOrderList(params)
        .then((result) => {
          let index = 1;
          result &&
            result.map((collection) => {
              data.push({ index: index++, ...collection });
            });
          setDataTable(data);
        })
        .catch((err) => {
          notification.error({
            duration: 2,
            message: "Có lỗi xảy ra trong quá trình tải dữ liệu!",
          });
          setLoading(false);
        });

      setLoading(false);
    };
    fetchData();
  }, [changePlag, reload]);
  const hanldeSelectedDriver = (props) => {
    let list = [...listTask];
    list = list.filter((item) => item.deliveryCode !== props.deliveryCode);
    list.push({
      driverId: props.driverId,
      deliveryCode: props.deliveryCode,
    });
    list = list.filter((item) => item.driverId !== "0");
    let list2 = props.listDriver;
    list.forEach((task) => {
      list2 = list2.filter((driver) => driver.id !== task.driverId);
    });
    setListTask(list);
    setListDriver(list2);
  };
  const showDeleteConfirm = () => {
    confirm({
      title: "Bạn có chắc muốn lưu thay đổi này",
      icon: <ExclamationCircleOutlined />,
      content: "Bấm nút lưu để lưu thay đổi này!",
      okText: "Lưu",
      cancelText: "Hủy",
      onOk() {
        setLoading(true);
        const saveDriverTask = async () => {
  
          const result = await orderApis.assignDriver(listTask).catch((err) => {
            notification.error({
              duration: 2,
              message: "Có lỗi xảy ra trong quá trình xử lý!",
            });
          });
          if (result === "Update successfully!") {
            notification.success({
              duration: 2,
              message: "Lưu thành công!",
            });
            setChangePlag(!changePlag);
          }
          setLoading(false);
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
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Mã nhóm đơn hàng",
      dataIndex: "deliveryCode",
      key: "deliveryCode",
    },
    {
      title: "Tổng khối lượng",
      dataIndex: "totalWeight",
      key: "totalWeight",
      render: (text) => <div>{text + " kg"}</div>,
    },
    {
      title: "Số điểm đến",
      dataIndex: "countAddress",
      key: "countAddress",
      render: (text, record) => <div>{record.addresses.length}</div>,
    },
    {
      title: "Số đơn hàng",
      dataIndex: "countOrder",
      key: "countOrder",
      render: (text, record) => {
        let countOrder = 0;
        record.addresses.map((address) => {
          countOrder = countOrder + address.orders.length;
        });
        return <div>{countOrder}</div>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => <Tag color="orange">{text}</Tag>,
    },
    {
      title: "Người phụ trách",
      dataIndex: "driverName",
      key: "dirverName",
      render: (text, record) => (
        <div className="campaign_name">
          <Select
            defaultValue="0"
            onSelect={(currentValue) => {
              hanldeSelectedDriver({
                driverId: currentValue,
                deliveryCode: record.deliveryCode,
                listDriver: listDriverClone,
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
          </Select>
        </div>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <Link to={`/orderDetails?deliveryCode=${record.deliveryCode}`}>Xem chi tiết</Link>
      ),
    },
  ];
  return (
    <>
      <div>
        <Button
          type="primary"
          size="large"
          style={{
            float: "right",
            marginRight: 150,
            marginBottom: 30,
            borderRadius: 10,
          }}
          onClick={() => {
            handleSave();
          }}
        >
          Lưu thay đổi
        </Button>

        <Table
          columns={columns}
          dataSource={dataTable}
          pagination={{
            position: ["bottomCenter"],
            pageSize: 10,
          }}
          loading={loading}
          style={{ margin: 20 }}
        />
      </div>
    </>
  );
};

export default OrderList;
