import { useState } from "react";
import "./menu.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const Menu = () => {
  const [activePage, setActivePage] = useState(window.location.pathname);
  const navigate = useNavigate();

  const handlePageChange = (page: string) => {
    setActivePage(page);
    navigate(page);
  };

  return (
    <div className="menu">
      <img src={logo} alt="Logo" className="logo" />
      <ul className="menu-options">
        <li>
          <button
            className={activePage === "/inicio" ? "active" : ""}
            onClick={() => handlePageChange("/inicio")}
          >
            Início
          </button>
        </li>
        <li>
          <button
            className={activePage === "/iluminacao" ? "active" : ""}
            onClick={() => handlePageChange("/iluminacao")}
          >
            Iluminação
          </button>
        </li>
        <li>
          <button
            className={activePage === "/varal" ? "active" : ""}
            onClick={() => handlePageChange("/varal")}
          >
            Varal
          </button>
        </li>
        <li>
          <button
            className={activePage === "/jardim" ? "active" : ""}
            onClick={() => handlePageChange("/jardim")}
          >
            Jardim
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
