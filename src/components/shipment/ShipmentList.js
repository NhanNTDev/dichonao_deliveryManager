import { Button, Select, Table, notification } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import confirm from "antd/lib/modal/confirm";
import { useSelector } from "react-redux";
import shipmentsApis from "../../apis/shipmentsApis";
import userApis from "../../apis/userApis";

const ShipmentList = ({reload}) => {
  const [loading, setLoading] = useState(false);
  const [changePlag, setChangePlag] = useState(true);
  const [dataTable, setDataTable] = useState([]);
  const data = [];
  const [listDriver, setListDriver] = useState();
  const warehouse = useSelector((state) => state.warehouse);
  const [listDriverClone, setListDriverClone] = useState([]);
  const [listTask, setListTask] = useState([]);
  const { Option } = Select;

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      const params1 = {
        warehouseId: warehouse.id,
        type: 2,
      };
      await userApis.getListDriverByWarehouseId(params1).then((result) => {
        setListDriver(result);
        let list = [];
        result.map((driver) => {
          list.push(driver);
        });
        setListDriverClone(list);
      }).catch(err => {});
      const params2 = {
        warehouseId: warehouse.id,
        assigned: false,
      };
      await shipmentsApis
        .getShipmentList(params2)
        .then((result) => {
          let index = 1;
          result &&
            result.map((shipment) => {
              data.push({ index: index++, ...shipment });
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
    list = list.filter((item) => item.id !== props.id);
    list.push({ driverId: props.driverId, id: props.id });
    list = list.filter((item) => item.driverId !== "0");
    let list2 = props.listDriver;
    list.forEach((task) => {
      list2 = list2.filter((driver) => driver.id !== task.driverId);
    });
    setListTask(list);
    setListDriver(list2);
  };
  const showCreateShipmentConfirm = () => {
    confirm({
      title: "Bạn có chắc muốn tạo mới chuyến hàng!",
      icon: <ExclamationCircleOutlined />,
      content:
        "Việc tạo mới chuyến hàng sẽ xóa các chuyến hàng cũ mà chưa có tài xế đảm nhận!",
      okText: "Tạo",
      cancelText: "Hủy",
      onOk() {
        setLoading(true);
        const createShipment = async () => {
          let deleteSuccess = false;
          await shipmentsApis
            .deleteShipment(warehouse.id)
            .then((rs) => {
              deleteSuccess = true;
            })
            .catch(() => {
              notification.error({
                duration: 3,
                message: "Có lỗi xảy ra trong quá trình xử lý!",
                style: { fontSize: 16 },
              });
            });
          if (deleteSuccess) {
            await shipmentsApis
              .createShipment(warehouse.id)
              .then((result) => {
                setChangePlag(!changePlag);
              })
              .catch((err) => {
                if (err.message === "Network Error") {
                  notification.error({
                    duration: 3,
                    message: "Mất kết nối mạng",
                    style: { fontSize: 16 },
                  });
                } else if (err.response.status === 404) {
                  notification.error({
                    duration: 3,
                    message: "Có lỗi xảy ra trong quá trình xử lý!",
                    style: { fontSize: 16 },
                  });
                } else {
                  notification.error({
                    duration: 3,
                    message: err.response.data.error.message,
                    style: { fontSize: 16 },
                  });
                }
              });
          }
          setLoading(false);
        };
        createShipment();
      },
      onCancel() {},
    });
  };
  const showSaveConfirm = () => {
    confirm({
      title: "Bạn có chắc muốn lưu thay đổi này",
      icon: <ExclamationCircleOutlined />,
      content: "Bấm nút lưu để lưu thay đổi này!",
      okText: "Lưu",
      cancelText: "Hủy",
      onOk() {
        setLoading(true);
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
    } else showSaveConfirm();
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Điểm đi",
      dataIndex: "from",
      key: "from",
    },
    {
      title: "Tổng Khối lượng",
      dataIndex: "totalWeight",
      key: "totalWeight",
      render: (text) => <div>{text + " kg"}</div>,
    },
    {
      title: "Người phụ trách",
      dataIndex: "driverName",
      key: "dirverName",
      render: (text, record) => (
        <div>
          <Select
            defaultValue="0"
            onSelect={(currentValue) => {
              hanldeSelectedDriver({
                driverId: currentValue,
                id: record.id,
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
        <Link to={`/shipmentDetails?id=${record.id}`}>Xem chi tiết</Link>
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
        <Button
          type="primary"
          size="large"
          style={{
            float: "right",
            marginRight: 20,
            marginBottom: 30,
            borderRadius: 10,
          }}
          onClick={() => {
            showCreateShipmentConfirm();
          }}
        >
          Tạo mới chuyến hàng
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

export default ShipmentList;
