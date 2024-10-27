import "./iluminacaoPage.css";
import cozinhaImage from "../../assets/cozinha.webp";
import banheiroImage from "../../assets/banheiro.webp";
import jardimImage from "../../assets/jardim.webp";
import piscinaImage from "../../assets/piscina.webp";
import quartoImage from "../../assets/quarto.webp";
import salaImage from "../../assets/sala.webp";
import banheiroOn from "../../assets/banheiro_aceso.webp";
import { useState } from "react";
import Menu from "../../components/Menu/menu";

const initialImages: Record<number, { off: string; on: string }> = {
  1: { off: cozinhaImage, on: cozinhaImage },
  2: { off: banheiroImage, on: banheiroOn },
  3: { off: jardimImage, on: jardimImage },
  4: { off: piscinaImage, on: piscinaImage },
  5: { off: quartoImage, on: quartoImage },
  6: { off: salaImage, on: salaImage },
};

enum IluminacaoAmbientes {
  quarto = 1,
  sala = 2,
  cozinha = 3,
  banheiro = 4,
  piscina = 5,
  jardim = 6,
}

const LightPage = () => {
  const [isOn, setIsOn] = useState<Record<number, boolean>>({
    1: false, // Quarto
    2: false, // Sala
    3: false, // Cozinha
    4: false, // Banheiro
    5: false, // Piscina
    6: false, // Jardim
  });

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
        setIsOn((prevIsOn) => ({
          ...prevIsOn,
          [buttonId]: !prevIsOn[buttonId],
        }));
        console.log("opaaaaa", isOn[buttonId]);
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

  return (
    <div className="container">
      <Menu />
      <div className="bottom-bar"></div>
      <div className="iluminacao-container">
        {[1, 2, 3, 4, 5, 6].map((buttonId) => (
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
    </div>
  );
};

export default LightPage;
