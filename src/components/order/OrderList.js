import { Button, Select, Table, Tag, Tabs, message, notification } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import confirm from "antd/lib/modal/confirm";
import orderApis from "../../apis/orderApis";


const OrderList = ({ listDriver }) => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalRecord, setToTalRecord] = useState(1);
  const [changePlag, setChangePlag] = useState(true);
  const [dataTable, setDataTable] = useState([]);
  const data = [];
  const user = useSelector(state => state.user);
  let listTask = [];
  const { Option } = Select;
  useEffect(() => {
    setLoading(true);
    const params = {
      warehouseManagerId: user.id,
      page: page,
      flag: false,
    };

    const fetchData = async () => {
      const result = await orderApis
        .getOrderList(params)
        .catch((err) => {
          notification.error({
            duration: 2,
            message: "Có lỗi xảy ra trong quá trình tải dữ liệu!",
          });
          setLoading(false);
        });
      setToTalRecord(result.metadata.total);
      let index = 1;
      result && result.data.map((order) => {
        data.push({index: index ++ , ...order});
      });
      setDataTable(data);
      setLoading(false);
    };
    fetchData();
  }, [page, changePlag]);
  const hanldeSelectedDriver = (props) => {
    listTask = listTask.filter((item) => item.id !== props.id);
    listTask.push({ driverId: props.driverId, id: props.id });
    listTask = listTask.filter((item) => item.driverId !== "0");
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
          const result = await orderApis
            .assignDriver(listTask)
            .catch((err) => {
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
      title: "Mã đơn hàng",
      dataIndex: "code",
      key: "code",
      
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Khối lượng",
      dataIndex: "weight",
      key: "weight",
      render: (text) => <div>{text + " kg"}</div>,
    },
    {
      title: "Giá trị",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => <Tag color="geekblue">{text}</Tag>,
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
                id: record.id,
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
        <Link to={`/orderDetails?id=${record.id}`}>Xem chi tiết</Link>
      ),
    },
  ];
  return (
    <>
      <div>
        {/* <h1>Các đơn hàng chưa phân công</h1> */}

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
            total: totalRecord,
            onChange: (page) => {
              setPage(page);
            },
          }}
          loading={loading}
          style={{ margin: 50 }}
          // onRow={(record, rowIndex) => setOnRow()}
        />
      </div>
    </>
  );
};

export default OrderList;
