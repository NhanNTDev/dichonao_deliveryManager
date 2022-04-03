const { createSlice } = require("@reduxjs/toolkit");

const warehouseSlice = createSlice({
  name: "warehouse",
  initialState: JSON.parse(localStorage.getItem("dichonao_warehouse")),
  reducers: {
    setWarehouse(state, action) {
      localStorage.setItem(
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