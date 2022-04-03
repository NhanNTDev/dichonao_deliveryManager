import { Button, Layout, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  ShoppingOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import Farm from "./Farm";
import FarmDetails from "./FarmDetails";
import Shipment from "./Shipment";
import { useDispatch, useSelector } from "react-redux";
import PrivateRoute from "../router/PrivateRoute";
import DashBoard from "./DashBoard";
import ShipmentDetails from "./ShipmentDetails";
import Order from "./Order";
import Driver from "./Driver";
import { logout } from "../stateManager/userSlice";
import OrderDetail from "./OrderDetail";

const { Header, Sider, Content } = Layout;

const WelcomePage = () => {
  const [state, setState] = useState({
    collapsed: false,
  });
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggle = () => {
    setState({
      collapsed: !state.collapsed,
    });
  };

  const handleLogout = () => {
    const logoutAction = logout();
    dispatch(logoutAction);
    navigate("/login");
  }

  return (
    <Layout hasSider={true} style={{minHeight: 1000}}>
      {user === null ? null : (
        <Sider
          theme="dark"
          trigger={null}
          collapsible
          collapsed={state.collapsed}
          width={300}
        >
          <div className="logo" />
          <Menu
            theme="dark"
            style={{ marginTop: 200 }}
            defaultSelectedKeys={["0"]}
          >
            <Menu.Item key="0" icon={<HomeOutlined />}>
              <Link to="/">Dash board</Link>
            </Menu.Item>
            <Menu.Item key="1" icon={<ShoppingOutlined />}>
              <Link to="/farm">Đơn hàng cần thu gom</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<ShoppingOutlined />}>
              <Link to="/shipment">Đơn hàng cần vận chuyển</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<ShoppingOutlined />}>
              <Link to="/order">Đơn hàng cần giao</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<UserOutlined />}>
              <Link to="/driver">Quản lý tài xế</Link>
            </Menu.Item>
          </Menu>
        </Sider>
      )}
      <Layout className="site-layout">
        {user === null ? null : (
          <Header
            className="site-layout-background"
            style={{ padding: 0, backgroundColor: "#1890ff", display: "inline" }}
          >
            {" "}
            <>
              {state.collapsed ? (
                <>
                <div className="trigger" onClick={toggle}>
                  <MenuUnfoldOutlined style={{ fontSize: 32 }} />
                </div>
                </>
              ) : (
                <>
                <div className="trigger" onClick={toggle}>
                  <MenuFoldOutlined style={{ fontSize: 32 }} />
                </div>
                </>
              )}
              <div style={{textAlign: 'right', marginRight: 200, marginTop: -60}}>Chào mừng <strong>{user.name}</strong> {"    "} <Button onClick={handleLogout}>Đăng xuất</Button></div>
              
            </>
          </Header>
        )}
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          <Routes>
            <Route
              path="*"
              element={
                <PrivateRoute>
                  <DashBoard />
                </PrivateRoute>
              }
            />
            <Route
              path="/farm"
              element={
                <PrivateRoute>
                  <Farm />
                </PrivateRoute>
              }
            />
            <Route
              path="/farmDetails"
              element={
                <PrivateRoute>
                  <FarmDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/shipment"
              element={
                <PrivateRoute>
                  <Shipment />
                </PrivateRoute>
              }
            />
            <Route
              path="/shipmentDetails"
              element={
                <PrivateRoute>
                  <ShipmentDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/order"
              element={
                <PrivateRoute>
                  <Order />
                </PrivateRoute>
              }
            />
            <Route
              path="/driver"
              element={
                <PrivateRoute>
                  <Driver />
                </PrivateRoute>
              }
            />
            <Route
              path="/orderDetails"
              element={
                <PrivateRoute>
                  <OrderDetail />
                </PrivateRoute>
              }
            />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default WelcomePage;
