import { Tabs } from "antd";
import { useState } from "react";
import DriverList from "../components/driver/DriverList";
const { TabPane } = Tabs;
const Driver = () => {
  const [reload, setReload] = useState(true);
  return (
    <>
      <div>
        <Tabs defaultActiveKey="1" centered onTabClick={()=>setReload(!reload)}>
          <TabPane tab="Tài xế tại chổ" key="1">
            <DriverList type="1" reload={reload}/>
          </TabPane>
          <TabPane tab="Tài xế đường dài" key="2">
            <DriverList type="2" reload={reload}/>
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default Driver;
