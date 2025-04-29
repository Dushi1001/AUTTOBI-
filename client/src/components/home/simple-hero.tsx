import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import logoWithBg from '@/assets/logo-with-bg.png';

// Define slider content (without images since we're using video)
const slides = [
  {
    id: 1,
    title: "AUTOMATE YOUR BRILLIANCE",
    subtitle: "Smart cryptocurrency management for everyone",
    stats: [
      { value: "4500+", label: "Happy Users" },
      { value: "4.9", label: "Avg Rating" },
      { value: "24/7", label: "Customer Support" },
      { value: "Free", label: "Basic Plan" }
    ]
  },
  {
    id: 2,
    title: "MULTI-CHAIN PORTFOLIO",
    subtitle: "Manage all your crypto assets in one place",
    stats: [
      { value: "1M+", label: "Transactions" },
      { value: "10+", label: "Blockchains" },
      { value: "High", label: "Security" },
      { value: "Free", label: "Basic Plan" }
    ]
  },
  {
    id: 3,
    title: "BANK-GRADE SECURITY",
    subtitle: "Your assets are safe with AUTTOBI",
    stats: [
      { value: "100%", label: "Uptime" },
      { value: "2FA", label: "Authentication" },
      { value: "24/7", label: "Monitoring" },
      { value: "Free", label: "Basic Plan" }
    ]
  }
];

export default function SimpleHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const slide = slides[currentSlide];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000); // Longer duration for video background
    return () => clearInterval(interval);
  }, []);

  // Play video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, []);

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative overflow-hidden mb-8 rounded-lg">
      <div className="relative w-full h-[60vh] max-h-[700px]">
        {/* Video Background */}
        <video 
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#101650]/90 to-[#101650]/70"></div>
        
        {/* Rating */}
        <div className="absolute top-4 right-4 z-10 flex items-center bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
          <span className="text-yellow-400">★★★★★</span>
          <span className="ml-1 text-xs text-white font-medium">653 REVIEWS</span>
        </div>
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center p-8 lg:p-16">
          <div className="max-w-screen-xl mx-auto w-full">
            {/* Logo */}
            <div className="mb-6 flex items-center">
              <img src={logoWithBg} alt="AUTTOBI Logo" className="h-24 md:h-32 animate-fade-in" />
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 animate-fade-in">
              {slide.title}
            </h2>
            <h3 className="text-xl md:text-2xl text-white/80 mb-6 animate-fade-in">
              {slide.subtitle}
            </h3>
            <div className="animate-fade-in">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="ml-4 border-white/20 text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
        </div>
        
        {/* Stats at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#101650]/80 backdrop-blur-sm">
          <div className="grid grid-cols-4 gap-4 p-4 max-w-screen-xl mx-auto">
            {slide.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xl md:text-2xl font-bold text-blue-400">{stat.value}</div>
                <div className="text-sm text-white/90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-blue-500/20 backdrop-blur-sm hover:bg-blue-500/40"
          onClick={goToPrevSlide}
        >
          <ChevronLeft className="h-6 w-6 text-blue-400" />
        </Button>
        
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-blue-500/20 backdrop-blur-sm hover:bg-blue-500/40"
          onClick={goToNextSlide}
        >
          <ChevronRight className="h-6 w-6 text-blue-400" />
        </Button>
        
        {/* Dots Indicator */}
        <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentSlide === index ? "bg-blue-400" : "bg-blue-400/50 hover:bg-blue-400/70"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}