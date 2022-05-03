import { Table, Tag, notification } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import farmOrderApis from "../../apis/farmOrderApis";

const FarmOrderListAssigned = ({ reload }) => {
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const data = [];
  const warehouse = useSelector((state) => state.warehouse);
  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      await farmOrderApis
        .getFarmOrderForDelivery({ warehouseId: warehouse.id, assigned: true })
        .then((result) => {
          let index = 1;
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

export default FarmOrderListAssigned;
