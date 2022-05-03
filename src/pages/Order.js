import { Tabs } from "antd";
import { useState } from "react";
import OrderList from "../components/order/OrderList";
import OrderListAssigned from "../components/order/OrderListAssigned";

const { TabPane } = Tabs;

const Order = () => {
  const [reload, setReload] = useState(true);
  return (
    <>
      <div className="campaignList">
        <Tabs
          defaultActiveKey="1"
          centered
          onTabClick={() => setReload(!reload)}
        >
          <TabPane tab="Đơn hàng chưa phân công" key="1">
            <OrderList reload={reload} />
          </TabPane>
          <TabPane tab="Đơn hàng đã phân công" key="2">
            <OrderListAssigned reload={reload} />
          </TabPane>
        </Tabs>

        <br />
        <br />
      </div>
    </>
  );
};

export default Order;
