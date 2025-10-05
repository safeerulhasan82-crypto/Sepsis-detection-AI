import { motion } from "framer-motion";

interface RiskGaugeProps {
  value: number; // 0-100
  size?: "sm" | "md" | "lg";
}

const RiskGauge = ({ value, size = "md" }: RiskGaugeProps) => {
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
  };

  const getRiskColor = (val: number) => {
    if (val < 40) return "text-success";
    if (val < 80) return "text-warning";
    return "text-destructive";
  };

  const getRiskBg = (val: number) => {
    if (val < 40) return "stroke-success";
    if (val < 80) return "stroke-warning";
    return "stroke-destructive";
  };

  const getRiskLabel = (val: number) => {
    if (val < 40) return "Low Risk";
    if (val < 80) return "Medium Risk";
    return "High Risk";
  };

  const circumference = 2 * Math.PI * 80;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={`relative ${sizeClasses[size]} mx-auto`}>
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background circle */}
        <circle
          cx="50%"
          cy="50%"
          r="80"
          className="stroke-muted"
          strokeWidth="12"
          fill="none"
        />
        {/* Animated progress circle */}
        <motion.circle
          cx="50%"
          cy="50%"
          r="80"
          className={getRiskBg(value)}
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`text-4xl font-bold ${getRiskColor(value)}`}
        >
          {value}%
        </motion.div>
        <div className="text-sm text-muted-foreground mt-1">{getRiskLabel(value)}</div>
      </div>
    </div>
  );
};

export default RiskGauge;
