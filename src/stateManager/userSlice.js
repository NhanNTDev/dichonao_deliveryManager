

const { createSlice } = require("@reduxjs/toolkit");
const userSlice = createSlice({
  name: "user",
  initialState: JSON.parse(sessionStorage.getItem("dichonao_delivery_manager")),
  reducers: {
    setUser(state, action) {
      sessionStorage.setItem(
        "dichonao_delivery_manager",
        JSON.stringify({ ...action.payload.user })
      );
      sessionStorage.setItem("dichonao_delivery_manager_token", action.payload.token);
      return action.payload.user;
    },
    logout() {
      sessionStorage.removeItem("dichonao_delivery_manager");
      sessionStorage.removeItem("dichonao_delivery_manager_token");
      sessionStorage.removeItem("dichonao_warehouse");
      return null;
    },
  },
});

const { actions, reducer } = userSlice;
export const { setUser, logout } = actions;
export default reducer;
