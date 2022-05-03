import { Button, Select, Table, Tag, Tabs, message, notification } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import farmOrderApis from "../../apis/farmOrderApis";
import confirm from "antd/lib/modal/confirm";
import userApis from "../../apis/userApis";

const FarmOrderList = ({reload}) => {
  const [loading, setLoading] = useState(false);
  const [changePlag, setChangePlag] = useState(true);
  const [dataTable, setDataTable] = useState([]);
  const warehouse = useSelector((state) => state.warehouse);
  const [listDriver, setListDriver] = useState();
  const [listDriverClone, setListDriverClone] = useState([]);
  const [listTask, setListTask] = useState([]);
  const { Option } = Select;
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const params = {
        warehouseId: warehouse.id,
        type: 1,
      };
      await userApis
        .getListDriverByWarehouseId(params)
        .then((result) => {
          setListDriver(result);
          let list = [];
          result.map((driver) => {
            list.push(driver);
          });
          setListDriverClone(list);
        })
        .catch((err) => {
          notification.error({
            duration: 2,
            message: "Có lỗi xảy ra trong quá trình tải tài xế!",
            style: { fontSize: 16 },
          });
        });
      await farmOrderApis
        .getFarmOrderForDelivery({ warehouseId: warehouse.id, assigned: false })
        .then((result) => {
          let index = 1;
          let data = [];
          result &&
            result.map((colection) => {
              data.push({ index: index++, ...colection });
            });
          setDataTable(data);
        })
        .catch((err) => {
          notification.error({
            duration: 2,
            message: "Có lỗi xảy ra trong quá trình tải dữ liệu!",
          });
        });
      setLoading(false);
    };
    fetchData();
  }, [changePlag, reload]);
  const hanldeSelectedDriver = (props) => {
    let list = [...listTask];
    list = list.filter((item) => item.collectionCode !== props.collectionCode);
    list.push({
      driverId: props.driverId,
      collectionCode: props.collectionCode,
    });
    list = list.filter((item) => item.driverId !== "0");
    let list2 = props.listDriver;
    list.forEach((task) => {
      list2 = list2.filter((driver) => driver.id !== task.driverId);
    });
    setListTask(list);
    setListDriver(list2);
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
          await farmOrderApis
            .assignDriver(listTask)
            .then((result) => {
              if (result === "Update Successfully!") {
                notification.success({
                  duration: 2,
                  message: "Lưu thành công!",
                });
              }
            })
            .catch((err) => {
              notification.error({
                duration: 2,
                message: "Có lỗi xảy ra trong quá trình xử lý!",
              });
            });
          setLoading(false);
          setChangePlag(!changePlag);
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
      title: "Mã nhóm đơn hàng",
      dataIndex: "collectionCode",
      key: "collectionCode",
    },
    {
      title: "Tổng khối lượng",
      dataIndex: "totalWeight",
      key: "totalWeight",
      render: (text) => <div>{text + " kg"}</div>,
    },
    {
      title: "Số nông trại",
      dataIndex: "countFarm",
      key: "countFarm",
      render: (text, record) => <div>{record.farms.length}</div>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => <Tag color="geekblue">Đang chờ lấy hàng</Tag>,
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
                collectionCode: record.collectionCode,
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
        <Link to={`/farmOrderDetails?collectionCode=${record.collectionCode}`}>
          Xem chi tiết
        </Link>
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

export default FarmOrderList;
