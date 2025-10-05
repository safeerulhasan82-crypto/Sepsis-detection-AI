import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AlertBannerProps {
  message: string;
  patientName: string;
  riskScore: number;
  onClose: () => void;
  onView: () => void;
}

const AlertBanner = ({ message, patientName, riskScore, onClose, onView }: AlertBannerProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4"
      >
        <div className="bg-destructive text-destructive-foreground rounded-lg shadow-lg p-4 flex items-center gap-4">
          <AlertTriangle className="h-6 w-6 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">{message}</p>
            <p className="text-sm opacity-90">
              {patientName} - Risk Score: {riskScore}%
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={onView}>
              View Patient
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertBanner;
