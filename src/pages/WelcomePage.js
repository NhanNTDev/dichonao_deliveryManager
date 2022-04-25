import { Button, Layout, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  ShoppingOutlined,
  DatabaseOutlined,
  CarFilled,
} from "@ant-design/icons";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import FarmOrder from "./FarmOrder";
import FarmOrderDetails from "./FarmOrderDetails";
import Shipment from "./Shipment";
import { useDispatch, useSelector } from "react-redux";
import PrivateRoute from "../router/PrivateRoute";
import DashBoard from "./DashBoard";
import ShipmentDetails from "./ShipmentDetails";
import Order from "./Order";
import Driver from "./Driver";
import { logout } from "../stateManager/userSlice";
import OrderDetail from "./OrderDetail";
import Login from "./Login";
import { setWarehouse } from "../stateManager/warehouseSlice";

const { Header, Sider, Content } = Layout;

const WelcomePage = () => {
  const [state, setState] = useState({
    collapsed: false,
  });
  const user = useSelector((state) => state.user);
  const warehouse = useSelector((state) => state.warehouse);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggle = () => {
    setState({
      collapsed: !state.collapsed,
    });
  };

  const handleLogout = () => {
    const logoutAction = logout();
    const resetWarehouse = setWarehouse(null);
    dispatch(logoutAction);
    dispatch(resetWarehouse);
    navigate("/login");
  };

  return (
    <Layout hasSider={true} style={{ minHeight: 1000 }}>
      {user === null || warehouse === null ? null : (
        <Sider
          style={{ marginTop: 100 }}
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
            <Menu.Item key="0" icon={<DatabaseOutlined />}>
              <Link to="/dashboard">Dash board</Link>
            </Menu.Item>
            <Menu.Item key="1" icon={<ShoppingOutlined />}>
              <Link to="/farm">Đơn hàng cần thu gom</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<CarFilled />}>
              <Link to="/shipment">Chuyến hàng cần vận chuyển</Link>
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
        {user === null || warehouse === null ? null : (
          <Header
            className="site-layout-background"
            style={{
              padding: 0,
              backgroundColor: "#1890ff",
              display: "inline",
              height: 100,
              marginLeft: -300,
            }}
          >
            <div style={{ display: "inline" }}>
              <img src="/logo.png" alt="logo" style={{ marginTop: 30, marginLeft: 50 }}></img>
              <div className="d-flex justify-content-end" style={{marginTop: -30, marginRight: 100}}>
                <h5 style={{ display: "inline" }} style={{marginRight: 30}}>
                  Chào mừng{" "}
                  <strong style={{ color: "red" }}>{user.name}</strong> {"    "}{" "}
                </h5>
                <Button onClick={handleLogout}>Đăng xuất</Button>
              </div>
            </div>
          </Header>
        )}
        <Content
          className="site-layout-background bg-light"
          style={{
            minHeight: 280,
          }}
        >
          <div className="trigger" onClick={toggle} style={{ width: 50 }}>
            {user !== null &&
              warehouse !== null &&
              (state.collapsed ? (
                <MenuUnfoldOutlined style={{ fontSize: 32 }} />
              ) : (
                <MenuFoldOutlined style={{ fontSize: 32 }} />
              ))}
          </div>
          <Routes>
            <Route path="*" element={<Login />}></Route>
            <Route
              path="/dashboard"
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
                  <FarmOrder />
                </PrivateRoute>
              }
            />
            <Route
              path="/farmOrderDetails"
              element={
                <PrivateRoute>
                  <FarmOrderDetails />
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
