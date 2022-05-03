import { Table, Tag, notification } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import orderApis from "../../apis/orderApis";

const OrderListAssigned = ({reload}) => {
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const data = [];
  const warehouse = useSelector((state) => state.warehouse);
  useEffect(() => {
    setLoading(true);
    const params = {
      warehouseId: warehouse.id,
      assigned: true,
    };

    const fetchData = async () => {
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
  }, [reload]);
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
      <div className="wrapper">
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

export default OrderListAssigned;
