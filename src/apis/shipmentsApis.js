import axiosClient from "./axiosClient";

const shipmentsApis = {
  getShipmentList(params) {
    const url = `/shipments/warehouse/${params.warehouseManagerId}?flag=${params.flag}`;
    return axiosClient.get(url);
  },

  assignDriver(data) {
    const url = "/shipments/warehouse/assign-work";
    return axiosClient.put(url, data);
  },

  getShipmentDetails(id) {
      const url =`/shipments/${id}`;
      return axiosClient.get(url);
  }
  
};

export default shipmentsApis;