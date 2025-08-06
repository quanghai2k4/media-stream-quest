import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Shield, Download, History } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Download videos and audio at maximum speed with our optimized servers"
  },
  {
    icon: Shield,
    title: "100% Safe",
    description: "No malware, no ads, no tracking. Your privacy and security are our priority"
  },
  {
    icon: Download,
    title: "Multiple Formats",
    description: "Support for MP4, MP3, WAV, FLAC and more with various quality options"
  },
  {
    icon: History,
    title: "Download History",
    description: "Keep track of all your downloads with our built-in history feature"
  }
];

const FeatureCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mx-auto">
      {features.map((feature, index) => (
        <Card 
          key={index} 
          className="bg-gradient-to-br from-card to-secondary/10 border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
        >
          <CardHeader className="text-center pb-2">
            <div className="mx-auto p-3 rounded-xl bg-primary/10 w-fit mb-2">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg font-semibold">
              {feature.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeatureCards;