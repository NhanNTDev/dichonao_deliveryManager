import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import userApis from "../apis/userApis";
import warehouseApis from "../apis/warehouseApis";
import ShipmentList from "../components/shipment/ShipmentList";
import ShipmentListAssigned from "../components/shipment/ShipmentListAssigned";

const { TabPane } = Tabs;



const Shipment = () => {
  const [listDriver, setListDriver] = useState();
  const warehouse = useSelector(state => state.warehouse);
  useEffect(() => {
    const fetchDriver = async () => {
      const params = {
        wareHouseId: warehouse.id,
        type: 2,
    }
      const result = await userApis.getListDriverByWarehouseId(params);
      setListDriver(result);
      console.log(result);
    }
    fetchDriver();
  }, []);
  return (
    <>
      <div className="campaignList">
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Đơn hàng chưa phân công" key="1">
            <ShipmentList listDriver={listDriver}/>
          </TabPane>
          <TabPane tab="Đơn hàng đã phân công" key="2">
            <ShipmentListAssigned/>
          </TabPane>
        </Tabs>

        <br />
        <br />
      </div>
    </>
  );
};

export default Shipment;
