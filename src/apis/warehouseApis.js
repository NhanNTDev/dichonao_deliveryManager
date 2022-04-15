import axiosClient from "./axiosClient";

const warehouseApis = {
    getWarehouseByManagerId(managerId) {
        const url = `/ware-houses/manager/${managerId}`;
        return axiosClient.get(url);
    },
    getDashboardCount (managerId) {
        const url = `/ware-houses/dashboard/${managerId}`;
        return axiosClient.get(url);
    }
}

export default warehouseApis;