// src/contexts/TimerContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

interface TimerContextType {
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  start: () => void;
  reset: () => void;
  setTotalTime: (t: number) => void;
}

const DEFAULT_TIME = 60;

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const handleButtonClick = async (status: boolean) => {
  try {
    const response = await fetch("http://localhost:3000/utils/drying/status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (response.ok) console.log(`Drying rack status set to: ${status}`);
  } catch (error) {
    console.error(error);
  }
  return null;
};

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [totalTime, setTotalTime] = useState<number>(DEFAULT_TIME);
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_TIME);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setTimeLeft(totalTime);
    if (isRunning) {
      clearInterval(intervalRef.current!);
      intervalRef.current = setInterval(tick, 1000);
    }
  }, [totalTime]);

  const tick = () => {
    setTimeLeft((t) => {
      if (t <= 1) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setIsRunning(false);
        handleButtonClick(false);
        return totalTime;
      }
      return t - 1;
    });
  };

  const start = () => {
    if (intervalRef.current) return;
    setIsRunning(true);
    handleButtonClick(true);
    intervalRef.current = setInterval(tick, 1000);
  };

  const reset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    handleButtonClick(false);
    setTimeLeft(totalTime);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <TimerContext.Provider
      value={{ timeLeft, totalTime, isRunning, start, reset, setTotalTime }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useTimer must be inside TimerProvider");
  return ctx;
}
