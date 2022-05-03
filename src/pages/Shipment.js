import { Tabs } from "antd";
import { useState } from "react";
import ShipmentList from "../components/shipment/ShipmentList";
import ShipmentListAssigned from "../components/shipment/ShipmentListAssigned";

const { TabPane } = Tabs;

const Shipment = () => {
  const [reload, setReload] = useState(true);
  return (
    <>
      <div className="campaignList">
        <Tabs defaultActiveKey="1" centered onTabClick={() => setReload(!reload)}>
          <TabPane tab="Chuyến hàng chưa phân công" key="1">
            <ShipmentList reload={reload}/>
          </TabPane>
          <TabPane tab="Chuyến hàng đã phân công" key="2">
            <ShipmentListAssigned reload={reload}/>
          </TabPane>
        </Tabs>

        <br />
        <br />
      </div>
    </>
  );
};

export default Shipment;
