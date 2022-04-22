import axiosClient from "./axiosClient";

const farmOrderApis = {
  getFarmOrderForDelivery(params) {
    const url = `/farm-orders/warehouse-manager?warehouse-id=${params.warehouseId}&assigned=${params.assigned}`;
    return axiosClient.get(url);
  },
  getFarmOderByFarmId(id) {
    const url = `/farm-orders/farm/${id}`;
    return axiosClient.get(url);
  },
  assignDriver(data) {
    const url = "/farm-orders/update-driver";
    return axiosClient.put(url, data);
  },
  getCollectionFarmOrderDetail(params) {
    const url = `/farm-orders/warehouse-manager/${params.warehouseId}/collection/${params.collectionCode}`;
    return axiosClient.get(url);
  }
};

export default farmOrderApis;
