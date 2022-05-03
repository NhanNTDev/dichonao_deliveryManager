import { Tabs } from "antd";
import {  useState } from "react";
import FarmOrderList from "../components/farm/FarmOrderList";
import FarmOrderListAssigned from "../components/farm/FarmOrderListAssigned";

const { TabPane } = Tabs;

const FarmOrder = () => {
  const [reload, setReload] = useState(true);
  return (
    <>
      <div className="campaignList">
        <Tabs defaultActiveKey="1" centered onTabClick={() => setReload(!reload)}>
          <TabPane tab="Đơn hàng chưa phân công" key="1">
            <FarmOrderList reload={reload}/>
          </TabPane>
          <TabPane tab="Đơn hàng đã phân công" key="2">
            <FarmOrderListAssigned reload={reload}/>
          </TabPane>
        </Tabs>

        <br />
        <br />
      </div>
    </>
  );
};

export default FarmOrder;
