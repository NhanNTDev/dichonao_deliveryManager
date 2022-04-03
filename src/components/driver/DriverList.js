import { Button, Select, Table, Tag, Tabs, message } from "antd";
import { useEffect, useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import farmOrderApis from "../../apis/farmOrderApis";
import confirm from "antd/lib/modal/confirm";
import userApis from "../../apis/userApis";

const DriverList = ({ type }) => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [changePlag, setChangePlag] = useState(true);
  const [dataTable, setDataTable] = useState([]);
  const data = [];
  const warehouse = useSelector((state) => state.warehouse);
  useEffect(() => {
    setLoading(true);
    const params = {
      wareHouseId: warehouse.id,
      type: type,
    };

    const fetchData = async () => {
      const result = await userApis
        .getListAllDriverByWarehouseId(params)
        .catch((err) => {
          message.error({
            duration: 2,
            content: "Có lỗi xảy ra trong quá trình tải dữ liệu!",
          });
          setLoading(false);
        });
      let index = 1;
      result &&
        result.map((driver) => {
          data.push({ index: index++, ...driver });
        });
      setDataTable(data);
      console.log(result);
      setLoading(false);
    };
    fetchData();
  }, [page, changePlag]);

  const showBanConfirm = (props) => {
    console.log(props);
    confirm({
      title: "Xác nhận khóa tài khoản",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắn muốn khóa tài khoản của ${props.name}!`,
      okText: "Khóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk() {
        const banDriver = async () => {
          const result = await userApis
            .banOrUnbanUser(props.id)
            .catch((err) => {
              message.error({
                duration: 2,
                content: "Có lỗi xảy ra trong quá trình xử lý!",
              });
            });
          if (result === "Successfully") {
            message.success({
              duration: 2,
              content: "Khóa tài khoản thành công!",
            });
            setChangePlag(!changePlag);
          }
        };
        banDriver();
      },
      onCancel() {},
    });
  };

  const showUnbanConfirm = (props) => {
    console.log(props);
    confirm({
      title: "Xác nhận mở khóa tài khoản",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắn muốn mở khóa tài khoản của ${props.name}!`,
      okText: "Mở Khóa",
      cancelText: "Hủy",
      onOk() {
        const unbanDriver = async () => {
          const result = await userApis
            .banOrUnbanUser(props.id)
            .catch((err) => {
              message.error({
                duration: 2,
                content: "Có lỗi xảy ra trong quá trình xử lý!",
              });
            });
          if (result === "Successfully") {
            message.success({
              duration: 2,
              content: "Mở khóa tài khoản thành công!",
            });
            setChangePlag(!changePlag);
          }
        };
        unbanDriver();
      },
      onCancel() {},
    });
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên tài xế",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => <>{text === "Đã bị khóa" ? <Tag color="red">{text}</Tag> : <Tag color="geekblue">{text}</Tag> }</>,
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <div>
          {record.active ? (
            <>
              <Button
                onClick={() => showBanConfirm({ ...record })}
                type="primary"
                danger
              >
                Khóa
              </Button>
            </>
          ) : (
            <Button
              onClick={() => showUnbanConfirm({ ...record })}
              type="primary"
            >
              Kích hoạt
            </Button>
          )}
        </div>
      ),
    },
  ];
  return (
    <>
      <div>
        <Table
          columns={columns}
          dataSource={dataTable}
          pagination={{
            position: ["bottomCenter"],
            pageSize: 10,
            onChange: (page) => {
              setPage(page);
            },
          }}
          loading={loading}
          style={{ margin: 50 }}
        />
      </div>
    </>
  );
};

export default DriverList;
