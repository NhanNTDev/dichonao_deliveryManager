import axiosClient from "./axiosClient";

const orderApis = {
  getOrderList(params) {
    const url = `/orders/warehouse/${params.warehouseManagerId}`;
    return axiosClient.get(url, {params});
  },
  assignDriver(data) {
    const url = "/orders/warehouse/update-driver";
    return axiosClient.put(url, data);
  },
  getOderDetail(id) {
    const url = `orders/${id}`;
    return axiosClient.get(url);
  }
  
};

export default orderApis;
