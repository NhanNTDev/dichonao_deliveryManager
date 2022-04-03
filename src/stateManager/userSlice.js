

const { createSlice } = require("@reduxjs/toolkit");

const userSlice = createSlice({
  name: "user",
  initialState: JSON.parse(localStorage.getItem("dichonao_delivery_manager")),
  reducers: {
    setUser(state, action) {
      localStorage.setItem(
        "dichonao_delivery_manager",
        JSON.stringify({ ...action.payload.user })
      );
      localStorage.setItem("dichonao_delivery_manager_token", action.payload.token);
      return action.payload.user;
    },
    logout() {
      localStorage.removeItem("dichonao_delivery_manager");
      localStorage.removeItem("dichonao_delivery_manager_token");
      localStorage.removeItem("dichonao_warehouse");
      return null;
    },
  },
});

const { actions, reducer } = userSlice;
export const { setUser, logout } = actions;
export default reducer;
