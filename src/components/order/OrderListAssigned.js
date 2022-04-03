import { Table, Tag, message } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import orderApis from "../../apis/orderApis";

const OrderListAssigned = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalRecord, setToTalRecord] = useState(1);
  const [changePlag, setChangePlag] = useState(true);
  const [dataTable, setDataTable] = useState([]);
  const data = [];
  const user = useSelector((state) => state.user);
  useEffect(() => {
    setLoading(true);
    const params = {
      warehouseManagerId: user.id,
      page: page,
      flag: true,
    };
    const fetchData = async () => {
      const result = await orderApis
        .getOrderList(params)
        .catch((err) => {
          message.error({
            duration: 2,
            content: "Có lỗi xảy ra trong quá trình tải dữ liệu!",
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
      <div className="wrapper">
        {/* <h1>Các đơn hàng chưa phân công</h1> */}
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

export default OrderListAssigned;
