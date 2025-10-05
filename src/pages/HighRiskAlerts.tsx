import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock high-risk patients
const highRiskPatients = [
  {
    id: "P001",
    name: "John Doe",
    age: 65,
    riskScore: 85,
    lastUpdated: "2 minutes ago",
    trending: "up",
    criticalVitals: ["Temperature: 38.5°C", "Lactate: 2.8 mmol/L", "WBC: 14.5 K/µL"],
  },
  {
    id: "P004",
    name: "Mary Williams",
    age: 58,
    riskScore: 92,
    lastUpdated: "5 minutes ago",
    trending: "up",
    criticalVitals: ["Temperature: 39.1°C", "Lactate: 3.2 mmol/L", "HR: 112 bpm"],
  },
  {
    id: "P007",
    name: "David Lee",
    age: 69,
    riskScore: 88,
    lastUpdated: "8 minutes ago",
    trending: "stable",
    criticalVitals: ["BP: 150/95", "Lactate: 3.0 mmol/L", "WBC: 15.2 K/µL"],
  },
];

const HighRiskAlerts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      }
    });
  }, [navigate]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <h1 className="text-3xl font-bold text-foreground">High-Risk Alerts</h1>
          </div>
          <p className="text-muted-foreground">
            Patients with sepsis probability {">"} 80% requiring immediate attention
          </p>
        </div>

        <div className="grid gap-6">
          {highRiskPatients.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="border-destructive/50 bg-destructive/5 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-xl font-bold">{patient.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {patient.id} • Age: {patient.age}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-destructive">
                        {patient.riskScore}%
                      </div>
                      <Badge className="bg-destructive mt-1">Critical</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Updated: {patient.lastUpdated}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-destructive" />
                        <span className="text-destructive capitalize">
                          {patient.trending}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="font-semibold mb-2">Critical Vitals:</div>
                      <div className="flex flex-wrap gap-2">
                        {patient.criticalVitals.map((vital, idx) => (
                          <Badge key={idx} variant="outline" className="bg-background">
                            {vital}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => navigate(`/dashboard/patient/${patient.id}`)}
                    >
                      View Full Patient Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {highRiskPatients.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No High-Risk Alerts</h3>
              <p className="text-muted-foreground">
                All patients are currently stable. Great work!
              </p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default HighRiskAlerts;
