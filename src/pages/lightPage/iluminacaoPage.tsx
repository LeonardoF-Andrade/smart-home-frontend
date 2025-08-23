import "./iluminacaoPage.css";
import cozinhaOn from "../../assets/cozOn.webp";
import cozinhaOff from "../../assets/cozOff.webp";
import banheiroOn from "../../assets/banOn.webp";
import banheiroOff from "../../assets/banOff.webp";
import jardimOn from "../../assets/jarOn.webp";
import jardimOff from "../../assets/jarOff.webp";
import quartoOn from "../../assets/quartoOn.webp";
import quartoOff from "../../assets/quartoOff.webp";
import salaOn from "../../assets/salaOn.webp";
import salaOff from "../../assets/salaOff.webp";
import { useEffect, useState } from "react";
import Menu from "../../components/Menu/menu";
import bgImage from "../../assets/smart_home.png";
import VoiceRecognitionListener from "../../components/Voz/voz";

const initialImages: Record<number, { on: string; off: string }> = {
  1: { on: quartoOn, off: quartoOff },

  2: { on: salaOn, off: salaOff },

  3: { on: cozinhaOn, off: cozinhaOff },

  4: { on: banheiroOn, off: banheiroOff },

  5: { on: jardimOn, off: jardimOff },
};

export enum IluminacaoAmbientes {
  quarto = 1,
  sala = 2,
  cozinha = 3,
  banheiro = 4,
  jardim = 5,
}

const SMART_HOME_STATUS_KEY = "smartHomeStatus";

const mapSmartHomeStatusToIsOn = (status: any): Record<number, boolean> => ({
  1: !!status.ledQuarto,
  2: !!status.ledSala,
  3: !!status.ledCozinha,
  4: !!status.ledBanheiro,
  5: !!status.ledJardim || !!status.ledJardim2,
});

const getInitialIsOn = (): Record<number, boolean> => {
  const smartHomeStatus = localStorage.getItem(SMART_HOME_STATUS_KEY);
  if (smartHomeStatus) {
    try {
      const status = JSON.parse(smartHomeStatus);
      return mapSmartHomeStatusToIsOn(status);
    } catch {}
  }
  return {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  };
};

const LightPage = () => {
  const [isOn, setIsOn] = useState<Record<number, boolean>>(getInitialIsOn);

  const handleButtonClick = async (buttonId: number) => {
    try {
      console.log(`Botão ${IluminacaoAmbientes[buttonId]} pressionado.`);
      const response = await fetch(
        `http://localhost:3000/iluminacao/${IluminacaoAmbientes[buttonId]}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        setIsOn((prevIsOn) => {
          const newIsOn = {
            ...prevIsOn,
            [buttonId]: !prevIsOn[buttonId],
          };

          const smartHomeStatusRaw = localStorage.getItem(
            SMART_HOME_STATUS_KEY
          );
          let smartHomeStatus = smartHomeStatusRaw
            ? JSON.parse(smartHomeStatusRaw)
            : {};

          switch (buttonId) {
            case 1:
              smartHomeStatus.ledQuarto = newIsOn[1] ? 1 : 0;
              break;
            case 2:
              smartHomeStatus.ledSala = newIsOn[2] ? 1 : 0;
              break;
            case 3:
              smartHomeStatus.ledCozinha = newIsOn[3] ? 1 : 0;
              break;
            case 4:
              smartHomeStatus.ledBanheiro = newIsOn[4] ? 1 : 0;
              break;
            case 5:
              smartHomeStatus.ledJardim = newIsOn[5] ? 1 : 0;
              smartHomeStatus.ledJardim2 = newIsOn[5] ? 1 : 0;
              break;
            default:
              break;
          }
          localStorage.setItem(
            SMART_HOME_STATUS_KEY,
            JSON.stringify(smartHomeStatus)
          );
          return newIsOn;
        });
        console.log(
          `Requisição para o botão ${IluminacaoAmbientes[buttonId]} foi bem-sucedida.`
        );
      } else {
        console.error(
          `Erro na requisição para o botão ${IluminacaoAmbientes[buttonId]}`
        );
      }
    } catch (error) {
      console.error(
        `Erro na requisição para o botão ${IluminacaoAmbientes[buttonId]}:`,
        error
      );
    }
    return null;
  };
  useEffect(() => {
    const onStorage = () => {
      const smartHomeStatus = localStorage.getItem(SMART_HOME_STATUS_KEY);
      if (smartHomeStatus) {
        try {
          const status = JSON.parse(smartHomeStatus);
          setIsOn(mapSmartHomeStatusToIsOn(status));
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    const interval = setInterval(onStorage, 1000);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="container">
      <Menu />
      <div
        className="iluminacao-container"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {[1, 2, 3, 4, 5].map((buttonId) => (
          <button
            key={buttonId}
            className="iluminacao-button"
            onClick={() => handleButtonClick(buttonId)}
          >
            <img
              src={
                isOn[buttonId]
                  ? initialImages[buttonId].on
                  : initialImages[buttonId].off
              }
              alt={`Botão ${buttonId}`}
              className="button-image"
            />
          </button>
        ))}
      </div>
      <VoiceRecognitionListener />
    </div>
  );
};

export default LightPage;
