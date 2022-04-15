import { Tabs } from "antd";
import DriverList from "../components/driver/DriverList";
const { TabPane } = Tabs;
const Driver = () => {
  return (
    <>
      <div>
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Tài xế tại chổ" key="1">
            
            <DriverList type="1" />
          </TabPane>
          <TabPane tab="Tài xế đường dài" key="2">
            <DriverList type="2" />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default Driver;
