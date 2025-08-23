import React, { useState, useEffect } from "react";
import Menu from "../../components/Menu/menu";
import "./gardenPage.css";
import bgImage from "../../assets/smart_home.png";
import VoiceRecognitionListener from "../../components/Voz/voz";

interface SensorData {
  temperature: number;
  moisture: number;
}

const POLL_INTERVAL = 5000;

const speak = (text: string) => {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    speechSynthesis.speak(utterance);
  }
};

export const GardenPage: React.FC = () => {
  const [data, setData] = useState<SensorData>({ temperature: 0, moisture: 0 });
  const [irrigationOn, setIrrigationOn] = useState(false);

  const [minMoisture, setMinMoisture] = useState<number>(() => {
    const saved = localStorage.getItem("garden_minMoisture");
    return saved !== null ? parseInt(saved, 10) : 50;
  });

  useEffect(() => {
    const SMART_HOME_STATUS_KEY = "smartHomeStatus";
    const updateFromLocalStorage = () => {
      const smartHomeStatus = localStorage.getItem(SMART_HOME_STATUS_KEY);
      if (smartHomeStatus) {
        try {
          const status = JSON.parse(smartHomeStatus);
          setData({
            temperature: status.temperatura || 0,
            moisture: status.umidade || 0,
          });
        } catch (err) {}
      }
    };
    updateFromLocalStorage();
    window.addEventListener("storage", updateFromLocalStorage);
    const id = setInterval(updateFromLocalStorage, POLL_INTERVAL);
    return () => {
      window.removeEventListener("storage", updateFromLocalStorage);
      clearInterval(id);
    };
  }, []);

  const prevMoistureRef = React.useRef<number>(data.moisture);
  useEffect(() => {
    const prevMoisture = prevMoistureRef.current;
    if (
      prevMoisture > minMoisture &&
      data.moisture <= minMoisture &&
      data.moisture > 0
    ) {
      fetch("/api/garden/irrigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ on: true }),
      }).catch((err) =>
        console.error("Erro ao acionar irrigação automática:", err)
      );
      speak("Umidade abaixo da mínima, ligando irrigação");
    }
    if (
      prevMoisture <= minMoisture &&
      data.moisture > minMoisture &&
      prevMoisture > 0
    ) {
      fetch("/api/garden/irrigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ on: false }),
      }).catch((err) =>
        console.error("Erro ao desligar irrigação automática:", err)
      );
      speak("Umidade normalizada, desligando irrigação");
    }
    prevMoistureRef.current = data.moisture;
  }, [data.moisture, minMoisture]);

  const toggleIrrigation = async () => {
    try {
      const newState = !irrigationOn;
      await fetch("/api/garden/irrigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ on: newState }),
      });

      speak(newState ? "Irrigação ligada" : "Irrigação desligada");

      setIrrigationOn((v) => {
        const newState = !v;
        const SMART_HOME_STATUS_KEY = "smartHomeStatus";
        const smartHomeStatusRaw = localStorage.getItem(SMART_HOME_STATUS_KEY);
        let smartHomeStatus = smartHomeStatusRaw
          ? JSON.parse(smartHomeStatusRaw)
          : {};
        smartHomeStatus.irrigacaoLigada = newState;
        localStorage.setItem(
          SMART_HOME_STATUS_KEY,
          JSON.stringify(smartHomeStatus)
        );
        return newState;
      });
    } catch (err) {
      console.error(err);
      speak("Erro ao alterar irrigação");
    }
  };

  const handleMinMoistureChange = async (v: number) => {
    setMinMoisture(v);
    localStorage.setItem("garden_minMoisture", v.toString());
  };

  const RADIUS = 80;
  const STROKE = 8;
  const C = 2 * Math.PI * RADIUS;

  const MIN_TEMP = 0;
  const MAX_TEMP = 50;
  const tempPercent = Math.min(
    Math.max((data.temperature - MIN_TEMP) / (MAX_TEMP - MIN_TEMP), 0),
    1
  );
  const tempOffset = C * (1 - tempPercent);

  const moistPercent = Math.min(Math.max(data.moisture / 100, 0), 1);
  const moistOffset = C * (1 - moistPercent);

  return (
    <div className="garden-page">
      <Menu />
      <div
        className="page-content"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <main className="main-content">
          <div className="card">
            <h2 className="card-title">Temperatura</h2>
            <div className="circle-wrapper">
              <svg
                width={2 * (RADIUS + STROKE)}
                height={2 * (RADIUS + STROKE)}
                className="temp-circle"
              >
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#851b1b" />
                    <stop offset="25%" stopColor="#e6a223" />
                    <stop offset="75%" stopColor="#277e8d" />
                    <stop offset="100%" stopColor="#37c3db" />
                  </linearGradient>
                </defs>
                <circle
                  className="circle-bg"
                  cx={RADIUS + STROKE}
                  cy={RADIUS + STROKE}
                  r={RADIUS}
                  strokeWidth={STROKE}
                />
                <circle
                  className="circle-temp"
                  cx={RADIUS + STROKE}
                  cy={RADIUS + STROKE}
                  r={RADIUS}
                  strokeWidth={STROKE}
                  strokeDasharray={C}
                  strokeDashoffset={tempOffset}
                />
              </svg>
              <div className="temp-value">{Math.round(data.temperature)}°C</div>
            </div>
            <div className="toggle-row">
              <label>Ligar Irrigação</label>
              <div
                className={`switch ${irrigationOn ? "on" : ""}`}
                onClick={toggleIrrigation}
              >
                <div className="thumb" />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Umidade do Solo</h2>
            <div className="gauge-wrapper">
              <svg
                width={2 * (RADIUS + STROKE)}
                height={2 * (RADIUS + STROKE)}
                className="moisture-circle"
              >
                <defs>
                  <linearGradient id="moistGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#4ade80" />
                  </linearGradient>
                </defs>
                <circle
                  className="circle-bg"
                  cx={RADIUS + STROKE}
                  cy={RADIUS + STROKE}
                  r={RADIUS}
                  strokeWidth={STROKE}
                />
                <circle
                  className="circle-moisture"
                  cx={RADIUS + STROKE}
                  cy={RADIUS + STROKE}
                  r={RADIUS}
                  strokeWidth={STROKE}
                  strokeDasharray={C}
                  strokeDashoffset={moistOffset}
                />
              </svg>
              <div className="moisture-value">{data.moisture}%</div>
            </div>
            <div className="slider-row">
              <label>Umidade mínima ({minMoisture}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={minMoisture}
                onChange={(e) =>
                  handleMinMoistureChange(Number(e.currentTarget.value))
                }
                style={{
                  background: `linear-gradient(
                    to right,
                    rgba(38,198,218,0.8) 0%,
                    rgba(38,198,218,0.8) ${minMoisture}%,
                    rgba(255,255,255,0.3) ${minMoisture}%,
                    rgba(255,255,255,0.3) 100%
                  )`,
                }}
              />
            </div>
          </div>
        </main>
      </div>
      <VoiceRecognitionListener />
    </div>
  );
};
