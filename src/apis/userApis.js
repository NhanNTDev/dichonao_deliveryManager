import axiosClient from "./axiosClient";

const userApis = {
  getListDriverByWarehouseId(params) {
    const url = `/users/driver-ready/${params.warehouseId}?type=${params.type}`;
    return axiosClient.get(url);
  },
  getListAllDriverByWarehouseId(params) {
    const url = `/users/all/driver/${params.warehouseId}?type=${params.type}`;
    return axiosClient.get(url);
  },
  login(data) {
    const url = `/users/login`;
    return axiosClient.post(url, data);
  },
  createDriver(data) {
    const url = `/users/warehouseManager`;
    return axiosClient.post(url, data);
  },
  banOrUnbanUser(id) {
    const url = `/users/ban-unban/${id}`;
    return axiosClient.delete(url);
  }
};

export default userApis;
