import { Table, Tag, message } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import farmOrderApis from "../../apis/farmOrderApis";

const FarmListAssigned = () => {
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
      "warehouse-manager-id": user.id,
      page: page,
      flag: true,
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
      result.data.map((farm) => {
        data.push(farm);
      });
      setDataTable(data);
      setLoading(false);
    };
    fetchData();
  }, [page, changePlag]);
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
      render: () => <Tag color="geekblue">Đang chờ lấy hàng</Tag>,
    },
    {
      title: "Người phụ trách",
      dataIndex: "driverName",
      key: "dirverName",
      render: (text) => <div>{text} </div>,
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

export default FarmListAssigned;
