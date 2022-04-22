import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import userApis from "../apis/userApis";
import OrderList from "../components/order/OrderList";
import OrderListAssigned from "../components/order/OrderListAssigned";

const { TabPane } = Tabs;



const Order = () => {
  
  return (
    <>
      <div className="campaignList">
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Đơn hàng chưa phân công" key="1">
            <OrderList/>
          </TabPane>
          <TabPane tab="Đơn hàng đã phân công" key="2">
            <OrderListAssigned/>
          </TabPane>
        </Tabs>

        <br />
        <br />
      </div>
    </>
  );
};

export default Order;
