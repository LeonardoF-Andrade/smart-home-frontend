import Menu from "../../components/Menu/menu";
import "./homePage.css";
import CasaImage from "../../assets/smart_home.png";
import BottomBar from "../../components/Bottom-bar/bottom-bar";
import VoiceRecognitionListener from "../../components/Voz/voz";

const HomePage = () => {
  return (
    <div className="container">
      <Menu />
      <div className="image-container">
        <img src={CasaImage} alt="Casa Inteligente" className="top-image" />
      </div>
      <BottomBar />
      <VoiceRecognitionListener />
    </div>
  );
};

export default HomePage;
