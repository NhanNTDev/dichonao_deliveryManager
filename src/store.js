import { configureStore } from '@reduxjs/toolkit';
import userReducer from './stateManager/userSlice';
import warehouseReducer from './stateManager/warehouseSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    warehouse: warehouseReducer,
  },
});
