import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { TimerProvider } from "./components/context/timerContext.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <TimerProvider>
      <App />
    </TimerProvider>
  </BrowserRouter>
);
