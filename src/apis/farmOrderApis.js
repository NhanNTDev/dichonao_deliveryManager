import axiosClient from "./axiosClient";

const farmOrderApis = {
  getFarmOrderForDelivery(params) {
    const url = `/farm-orders/warehouse-manager`;
    return axiosClient.get(url, {params});
  },
  getFarmOderByFarmId(id) {
    const url = `farm-orders/farm/${id}`;
    return axiosClient.get(url);
  },
  assignDriver(data) {
    const url = "/farm-orders/update-driver";
    return axiosClient.put(url, data);
  }
};

export default farmOrderApis;
