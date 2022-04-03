import { Form, Input, Button, Spin, message } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import userApis from "../apis/userApis";
import { setUser } from "../stateManager/userSlice";
import { LoadingOutlined } from "@ant-design/icons";
import warehouseApis from "../apis/warehouseApis";
import { setWarehouse } from "../stateManager/warehouseSlice";

const Login = () => {
  const [loginFail, setLoginFail] = useState(false);
  const [loading, setLoading] = useState(false);
  const antIcon = <LoadingOutlined style={{ fontSize: 32 }} spin />;
  const dispatch = useDispatch();

  const onFinish = (values) => {
    setLoginFail(false);
    setLoading(true);
    const login = async () => {
      const result = await userApis
        .login({ username: values.username, password: values.password })
        .catch(() => {
          setLoginFail(true);
          setLoading(false);
        });
      if (result && result.user.role === "warehouseManager") {
        const warehouse = await warehouseApis.getWarehouseByManagerId(result.user.id);
        const setUserAction = setUser({ ...result });
        dispatch(setUserAction);
        const setWarehouseAction = setWarehouse({...warehouse});
        dispatch(setWarehouseAction);
        message.success({
          duration: 3,
          content: "Đăng nhập thành công",
        });
      }
    };
    login();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <h1 style={{ textAlign: "center" }}>Vui lòng đăng nhập để tiếp tục!</h1>
      <br />
      <div style={{ textAlign: "center" }}>
        {loading ? (
          <>
            <Spin indicator={antIcon} /> <br /> <br />{" "}
          </>
        ) : null}
      </div>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
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
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <div style={{textAlign: 'center'}}>
        {loginFail && (
          <span style={{ color: "red"}}>
            Tên đăng nhập hoặc mật khẩu không chính xác!
          </span>
        )}
        </div>
        <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
          <Button type="primary" htmlType="submit">
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
      
    </>
  );
};

export default Login;
