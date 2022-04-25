import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Table, notification, } from "antd";
import { useSelector } from "react-redux";
import orderApis from "../apis/orderApis";
const OrderDetail = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [listAddress, setListAddress] = useState([]);
  const deliveryCode = searchParams.get("deliveryCode");
  

  const warehouse = useSelector((state) => state.warehouse);
 
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await orderApis.getCollectionOrderDetails({warehouseId: warehouse.id, deliveryCode: deliveryCode}).then(result => {
        let list = []
        let index = 1;
        result.map((address) => {
          list.push({ index: index++, ...address });
        });
        setListAddress(list);
      }).catch(err => {
        notification.error({duration: 2, message: "Có lỗi xảy ra trong quá trình xử lý!", style:{fontSize: 16}})
      });
     
      
      setLoading(false);
    };
    fetchData();
  }, []);


  
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Điểm đến",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Số đơn hàng",
      dataIndex: "countOrder",
      key: "countOrder",
      render: (text, record) => (<div>{record.orders.length}</div>)
    },
    {
      title: "Tổng khối lượng",
      dataIndex: "weight",
      key: "weight",
      render: (text) => (<div>{text + " Kg"}</div>)
    },
   
  ];

  return (
    <div>
        <h1>Danh sách điểm đến</h1>
      <Table
        columns={columns}
        dataSource={listAddress}
        pagination={{ position: ["bottomCenter"], pageSize: 10 }}
        loading={loading}
        style={{ margin: 20 }}
      />
    </div>
  );
};

export default OrderDetail;
