import { useState } from "react";
import "./menu.css";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const [activePage, setActivePage] = useState(window.location.pathname); /////OBs:

  const handlePageChange = async (page: string) => {
    setActivePage(page);
    navigate(page);
  };

  const navigate = useNavigate();

  return (
    <div className="menu">
      <ul className="menu-options">
        <li>
          <button
            className={activePage === "/inicio" ? "active" : ""}
            onClick={() => {
              handlePageChange("/inicio");
            }}
          >
            Início
          </button>
        </li>
        <li>
          <button
            className={activePage === "/iluminacao" ? "active" : ""}
            onClick={async () => {
              await handlePageChange("/iluminacao");
            }}
          >
            Iluminação
          </button>
        </li>
        <li>
          <button
            className={activePage === "/varal" ? "active" : ""}
            onClick={() => {
              handlePageChange("/varal");
            }}
          >
            Varal
          </button>
        </li>
        <li>
          <button
            className={activePage === "/portao" ? "active" : ""}
            onClick={() => {
              handlePageChange("/portao");
            }}
          >
            Portão
          </button>
        </li>
        <li>
          <button
            className={activePage === "/personalizar" ? "active" : ""}
            onClick={() => {
              handlePageChange("/personalizar");
            }}
          >
            Personalizar
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
