import { Tabs } from "antd";
import ShipmentList from "../components/shipment/ShipmentList";
import ShipmentListAssigned from "../components/shipment/ShipmentListAssigned";

const { TabPane } = Tabs;

const Shipment = () => {
  
  return (
    <>
      <div className="campaignList">
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Chuyến hàng chưa phân công" key="1">
            <ShipmentList/>
          </TabPane>
          <TabPane tab="Chuyến hàng đã phân công" key="2">
            <ShipmentListAssigned />
          </TabPane>
        </Tabs>

        <br />
        <br />
      </div>
    </>
  );
};

export default Shipment;
