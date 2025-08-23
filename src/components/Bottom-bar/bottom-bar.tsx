import { useState, useEffect } from "react";
import Switch from "../Switch/switch";
import "./bottom-bar.css";
import VoiceRecognitionButton from "../Voz/voz";

const SMART_HOME_STATUS_KEY = "smartHomeStatus";

const BottomBar: React.FC = () => {
  const handleToogleClick = async (index: number, newState?: boolean) => {
    console.log(`Botão ${index} clicado, novo estado: ${newState}`);
    switch (index) {
      case 0:
        try {
          const request = newState ? "onall" : "offall";
          const res = await fetch(
            `http://localhost:3000/iluminacao/${request}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: newState }),
            }
          );
        } catch (error) {
          console.error(`Erro na requisição para o botão ${index}:`, error);
        }
        break;
      case 1:
        try {
          const res = await fetch("http://localhost:3000/utils/gate/status", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newState }),
          });
        } catch (error) {
          console.error(`Erro na requisição para o botão ${index}:`, error);
        }
        break;
      case 2:
        try {
          const res = await fetch("http://localhost:3000/utils/drying/status", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newState }),
          });
        } catch (error) {
          console.error(`Erro na requisição para o botão ${index}:`, error);
        }
        break;
      case 3:
        try {
          const res = await fetch("http://localhost:3000/utils/door/status", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newState }),
          });
        } catch (error) {
          console.error(`Erro na requisição para o botão ${index}:`, error);
        }
        break;
      case 4:
        try {
          const res = await fetch("http://localhost:3000/utils/window/status", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newState }),
          });
        } catch (error) {
          console.error(`Erro na requisição para o botão ${index}:`, error);
        }
        break;
      default:
        console.error("Índice inválido para o botão.");
        return null;
    }
  };

  const mapSmartHomeStatusToSwitchStates = (status: any): boolean[] => {
    const allLightsOn =
      !!status.ledSala &&
      !!status.ledQuarto &&
      !!status.ledBanheiro &&
      !!status.ledCozinha;

    return [
      allLightsOn,
      !!status.portaoAberto,
      !!status.varalBaixado,
      !!status.portaAberta,
      !!status.janelaAberta,
    ];
  };

  const getInitialStates = (): boolean[] => {
    const smartHomeStatus = localStorage.getItem(SMART_HOME_STATUS_KEY);
    if (smartHomeStatus) {
      try {
        const status = JSON.parse(smartHomeStatus);
        return mapSmartHomeStatusToSwitchStates(status);
      } catch {}
    }
    return [false, false, false, false, false];
  };

  const [switchStates, setSwitchStates] = useState<boolean[]>(getInitialStates);
  const [isLock, setIsLock] = useState<boolean>(() => {
    const smartHomeStatus = localStorage.getItem(SMART_HOME_STATUS_KEY);
    if (smartHomeStatus) {
      try {
        const status = JSON.parse(smartHomeStatus);
        return !!status.alarmeAtivo;
      } catch {
        return false;
      }
    }
    return false;
  });

  useEffect(() => {
    const onStorage = () => {
      const smartHomeStatus = localStorage.getItem(SMART_HOME_STATUS_KEY);
      if (smartHomeStatus) {
        try {
          const status = JSON.parse(smartHomeStatus);
          setSwitchStates(mapSmartHomeStatusToSwitchStates(status));
          setIsLock(!!status.alarmeAtivo);
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

  const handleAlarmToggle = async (newAlarmState: boolean) => {
    try {
      const res = await fetch("http://localhost:3000/utils/alarm/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newAlarmState }),
      });
      console.log(`Alarm toggled to: ${newAlarmState}`);
    } catch (error) {
      console.error(`Erro na requisição para o alarme:`, error);
    }

    const smartHomeStatusRaw = localStorage.getItem(SMART_HOME_STATUS_KEY);
    let smartHomeStatus = smartHomeStatusRaw
      ? JSON.parse(smartHomeStatusRaw)
      : {};
    smartHomeStatus.alarmeAtivo = newAlarmState;
    localStorage.setItem(
      SMART_HOME_STATUS_KEY,
      JSON.stringify(smartHomeStatus)
    );
  };

  const handleSwitchToggle = (idx: number) => {
    console.log(`Toggled switch at index ${idx}`);
    const newState = !switchStates[idx];
    handleToogleClick(idx, newState);
    const copy = [...switchStates];
    copy[idx] = newState;
    setSwitchStates(copy);

    const smartHomeStatusRaw = localStorage.getItem(SMART_HOME_STATUS_KEY);
    let smartHomeStatus = smartHomeStatusRaw
      ? JSON.parse(smartHomeStatusRaw)
      : {};
    if (idx === 0) {
      const lightProps = ["ledSala", "ledQuarto", "ledBanheiro", "ledCozinha"];
      lightProps.forEach((prop) => {
        smartHomeStatus[prop] = newState ? 1 : 0;
      });
    } else {
      const propMap = [
        null,
        "portaoAberto",
        "varalBaixado",
        "portaAberta",
        "janelaAberta",
      ];
      const prop = propMap[idx];
      if (prop) {
        smartHomeStatus[prop] = newState;
      }
    }
    localStorage.setItem(
      SMART_HOME_STATUS_KEY,
      JSON.stringify(smartHomeStatus)
    );
  };

  return (
    <div className="bottom-bar">
      <div className="switch-item">
        <h2>Luzes</h2>
        <Switch isOn={switchStates[0]} onToggle={() => handleSwitchToggle(0)} />
      </div>

      <div className="switch-item">
        <h2>Portão</h2>
        <Switch isOn={switchStates[1]} onToggle={() => handleSwitchToggle(1)} />
      </div>

      <div className="switch-item">
        <h2>Varal</h2>
        <Switch isOn={switchStates[2]} onToggle={() => handleSwitchToggle(2)} />
      </div>

      <div className="switch-item">
        <h2>Porta</h2>
        <Switch isOn={switchStates[3]} onToggle={() => handleSwitchToggle(3)} />
      </div>

      <div className="switch-item">
        <h2>Janela</h2>
        <Switch isOn={switchStates[4]} onToggle={() => handleSwitchToggle(4)} />
      </div>

      <div className="switch-item alarm-item">
        <h2>Alarme</h2>
        <input
          id="inpLock"
          type="checkbox"
          checked={isLock}
          onChange={(e) => {
            const newState = e.currentTarget.checked;
            setIsLock(newState);
            handleAlarmToggle(newState);
          }}
        />
        <label className="btn-lock" htmlFor="inpLock">
          <svg width="36" height="40" viewBox="0 0 36 40">
            <path
              className="lockb"
              d="M27 27C27 34.1797 21.1797 40 14 40C6.8203 40 1 34.1797 1 27C1 19.8203 6.8203 14 14 14C21.1797 14 27 19.8203 27 27ZM15.6298 26.5191C16.4544 25.9845 17 25.056 17 24C17 22.3431 15.6569 21 14 21C12.3431 21 11 22.3431 11 24C11 25.056 11.5456 25.9845 12.3702 26.5191L11 32H17L15.6298 26.5191Z"
            ></path>
            <path
              className="lock"
              d="M6 21V10C6 5.58172 9.58172 2 14 2V2C18.4183 2 22 5.58172 22 10V21"
            ></path>
            <path className="bling" d="M29 20L31 22"></path>
            <path className="bling" d="M31.5 15H34.5"></path>
            <path className="bling" d="M29 10L31 8"></path>
          </svg>
        </label>
      </div>

      <VoiceRecognitionButton />
    </div>
  );
};

export default BottomBar;
