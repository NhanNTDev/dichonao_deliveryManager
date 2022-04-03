import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import userApis from "../apis/userApis";
import warehouseApis from "../apis/warehouseApis";
import FarmList from "../components/farm/FarmList";
import FarmListAssigned from "../components/farm/FarmListAssigned";

const { TabPane } = Tabs;



const Farm = () => {
  const [listDriver, setListDriver] = useState();

  const warehouse = useSelector(state => state.warehouse);
  useEffect(() => {

    const fetchDriver = async () => {
      const params = {
        wareHouseId: warehouse.id,
        type: 1,
    }
      const result = await userApis.getListDriverByWarehouseId(params);
      setListDriver(result);
    }
    fetchDriver();
  }, []);
  
  return (
    <>
      <div className="campaignList">
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Đơn hàng chưa phân công" key="1">
            <FarmList listDriver={listDriver}/>
          </TabPane>
          <TabPane tab="Đơn hàng đã phân công" key="2">
            <FarmListAssigned/>
          </TabPane>
        </Tabs>

        <br />
        <br />
      </div>
    </>
  );
};

export default Farm;
