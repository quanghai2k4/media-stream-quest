import Header from "@/components/Header";
import DownloadForm from "@/components/DownloadForm";
import FeatureCards from "@/components/FeatureCards";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
            Download Videos & Audio
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Fast, free, and secure downloads from YouTube, TikTok, Instagram, and more. 
            No registration required.
          </p>
        </div>

        {/* Download Form */}
        <div className="mb-16">
          <DownloadForm />
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why Choose MediaDL?
          </h2>
          <FeatureCards />
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-card to-secondary/20 rounded-2xl p-8 border border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1M+</div>
              <div className="text-muted-foreground">Downloads Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Supported Platforms</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Always Available</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-md mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 MediaDL. Built with ❤️ for creators everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
