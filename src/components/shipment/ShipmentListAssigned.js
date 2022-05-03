import { Table, notification } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import shipmentsApis from "../../apis/shipmentsApis";

const ShipmentListAssigned = ({reload}) => {
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const warehouse = useSelector(state => state.warehouse);
  const data = [];

  useEffect(() => {
    setLoading(true);
    const params = {
      warehouseId: warehouse.id,
      assigned: true,
    };

    const fetchData = async () => {
      const result = await shipmentsApis
        .getShipmentList(params)
        .catch((err) => {
          notification.error({
            duration: 2,
            message: "Có lỗi xảy ra trong quá trình tải dữ liệu!",
          });
          setLoading(false);
        });
      let index = 1;
      result &&
        result.map((shipment) => {
          data.push({ index: index++, ...shipment });
        });
      setDataTable(data);
      setLoading(false);
    };
    fetchData();
  }, [ reload]);

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
      key: "driverName",
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

export default ShipmentListAssigned;
