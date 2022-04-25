import { Form, Input, Select, Button, Modal, notification, Spin } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import validator from "validator";
import userApis from "../../apis/userApis";
import { LoadingOutlined } from "@ant-design/icons";

const { Option } = Select;

const CreateDriver = ({ successCallback }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("Nam");
  const [address, setAddress] = useState("");
  const [type, setType] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [validateMsg, setValidateMsg] = useState("");
  const warehouse = useSelector((state) => state.warehouse);
  const [loading, setLoading] = useState(false);
  const antIcon = <LoadingOutlined style={{ fontSize: 32 }} spin />;
  const showModal = () => {
    setIsModalVisible(true);
  };
  const clearForm = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setGender("Nam");
    setAddress("");
    setName("");
    setValidateMsg("");
  };
  const handleOk = () => {
    const valid = validateAll();
    if (!valid) return;
    const data = {
      userName: username,
      password: password,
      name: name,
      phoneNumber: username,
      address: address,
      email: null,
      gender: gender,
      type: type,
      warehouseId: warehouse.id,
      role: [
        {
          name: "driver",
        },
      ],
    };
    const createDriver = async () => {
      setLoading(true);
      await userApis
        .createDriver(data)
        .then((result) => {
          if (result) {
            notification.success({
              duration: 2,
              message: "Tạo thành công!",
            });
            clearForm();
            successCallback();
            setIsModalVisible(false);
          }
        })
        .catch((err) => {
          if (err.message === "Network Error") {
            notification.error({
              duration: 3,
              message: "Mất kết nối mạng!",
              style: { fontSize: 16 },
            });
          } else {
            notification.error({
              duration: 3,
              message: err.response.data.error.message,
              style: { fontSize: 16 },
            });
          }
        });
      setLoading(false);
    };
    createDriver();
  };

  const handleCancel = () => {
    clearForm();
    setIsModalVisible(false);
  };
  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const onUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const onConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };
  const onNameChange = (e) => {
    setName(e.target.value);
  };

  const onAddressChange = (e) => {
    setAddress(e.target.value);
  };
  const onGenderChange = (value) => {
    setGender(value);
  };
  const onTypeChange = (value) => {
    setType(value);
  };
  const validateUsername = () => {
    if (
      !/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(
        username
      )
    ) {
      setValidateMsg({
        ...validateMsg,
        username: "Số điện thoại không hợp lệ!",
      });
    } else {
      setValidateMsg({ ...validateMsg, username: null });
    }
  };
  const validatePassword = () => {
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
      setValidateMsg({
        ...validateMsg,
        password:
          "Mật khẩu phải bao gồm ít nhất 1 chữ in hoa, 1 chữ thường và tối thiểu 8 ký tự!",
      });
    } else {
      setValidateMsg({ ...validateMsg, password: null });
    }
  };
  const validateConfirmPassword = () => {
    if (confirmPassword !== password) {
      setValidateMsg({
        ...validateMsg,
        confirmPassword: "Mật khẩu không khớp!",
      });
    } else {
      setValidateMsg({ ...validateMsg, confirmPassword: null });
    }
  };
  const validateName = () => {
    if (validator.isEmpty(name.trim())) {
      setValidateMsg({ ...validateMsg, name: "Không được để trống mục này" });
    } else {
      setValidateMsg({ ...validateMsg, name: null });
    }
  };
  const validateAddress = () => {
    if (validator.isEmpty(address.trim())) {
      setValidateMsg({
        ...validateMsg,
        address: "Không được để trống mục này",
      });
    } else {
      setValidateMsg({ ...validateMsg, address: null });
    }
  };
  const validateAll = () => {
    const msg = {};
    if (
      !/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(
        username
      )
    ) {
      msg.username = "Số điện thoại không hợp lệ!";
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
      msg.password =
        "Mật khẩu phải bao gồm ít nhất 1 chữ in hoa, 1 chữ thường và tối thiểu 8 ký tự!";
    }
    if (confirmPassword !== password) {
      msg.confirmPassword = "Mật khẩu không khớp!";
    }
    if (validator.isEmpty(name.trim())) {
      msg.name = "Không được để trống mục này";
    }
    if (validator.isEmpty(address.trim())) {
      msg.address = "Không được để trống mục này";
    }
    setValidateMsg(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
  };
  return (
    <>
      <div>
        <Button onClick={showModal} type="primary" style={{ marginLeft: 100 }}>
          Tạo tài xế mới
        </Button>
      </div>
      <Modal
        centered
        title="Tạo tài khoản cho tài xế"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Hủy"
        okText="Tạo"
      >
        <div className="d-flex justify-content-center">
          {loading ? (
            <>
              <Spin indicator={antIcon} /> <br /> <br />{" "}
            </>
          ) : null}
        </div>
        <Form
          {...layout}
          name="control-hooks"
          labelCol={{ flex: "150px" }}
          labelAlign="left"
          labelWrap
          colon={false}
        >
          <Form.Item name="username" label="Số điện thoại">
            <Input
              value={username}
              onChange={(e) => onUsernameChange(e)}
              onBlur={validateUsername}
            />
            <span style={{ color: "red" }}>{validateMsg.username}</span>
          </Form.Item>
          <Form.Item name="password" label="Mật khẩu">
            <Input.Password
              value={password}
              onChange={(e) => onPasswordChange(e)}
              onBlur={validatePassword}
            />
            <span style={{ color: "red" }}>{validateMsg.password}</span>
          </Form.Item>
          <Form.Item name="confirmPassword" label="Nhập lại mật khẩu">
            <Input.Password
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e)}
              onBlur={validateConfirmPassword}
            />
            <span style={{ color: "red" }}>{validateMsg.confirmPassword}</span>
          </Form.Item>
          <Form.Item name="name" label="Tên tài xế">
            <Input
              value={name}
              onChange={(e) => onNameChange(e)}
              onBlur={validateName}
            />
            <span style={{ color: "red" }}>{validateMsg.name}</span>
          </Form.Item>
          <Form.Item name="gender" label="Giới tính">
            <Select
              placeholder="Chọn giới tính"
              onChange={(value) => onGenderChange(value)}
              value={gender}
              defaultValue={gender}
            >
              <Option value={"Nam"}>Nam</Option>
              <Option value={"Nữ"}>Nữ</Option>
            </Select>
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input.TextArea
              value={address}
              onChange={(e) => onAddressChange(e)}
              onBlur={validateAddress}
            />
            <span style={{ color: "red" }}>{validateMsg.address}</span>
          </Form.Item>
          <Form.Item name="type" label="Loại tài xế">
            <Select
              placeholder="Chọn loại tài xế"
              onChange={(value) => onTypeChange(value)}
              value={type}
              defaultValue={type}
            >
              <Option value={1}>Tài xế tại chổ</Option>
              <Option value={2}>Tài xế đường dài</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <br />
    </>
  );
};

export default CreateDriver;
