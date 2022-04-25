import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import farmOrderApis from "../apis/farmOrderApis";
import { Table, notification } from "antd";
import { useSelector } from "react-redux";

const FarmOrderDetails = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [listFarm, setListFarm] = useState();
  const collectionCode = searchParams.get("collectionCode");



  
  const warehouse = useSelector(state => state.warehouse);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await farmOrderApis.getCollectionFarmOrderDetail({warehouseId: warehouse.id, collectionCode: collectionCode}).then(result => {
        let index = 1;
        let list = [];
        result.map(farm => {
          list.push({index: index, ...farm});
          index ++;
        })
        setListFarm(list);
      }).catch(() => {
        notification.error({duration: 3,
        message: "Có lỗi xảy ra trong quá trình xử lý!"});
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
          title: "Tên nông trại",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Địa chỉ",
          dataIndex: "address",
          key: "address",
        },
      ];

  return (
    <div style={{ marginLeft: 100, marginRight: 100 }}>
      {listFarm && (
        <div>
          <h1>Danh sách nông trại</h1>
          <br />
        </div>
      )}
     
      <Table
        className="components-table-demo-nested"
        columns={columns}
        dataSource={listFarm}
        pagination={{ position: ["bottomCenter"], pageSize: 10 }}
        loading={loading}
        style={{ margin: 20 }}
      />
    </div>
  );
};

export default FarmOrderDetails;
