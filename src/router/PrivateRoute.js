import { useSelector } from "react-redux";
import Login from "../pages/Login";

const PrivateRoute = ({ children }) => {
  const user = useSelector((state) => state.user);
  const warehouse = useSelector((state) => state.warehouse);
  return user !== null && warehouse !== null ? children : <Login />;
};

export default PrivateRoute;
