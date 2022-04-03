import { Button, Select, Table, Tag, Tabs, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import farmOrderApis from "../../apis/farmOrderApis";
import confirm from "antd/lib/modal/confirm";

const FarmList = ({ listDriver }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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
      "warehouse-manager-id": user.id,
      page: page,
      flag: false,
    };

    const fetchData = async () => {
      const result = await farmOrderApis
        .getFarmOrderForDelivery(params)
        .catch((err) => {
          message.error({
            duration: 2,
            content: "Có lỗi xảy ra trong quá trình tải dữ liệu!",
          });
          setLoading(false);
        });
      setToTalRecord(result.metadata.total);
      result && result.data.map((farm) => {
        data.push(farm);
      });
      setDataTable(data);
      console.log(data);
      setLoading(false);
    };
    fetchData();
  }, [page, changePlag]);
  const hanldeSelectedDriver = (props) => {
    listTask = listTask.filter((item) => item.farmId !== props.farmId);
    listTask.push({ driverId: props.driverId, farmId: props.farmId });
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
  let count = 0;
  const columns = [
    {
      title: "Mã nông trại",
      dataIndex: "farmId",
      key: "farmId",
      
    },
    {
      title: "Tên nông trại",
      dataIndex: "farmName",
      key: "farmName",
    },
    {
      title: "Địa chỉ",
      dataIndex: "farmAddress",
      key: "farmAddress",
    },
    {
      title: "Số đơn hàng",
      dataIndex: "countFarmOrder",
      key: "countFarmOrder",
    },
    {
      title: "Khối lượng",
      dataIndex: "weight",
      key: "weight",
      render: (text) => <div>{text + " kg"}</div>,
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
        <div className="campaign_name">
          <Select
            defaultValue="0"
            onSelect={(currentValue) => {
              hanldeSelectedDriver({
                driverId: currentValue,
                farmId: record.farmId,
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
        <Link to={`/farmDetails?farmId=${record.farmId}`}>Xem chi tiết</Link>
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

export default FarmList;
