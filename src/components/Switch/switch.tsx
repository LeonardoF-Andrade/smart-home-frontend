import "./switch.css";

interface SwitchProps {
  isOn?: boolean;
  onToggle: () => void;
}

const Switch = ({ isOn, onToggle }: SwitchProps) => {
  return (
    <div
      className={`switch-container ${isOn ? "on" : "off"}`}
      onClick={onToggle}
    >
      <div className="circle"></div>
      <div className="switch-labels"></div>
    </div>
  );
};

export default Switch;
