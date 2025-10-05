import { motion } from "framer-motion";
import { Activity, Shield, Zap, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-medical.jpg";

const Index = () => {
  const features = [
    {
      icon: Zap,
      title: "Real-Time Monitoring",
      description: "Monitor patient vitals and risk scores in real-time with instant updates",
    },
    {
      icon: Shield,
      title: "AI-Powered Detection",
      description: "Advanced machine learning algorithms validated with ICU datasets",
    },
    {
      icon: BarChart3,
      title: "Predictive Analytics",
      description: "Early detection with traffic-light risk scoring system",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-background"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Activity className="h-10 w-10 text-primary" />
                  <h1 className="text-5xl font-bold text-foreground">SepsisGuard AI</h1>
                </div>
                <p className="text-2xl text-muted-foreground mb-8">
                  AI-powered early detection of sepsis for healthcare professionals
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  Monitor patients in real-time with advanced predictive analytics. Detect sepsis
                  early and save lives with our intelligent risk assessment system.
                </p>
                <div className="flex gap-4">
                  <Link to="/login">
                    <Button size="lg" className="group">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="lg" variant="outline">
                      Sign Up
                    </Button>
                  </Link>
                </div>
                <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Powered by AI, validated with ICU datasets</span>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <img
                  src={heroImage}
                  alt="Medical AI Dashboard"
                  className="rounded-2xl shadow-2xl w-full"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Key Features</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need for effective sepsis monitoring
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
