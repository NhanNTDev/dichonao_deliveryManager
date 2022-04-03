import { Table, message } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import shipmentsApis from "../../apis/shipmentsApis";

const ShipmentListAssigned = () => {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalRecord, setToTalRecord] = useState(1);
    const [changePlag, setChangePlag] = useState(true);
    const [dataTable, setDataTable] = useState([]);
    const user = useSelector(state => state.user);
    const data = [];

    useEffect(() => {
      setLoading(true);
      const params = {
        warehouseManagerId: user.id,
        page: page,
        flag: true,
      };
  
      const fetchData = async () => {
        const result = await shipmentsApis
          .getShipmentList(params)
          .catch((err) => {
            message.error({
              duration: 2,
              content: "Có lỗi xảy ra trong quá trình tải dữ liệu!",
            });
            setLoading(false);
          });
        setToTalRecord(result.metadata.total);
        let index = 1;
        result &&
          result.data.map((shipment) => {
            data.push({index: index++, ...shipment});
          });
        setDataTable(data);
        setLoading(false);
      };
      fetchData();
    }, [page, changePlag]);
   
    const columns = [
      {
        title: "Số thứ tự",
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
        title: "Điểm đến",
        dataIndex: "to",
        key: "to",
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
  

export default ShipmentListAssigned;
