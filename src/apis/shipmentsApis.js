import axiosClient from "./axiosClient";

const shipmentsApis = {
  getShipmentList(params) {
    const url = `/shipments/warehouse/${params.warehouseId}?assigned=${params.assigned}`;
    return axiosClient.get(url);
  },

  assignDriver(data) {
    const url = "/shipments/warehouse/assign-work";
    return axiosClient.put(url, data);
  },

  getShipmentDetails(id) {
      const url =`/shipments/${id}`;
      return axiosClient.get(url);
  },
  deleteShipment(warehouseId) {
      const url = `/shipments/${warehouseId}`;
      return axiosClient.delete(url);
  },
  createShipment(warehouseId) {
    const url = `/shipments/routing-problem/${warehouseId}`;
    return axiosClient.post(url);
  }
  
};

export default shipmentsApis;