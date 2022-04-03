import { Form, Input, Select, Button, Modal, message } from "antd";
import InternalPreviewGroup from "antd/lib/image/PreviewGroup";
import { parse } from "query-string";
import { useState } from "react";
import { useSelector } from "react-redux";
import validator from "validator";
import userApis from "../../apis/userApis";

const { Option } = Select;

const CreateDriver = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [validateMsg, setValidateMsg] = useState("");
  const warehouse = useSelector((state) => state.warehouse);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    const clearForm = () => {
      setUsername("");
      setPassword("");
      setName("");
      setPhone("");
      setType("");
    };
    const valid = validateAll();
    if (!valid) return;
    const data = {
      userName: username,
      password: password,
      name: name,
      phoneNumber: phone,
      address: null,
      email: null,
      gender: null,
      type: type,
      warehouseId: warehouse.id,
      role: [
        {
          name: "driver",
        },
      ],
    };
    console.log(data);
    const createDriver = async () => {
      const result = await userApis.createDriver(data).catch((err) => {
        message.error({
          duration: 2,
          content: err.response.data.error.message,
        });
      });
      if (result) {
        message.success({
          duration: 2,
          content: "Tạo thành công!",
        });
        clearForm();
      }
    };
    createDriver();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
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
  const onNameChange = (e) => {
    setName(e.target.value);
  };
  const onPhoneChange = (e) => {
    setPhone(e.target.value);
    console.log(e.target.value);
  };
  const onTypeChange = (value) => {
    setType(value);
    console.log(value);
  };
  const validateAll = () => {
    const msg = {};
    if (username.length < 8) {
      msg.username = "Tên đăng nhập phải chứa ít nhất 8 ký tự";
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
      msg.password =
        "Mật khẩu phải bao gồm ít nhất 1 chữ in hoa, 1 chữ thường và tối thiểu 8 ký tự";
    }
    if (
      !/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(
        phone
      )
    ) {
      msg.phone = "Số điện thoại không hợp lệ";
    }
    if (validator.isEmpty(name)) {
      msg.name = "Không được để trống mục này";
    }
    if (type === "") {
      msg.type = "Không được để trống mục này";
    }
    setValidateMsg(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
  };
  return (
    <>
      <div style={{ textAlign: "left", marginLeft: 200, marginBottom: 50 }}>
        <Button onClick={showModal} type="primary">
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
        <Form {...layout} name="control-hooks">
          <Form.Item name="username" label="Tên đăng nhập">
            <Input value={username} onChange={(e) => onUsernameChange(e)} />
            <span style={{ color: "red" }}>{validateMsg.username}</span>
          </Form.Item>
          <Form.Item name="password" label="Mật khẩu">
            <Input value={password} onChange={(e) => onPasswordChange(e)} />
            <span style={{ color: "red" }}>{validateMsg.password}</span>
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại">
            <Input value={phone} onChange={(e) => onPhoneChange(e)} />
            <span style={{ color: "red" }}>{validateMsg.phone}</span>
          </Form.Item>
          <Form.Item name="name" label="Tên tài xế">
            <Input value={name} onChange={(e) => onNameChange(e)} />
            <span style={{ color: "red" }}>{validateMsg.name}</span>
          </Form.Item>
          <Form.Item name="type" label="Loại tài xế">
            <Select
              placeholder="Chọn loại tài xế"
              onChange={(value) => onTypeChange(value)}
              value={type}
            >
              <Option value={1}>Tài xế tại chổ</Option>
              <Option value={2}>Tài xế đường xa</Option>
            </Select>
            <span style={{ color: "red" }}>{validateMsg.type}</span>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateDriver;
