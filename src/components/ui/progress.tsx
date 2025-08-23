type ProgressProps = {
  value: number;
  className?: string;
};

export const Progress = ({ value, className }: ProgressProps) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-4 ${className}`}>
      <div
        className="bg-blue-500 h-full rounded-full"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};
