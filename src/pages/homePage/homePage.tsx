import Menu from "../../components/Menu/menu";
import "./homePage.css";
import CasaImage from "../../assets/smart_home.jpg";

const HomePage = () => {
  return (
    <div className="container">
      <Menu />
      <div className="image-container">
        <img src={CasaImage} alt="Casa Inteligente" className="top-image" />
      </div>
      <div className="bottom-bar"></div>
    </div>
  );
};

export default HomePage;
