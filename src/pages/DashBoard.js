import { notification, Spin, Tag } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import warehouseApis from "../apis/warehouseApis";
import { LoadingOutlined } from "@ant-design/icons";

const Dashboard = () => {
  const [count, setCount] = useState({
    farmOrdersCollect: 0,
    shipmentsTransport: 0,
    ordersDelivery: 0,
    drivers: 0,
  });
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const warehouse = useSelector((state) => state.warehouse);
  const antIcon = <LoadingOutlined style={{ fontSize: 32 }} spin />;
  useEffect(() => {
    const getDashboardCount = async () => {
      await warehouseApis
        .getDashboardCount(warehouse.id)
        .then((result) => {
          setCount(result);
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
              message: "Có lỗi xảy ra trong quá trình xử lý!",
              style: { fontSize: 16 },
            });
          }
        });
      setLoading(false);
    };
    user && getDashboardCount();
  }, [user]);
  return (
    <div className="col main pt-5 mt-3">
      <h5 className="mt-3 mb-3 text-secondary">Tổng quan</h5>

      <div className="row mb-3">
        <div className="col-xl-3 col-sm-6 py-2">
          <div className="card bg-success text-white h-100">
            <div
              className="card-body bg-success "
              style={{ backgroundColor: "#57b960" }}
            >
              <div className="rotate">
                <i className="fa fa-shopping-bag fa-4x"></i>
              </div>
              <h6 className="text-uppercase">Đơn hàng cần thu gom</h6>
              <h1 className="display-4 d-flex justify-content-center">
                {loading ? (
                  <Spin indicator={antIcon} />
                ) : (
                  count.farmOrdersCollect
                )}
              </h1>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 py-2">
          <div className="card text-white bg-danger h-100">
            <div className="card-body bg-danger">
              <div className="rotate">
                <i className="fa fa-truck fa-4x"></i>
              </div>
              <h6 className="text-uppercase">Chuyến hàng cần vận chuyển</h6>
              <h1 className="display-4 d-flex justify-content-center">
                {loading ? (
                  <Spin indicator={antIcon} />
                ) : (
                  count.shipmentsTransport
                )}
              </h1>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 py-2">
          <div className="card text-white bg-info h-100">
            <div className="card-body bg-info">
              <div className="rotate">
                <i className="fa fa-shopping-bag fa-4x"></i>
              </div>
              <h6 className="text-uppercase">Đơn hàng cần giao</h6>
              <h1 className="display-4 d-flex justify-content-center">
                {loading ? <Spin indicator={antIcon} /> : count.ordersDelivery}
              </h1>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 py-2">
          <div className="card text-white bg-warning h-100">
            <div className="card-body">
              <div className="rotate">
                <i className="fa fa-user fa-4x"></i>
              </div>
              <h6 className="text-uppercase">Tài xế</h6>
              <h1 className="display-4 d-flex justify-content-center">
                {loading ? <Spin indicator={antIcon} /> : count.drivers}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div className="row ">
        {warehouse && (
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h5 className="mt-3 mb-3 text-secondary">Thông tin kho</h5>
            <br />
            <div className="card text-white bg-light h-100">
              <div className="card-body">
                <h5>
                  <strong>Tên kho: </strong>
                  {warehouse.name}
                </h5>
                <h5>
                  <strong>Địa chỉ: </strong>
                  {warehouse.address}
                </h5>
                <h5>
                  <strong>Khu vực: </strong>
                  {warehouse.wareHouseZones.map((wareHouseZone) => {
                    return (
                      <Tag style={{ margin: 10 }} color="success">
                        {wareHouseZone.wareHouseZoneName}
                      </Tag>
                    );
                  })}
                </h5>
              </div>
            </div>
          </div>
        )}
        {user && (
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h5 className="mt-3 mb-3 text-secondary">
              Thông tin người quản lý
            </h5>
            <br />
            <div className="card text-white bg-light h-100">
              <div className="card-body">
                <h5>
                  <strong>Người quản lý: </strong>
                  {user.name}
                </h5>
                <h5>
                  <strong>Giới tính: </strong>
                  {user.gender}
                </h5>
                <h5>
                  <strong>Số điện thoại: </strong>
                  {user.phoneNumber}
                </h5>
                <h5>
                  <strong>Địa chỉ: </strong>
                  {user.address}
                </h5>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
