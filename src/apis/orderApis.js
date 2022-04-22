import axiosClient from "./axiosClient";

const orderApis = {
  getOrderList(params) {
    const url = `/orders/warehouse/${params.warehouseId}`;
    return axiosClient.get(url, {params});
  },
  assignDriver(data) {
    const url = "/orders/warehouse/update-driver";
    return axiosClient.put(url, data);
  },
  getCollectionOrderDetails(params) {
    const url = `/orders/warehouse/${params.warehouseId}/detail?delivery-code=${params.deliveryCode}`;
    return axiosClient.get(url);
  }
  
};

export default orderApis;
