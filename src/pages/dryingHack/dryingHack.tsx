import React, { useEffect, useState } from "react";
import Menu from "../../components/Menu/menu";
import bgImage from "../../assets/smart_home.png";
import "./dryingHack.css";
import { useTimer } from "../../components/context/timerContext";
import VoiceRecognitionListener from "../../components/Voz/voz";

const RADIUS = 120;
const STROKE = 10;
const SIZE = 2 * RADIUS + STROKE;
const CENTER = SIZE / 2;
const C = 2 * Math.PI * RADIUS;

const DryingRackPage: React.FC = () => {
  const { timeLeft, totalTime, isRunning, start, reset, setTotalTime } =
    useTimer();
  const [showInput, setShowInput] = useState(false);
  const [newTime, setNewTime] = useState<string>(String(totalTime));

  const confirmSchedule = () => {
    const parsed = parseInt(newTime, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setTotalTime(parsed);
    }
    setShowInput(false);
  };

  useEffect(() => {
    if (isRunning) {
      setShowInput(false);
    }
  }, [isRunning]);

  const dashOffset = C * (1 - (totalTime - timeLeft) / totalTime);

  return (
    <div className="app-container">
      <Menu />
      <div
        className="page-content"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <main className="main-content">
          <div className="buttons-row">
            <button
              className="btn btn-extend"
              onClick={start}
              disabled={isRunning}
            >
              Estender Varal ({totalTime}s)
            </button>
            <button
              className="btn btn-retract"
              onClick={reset}
              disabled={!isRunning}
            >
              Recolher Varal
            </button>
          </div>

          <div className="timer-container">
            <div
              className="circular-timer"
              style={{ width: SIZE, height: SIZE }}
            >
              <div
                className="circular-timer"
                style={{
                  width: SIZE,
                  height: SIZE,
                  cursor: isRunning ? "default" : "pointer",
                }}
                onClick={() => (!isRunning ? setShowInput(true) : null)}
              >
                <svg
                  width={SIZE}
                  height={SIZE}
                  viewBox={`0 0 ${SIZE} ${SIZE}`}
                  className="timer-svg"
                >
                  <defs>
                    <linearGradient
                      id="progressGradient"
                      x1="1"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#e0f7fa" />
                      <stop offset="100%" stopColor="#26c6da" />
                    </linearGradient>
                  </defs>

                  <circle
                    className="circle-full"
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    strokeWidth={STROKE}
                    strokeDasharray={C}
                    strokeDashoffset={0}
                  />

                  <circle
                    className="circle-progress"
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    strokeWidth={STROKE}
                    strokeDasharray={C}
                    strokeDashoffset={dashOffset}
                  />
                </svg>
                <div className="timer-number">
                  {isRunning ? `Restante: ${timeLeft}s` : "Programar"}
                </div>
              </div>
            </div>
          </div>
          {showInput && (
            <div className="schedule-input">
              <input
                type="number"
                min="1"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="input-time"
              />
              <button className="btn btn-confirm" onClick={confirmSchedule}>
                OK
              </button>
              <button
                className="btn btn-cancel"
                onClick={() => setShowInput(false)}
              >
                Cancelar
              </button>
            </div>
          )}
        </main>
      </div>
      <VoiceRecognitionListener />
    </div>
  );
};

export default DryingRackPage;
