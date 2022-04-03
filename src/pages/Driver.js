import { Button, Tabs } from "antd";
import CreateDriver from "../components/driver/CreateDriver";
import DriverList from "../components/driver/DriverList";
const {TabPane} = Tabs;
const Driver = () => {
  return (
    <>
      <div>
      <CreateDriver/>
      <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Tài xế tại chổ" key="1">
            <DriverList type="1"/>
          </TabPane>
          <TabPane tab="Tài xế đường dài" key="2">
          <DriverList type="2"/>
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default Driver;
