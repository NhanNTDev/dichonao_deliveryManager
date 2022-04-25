import { Form, Input, Button, Spin, message, notification, Space } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import userApis from "../apis/userApis";
import { setUser } from "../stateManager/userSlice";
import { LoadingOutlined } from "@ant-design/icons";
import warehouseApis from "../apis/warehouseApis";
import { setWarehouse } from "../stateManager/warehouseSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loginFail, setLoginFail] = useState(false);
  const [loading, setLoading] = useState(false);
  const antIcon = <LoadingOutlined style={{ fontSize: 32 }} spin />;
  const user = useSelector((state) => state.user);
  const warehouse = useSelector((state) => state.warehouse);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (user !== null && warehouse !== null) {
      navigate("/dashboard");
    }
  }, []);
  const onFinish = (values) => {
    setLoginFail(false);
    setLoading(true);
    const login = async () => {
      const loginResult = await userApis
        .login({ username: values.username, password: values.password })
        .catch(() => {
          setLoginFail(true);
          setLoading(false);
        });
      if (loginResult && loginResult.user.role === "warehouseManager") {
        await warehouseApis
          .getWarehouseByManagerId(loginResult.user.id)
          .then((result) => {
            const setUserAction = setUser({ ...loginResult });
            dispatch(setUserAction);
            const setWarehouseAction = setWarehouse({ ...result });
            dispatch(setWarehouseAction);
            navigate("/dashboard");
            notification.success({
              duration: 3,
              message: "Đăng nhập thành công",
            });
          })
          .catch((err) => {
            if (err.message === "Network Error") {
              notification.error({
                duration: 3,
                message: "Mất kết nối mạng!",
                style: { fontSize: 16 },
              });
            } else if (err.response.status === 404) {
              notification.error({
                duration: 3,
                message: "Tài khoản chưa quản lý kho nào!",
                style: { fontSize: 16 },
              });
            } else {
              notification.error({
                duration: 3,
                message: "Có lỗi xảy ra trong quá trình xử lý!",
                style: { fontSize: 16 },
              });
            }
          });
      }
      setLoading(false);
    };
    login();
  };

  return (
    <>
      <br />
      <br />
      <h1 style={{ textAlign: "center" }}>Trang đăng nhập quản lý kho</h1>
      <br />
      <div style={{ textAlign: "center" }}>
        {loading ? (
          <>
            <Spin indicator={antIcon} /> <br /> <br />{" "}
          </>
        ) : null}
      </div>
      <div className="d-flex justify-content-center">
        <div
          style={{
            border: "solid 1px",
            margin: 30,
            padding: 30,
            width: "500px",
          }}
        >
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
            onFinish={onFinish}
            style={{ width: "100%" }}
            labelCol={{ flex: "150px" }}
            labelAlign="left"
            labelWrap
            wrapperCol={{ flex: 1 }}
            colon={false}
          >
            <h5 className="d-flex justify-content-center">
              Vui lòng đăng nhập để tiếp tục!
            </h5>
            <br />
            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[{ required: true, message: "Vui lòng nhập mục này!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mục này!" }]}
            >
              <Input.Password />
            </Form.Item>
            <div style={{ textAlign: "center" }}>
              {loginFail && (
                <span style={{ color: "red" }}>
                  Tên đăng nhập hoặc mật khẩu không chính xác!
                </span>
              )}
            </div>
            <div className="d-flex justify-content-center">
              <Button type="primary" htmlType="submit">
                Đăng nhập
              </Button>
            </div>
          </Form>{" "}
        </div>
      </div>
    </>
  );
};

export default Login;
