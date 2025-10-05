import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { TrendingUp, Users, AlertTriangle, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock data for charts
const riskTrendData = [
  { time: "00:00", low: 12, medium: 8, high: 3 },
  { time: "04:00", low: 10, medium: 10, high: 3 },
  { time: "08:00", low: 8, medium: 12, high: 4 },
  { time: "12:00", low: 9, medium: 10, high: 5 },
  { time: "16:00", low: 11, medium: 9, high: 3 },
  { time: "20:00", low: 13, medium: 7, high: 3 },
];

const vitalsTrendData = [
  { hour: "0h", hr: 82, temp: 37.0, lactate: 1.2 },
  { hour: "4h", hr: 85, temp: 37.2, lactate: 1.3 },
  { hour: "8h", hr: 88, temp: 37.5, lactate: 1.5 },
  { hour: "12h", hr: 92, temp: 37.8, lactate: 1.8 },
  { hour: "16h", hr: 95, temp: 38.0, lactate: 2.0 },
  { hour: "20h", hr: 90, temp: 37.6, lactate: 1.7 },
];

const riskDistribution = [
  { name: "Low Risk", value: 13, color: "hsl(var(--success))" },
  { name: "Medium Risk", value: 7, color: "hsl(var(--warning))" },
  { name: "High Risk", value: 3, color: "hsl(var(--destructive))" },
];

const Analytics = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      }
    });
  }, [navigate]);

  const stats = [
    {
      title: "Total Patients",
      value: "23",
      icon: Users,
      change: "+2 today",
      color: "text-primary",
    },
    {
      title: "High Risk",
      value: "3",
      icon: AlertTriangle,
      change: "Requires attention",
      color: "text-destructive",
    },
    {
      title: "Average Risk",
      value: "42%",
      icon: Activity,
      change: "-5% from yesterday",
      color: "text-warning",
    },
    {
      title: "Risk Trend",
      value: "Stable",
      icon: TrendingUp,
      change: "No major changes",
      color: "text-success",
    },
  ];

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time risk distribution and vitals trends
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Distribution Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk Trend Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>24-Hour Risk Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={riskTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="low" fill="hsl(var(--success))" name="Low Risk" />
                  <Bar dataKey="medium" fill="hsl(var(--warning))" name="Medium Risk" />
                  <Bar dataKey="high" fill="hsl(var(--destructive))" name="High Risk" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Vitals Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Average Patient Vitals Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={vitalsTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
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

export default Analytics;
