import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AlertBanner from "@/components/AlertBanner";

// Mock patient data
const mockPatients = [
  {
    id: "P001",
    name: "John Doe",
    age: 65,
    gender: "Male",
    heartRate: 105,
    bloodPressure: "140/90",
    temperature: 38.5,
    lactate: 2.8,
    wbc: 14.5,
    riskScore: 85,
    status: "Critical",
  },
  {
    id: "P002",
    name: "Jane Smith",
    age: 52,
    gender: "Female",
    heartRate: 88,
    bloodPressure: "130/85",
    temperature: 37.8,
    lactate: 1.5,
    wbc: 10.2,
    riskScore: 55,
    status: "Moderate",
  },
  {
    id: "P003",
    name: "Robert Johnson",
    age: 71,
    gender: "Male",
    heartRate: 78,
    bloodPressure: "125/80",
    temperature: 37.2,
    lactate: 1.0,
    wbc: 8.5,
    riskScore: 25,
    status: "Stable",
  },
  {
    id: "P004",
    name: "Mary Williams",
    age: 58,
    gender: "Female",
    heartRate: 112,
    bloodPressure: "145/95",
    temperature: 39.1,
    lactate: 3.2,
    wbc: 16.8,
    riskScore: 92,
    status: "Critical",
  },
  {
    id: "P005",
    name: "James Brown",
    age: 63,
    gender: "Male",
    heartRate: 92,
    bloodPressure: "135/88",
    temperature: 38.0,
    lactate: 2.0,
    wbc: 11.5,
    riskScore: 65,
    status: "Moderate",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState<"all" | "high">("all");
  const [showAlert, setShowAlert] = useState(false);
  const [alertPatient, setAlertPatient] = useState<any>(null);

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      }
    });

    // Simulate high-risk alert after 3 seconds
    const timer = setTimeout(() => {
      const highRiskPatient = mockPatients.find((p) => p.riskScore >= 80);
      if (highRiskPatient) {
        setAlertPatient(highRiskPatient);
        setShowAlert(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const filteredPatients = mockPatients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRisk === "all" || patient.riskScore >= 80;
    return matchesSearch && matchesFilter;
  });

  const getRiskBadge = (score: number) => {
    if (score < 40) return <Badge className="bg-success">Low Risk</Badge>;
    if (score < 80) return <Badge className="bg-warning">Medium Risk</Badge>;
    return <Badge className="bg-destructive">High Risk</Badge>;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <DashboardLayout>
      {showAlert && alertPatient && (
        <AlertBanner
          message="High-Risk Patient Alert!"
          patientName={alertPatient.name}
          riskScore={alertPatient.riskScore}
          onClose={() => setShowAlert(false)}
          onView={() => {
            setShowAlert(false);
            navigate(`/dashboard/patient/${alertPatient.id}`);
          }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Patient List</h1>
          <p className="text-muted-foreground">Monitor all patients and their risk levels</p>
        </div>

        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button
            variant={filterRisk === "all" ? "outline" : "default"}
            onClick={() => setFilterRisk(filterRisk === "all" ? "high" : "all")}
          >
            <Filter className="mr-2 h-4 w-4" />
            {filterRisk === "all" ? "Show All" : "High Risk Only"}
          </Button>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Age/Gender</TableHead>
                <TableHead>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>Heart Rate</TooltipTrigger>
                      <TooltipContent>Beats per minute</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead>Blood Pressure</TableHead>
                <TableHead>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>Temperature</TooltipTrigger>
                      <TooltipContent>Body temperature in °C</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>Lactate</TooltipTrigger>
                      <TooltipContent>
                        Elevated levels may indicate organ dysfunction
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>WBC</TooltipTrigger>
                      <TooltipContent>White Blood Cell count</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow
                  key={patient.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/dashboard/patient/${patient.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-muted-foreground">{patient.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {patient.age} / {patient.gender}
                  </TableCell>
                  <TableCell>{patient.heartRate} bpm</TableCell>
                  <TableCell>{patient.bloodPressure}</TableCell>
                  <TableCell>{patient.temperature}°C</TableCell>
                  <TableCell>{patient.lactate} mmol/L</TableCell>
                  <TableCell>{patient.wbc} K/µL</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{patient.riskScore}%</span>
                      {getRiskBadge(patient.riskScore)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
