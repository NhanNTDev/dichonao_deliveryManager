const { createSlice } = require("@reduxjs/toolkit");

const warehouseSlice = createSlice({
  name: "warehouse",
  initialState:
    JSON.parse(sessionStorage.getItem("dichonao_warehouse")) === undefined ||
    JSON.parse(sessionStorage.getItem("dichonao_warehouse")) === null
      ? null
      : Object.entries(JSON.parse(sessionStorage.getItem("dichonao_warehouse")))
          .length === 0
      ? null
      : JSON.parse(sessionStorage.getItem("dichonao_warehouse")),
  reducers: {
    setWarehouse(state, action) {
      sessionStorage.setItem(
        "dichonao_warehouse",
        JSON.stringify({ ...action.payload })
      );
      return action.payload;
    },
  },
});

const { actions, reducer } = warehouseSlice;
export const { setWarehouse } = actions;
export default reducer;
