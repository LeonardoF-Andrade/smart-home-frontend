import { Outlet } from "react-router-dom";
import Menu from "./components/Menu/menu";

const Layout = () => {
  return (
    <div className="layout-container">
      <Menu />
      <Outlet />
    </div>
  );
};

export default Layout;
