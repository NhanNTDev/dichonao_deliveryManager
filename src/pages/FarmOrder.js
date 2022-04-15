import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import userApis from "../apis/userApis";
import FarmOrderList from "../components/farm/FarmOrderList";
import FarmOrderListAssigned from "../components/farm/FarmOrderListAssigned";

const { TabPane } = Tabs;

const FarmOrder = () => {
  const [listDriver, setListDriver] = useState();

  const warehouse = useSelector((state) => state.warehouse);
  // useEffect(() => {
  //   const fetchDriver = async () => {
  //     const params = {
  //       wareHouseId: warehouse.id,
  //       type: 1,
  //     };
  //     const result = await userApis.getListDriverByWarehouseId(params).then(result);
  //     setListDriver(result);
  //   };
  //   fetchDriver();
  // }, []);

  return (
    <>
      <div className="campaignList">
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Đơn hàng chưa phân công" key="1">
            <FarmOrderList/>
          </TabPane>
          <TabPane tab="Đơn hàng đã phân công" key="2">
            <FarmOrderListAssigned />
          </TabPane>
        </Tabs>

        <br />
        <br />
      </div>
    </>
  );
};

export default FarmOrder;
