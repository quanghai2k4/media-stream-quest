import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, Link, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DownloadForm = () => {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("");
  const [quality, setQuality] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const detectPlatform = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('tiktok.com')) return 'TikTok';
    if (url.includes('instagram.com')) return 'Instagram';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter';
    if (url.includes('facebook.com')) return 'Facebook';
    return null;
  };

  const platform = detectPlatform(url);

  const handleDownload = async () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a valid video URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate download process
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Download Started!",
        description: `Your ${format} download has been initiated.`,
      });
    }, 2000);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-card to-secondary/20 backdrop-blur-sm shadow-lg border-border/50">
      <CardHeader className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Video & Audio Downloader
          </CardTitle>
        </div>
        <p className="text-muted-foreground">
          Download videos and audio from your favorite platforms
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* URL Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Video URL
          </label>
          <div className="relative">
            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Paste your video URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-10 h-12 bg-background/50 border-border focus:border-primary transition-colors"
            />
          </div>
          {platform && (
            <Badge variant="secondary" className="text-xs">
              {platform} detected
            </Badge>
          )}
        </div>

        {/* Format Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Format
            </label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="h-11 bg-background/50 border-border">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mp4">MP4 Video</SelectItem>
                <SelectItem value="mp3">MP3 Audio</SelectItem>
                <SelectItem value="wav">WAV Audio</SelectItem>
                <SelectItem value="flac">FLAC Audio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Quality
            </label>
            <Select value={quality} onValueChange={setQuality}>
              <SelectTrigger className="h-11 bg-background/50 border-border">
                <SelectValue placeholder="Select quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="highest">Highest Available</SelectItem>
                <SelectItem value="1080p">1080p</SelectItem>
                <SelectItem value="720p">720p</SelectItem>
                <SelectItem value="480p">480p</SelectItem>
                <SelectItem value="360p">360p</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Download Button */}
        <Button
          onClick={handleDownload}
          disabled={isLoading || !url.trim()}
          className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground/20 border-t-primary-foreground" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Now
            </div>
          )}
        </Button>

        {/* Supported Platforms */}
        <div className="text-center pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-2">Supported Platforms</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['YouTube', 'TikTok', 'Instagram', 'Twitter', 'Facebook'].map((platform) => (
              <Badge key={platform} variant="outline" className="text-xs">
                {platform}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadForm;