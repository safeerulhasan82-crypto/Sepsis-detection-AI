import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import RiskGauge from "@/components/RiskGauge";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ArrowLeft, User, Calendar, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock patient details
const patientData: Record<string, any> = {
  P001: {
    id: "P001",
    name: "John Doe",
    age: 65,
    gender: "Male",
    admissionDate: "2025-10-01",
    phone: "+1 (555) 123-4567",
    room: "ICU-204",
    diagnosis: "Pneumonia with suspected sepsis",
    riskScore: 85,
    vitals: {
      heartRate: 105,
      bloodPressure: "140/90",
      temperature: 38.5,
      lactate: 2.8,
      wbc: 14.5,
      respiratoryRate: 24,
      oxygenSaturation: 92,
    },
    vitalHistory: [
      { time: "00:00", hr: 98, temp: 37.8, lactate: 2.0 },
      { time: "04:00", hr: 102, temp: 38.0, lactate: 2.3 },
      { time: "08:00", hr: 105, temp: 38.5, lactate: 2.8 },
    ],
  },
  P004: {
    id: "P004",
    name: "Mary Williams",
    age: 58,
    gender: "Female",
    admissionDate: "2025-09-30",
    phone: "+1 (555) 987-6543",
    room: "ICU-201",
    diagnosis: "Post-surgical infection",
    riskScore: 92,
    vitals: {
      heartRate: 112,
      bloodPressure: "145/95",
      temperature: 39.1,
      lactate: 3.2,
      wbc: 16.8,
      respiratoryRate: 26,
      oxygenSaturation: 90,
    },
    vitalHistory: [
      { time: "00:00", hr: 102, temp: 38.2, lactate: 2.5 },
      { time: "04:00", hr: 108, temp: 38.8, lactate: 2.9 },
      { time: "08:00", hr: 112, temp: 39.1, lactate: 3.2 },
    ],
  },
};

const PatientDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const patient = patientData[id || ""];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      }
    });
  }, [navigate]);

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Patient Not Found</h2>
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </div>
      </DashboardLayout>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRiskBadge = (score: number) => {
    if (score < 40) return <Badge className="bg-success">Low Risk</Badge>;
    if (score < 80) return <Badge className="bg-warning">Medium Risk</Badge>;
    return <Badge className="bg-destructive">High Risk</Badge>;
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patient List
        </Button>

        {/* Patient Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl">
                  {getInitials(patient.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{patient.name}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {patient.age} years • {patient.gender} • ID: {patient.id}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Admitted: {patient.admissionDate}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {patient.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Room: {patient.room}
                  </div>
                </div>
                <div className="mt-3">
                  <span className="font-semibold">Diagnosis: </span>
                  {patient.diagnosis}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Score Gauge */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">AI Sepsis Risk Score</CardTitle>
            </CardHeader>
            <CardContent>
              <RiskGauge value={patient.riskScore} size="lg" />
              <div className="text-center mt-4">{getRiskBadge(patient.riskScore)}</div>
            </CardContent>
          </Card>

          {/* Current Vitals */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Current Vitals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Heart Rate</div>
                  <div className="text-2xl font-bold">{patient.vitals.heartRate} bpm</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Blood Pressure</div>
                  <div className="text-2xl font-bold">{patient.vitals.bloodPressure}</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Temperature</div>
                  <div className="text-2xl font-bold">{patient.vitals.temperature}°C</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Lactate</div>
                  <div className="text-2xl font-bold">
                    {patient.vitals.lactate} mmol/L
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">WBC Count</div>
                  <div className="text-2xl font-bold">{patient.vitals.wbc} K/µL</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">O2 Saturation</div>
                  <div className="text-2xl font-bold">
                    {patient.vitals.oxygenSaturation}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vitals History Chart */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Vitals Trend (Last 8 Hours)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={patient.vitalHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="hr"
                    stroke="hsl(var(--primary))"
                    name="Heart Rate (bpm)"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="temp"
                    stroke="hsl(var(--warning))"
                    name="Temperature (°C)"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="lactate"
                    stroke="hsl(var(--destructive))"
                    name="Lactate (mmol/L)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default PatientDetails;
