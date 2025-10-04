import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, FileText, Users, School, ArrowRight, Clock, MapPin, GraduationCap, Heart, Trophy, BookOpen, Mail, Map, Phone } from 'lucide-react';
import { sampleOfficers, sampleAnnouncements } from '@/data/sampleData';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export default function PublicHomePage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        // Fetch public events (prioritize upcoming)
        const today = new Date().toISOString().slice(0, 10);

        let eventsData: any[] = [];
        const { data: upcoming, error: upcomingError } = await supabase
          .from('events')
          .select('*')
          .eq('is_public', true)
          .gte('event_date', today)
          .order('event_date', { ascending: true })
          .limit(3);

        if (upcomingError) {
          console.error('Error fetching upcoming events:', upcomingError);
        }

        if (upcoming && upcoming.length > 0) {
          eventsData = upcoming;
        } else {
          const { data: latest } = await supabase
            .from('events')
            .select('*')
            .eq('is_public', true)
            .order('event_date', { ascending: false })
            .limit(3);
          eventsData = latest || [];
        }
        
        // Fetch public announcements
        const { data: announcementsData } = await supabase
          .from('announcements')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(3);
        
        setEvents(eventsData || []);
        setAnnouncements(announcementsData || []);
      } catch (error) {
        console.error('Error fetching public data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPublicData();
  }, []);
  
  const publicAnnouncements = announcements;
  const publicEvents = events;

  return (
    <div className="min-h-screen gradient-bg page-transition">
      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes pulse-slow {
          0% { opacity: 0.5; }
          50% { opacity: 0.8; }
          100% { opacity: 0.5; }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .text-shimmer {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        
        .text-shine {
          background: linear-gradient(90deg, #8b5cf6, #ec4899, #8b5cf6);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shine 3s linear infinite;
        }
        
        .text-gradient {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        
        .gradient-bg {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        
        .pro-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .btn-gradient {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          transition: all 0.3s ease;
        }
        
        .btn-animate {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .btn-animate::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }
        
        .btn-animate:hover::before {
          left: 100%;
        }
        
        .card-hover {
          transition: all 0.3s ease;
        }
        
        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .hover-scale {
          transition: transform 0.3s ease;
        }
        
        .hover-scale:hover {
          transform: scale(1.05);
        }
        
        .hover-glow {
          transition: all 0.3s ease;
        }
        
        .hover-glow:hover {
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.5);
        }
        
        .hover-lift {
          transition: all 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        .page-transition {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out forwards;
        }
        
        @keyframes slideInBottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .slide-in-bottom {
          animation: slideInBottom 0.5s ease-out forwards;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slideUp 0.5s ease-out forwards;
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-in-out forwards;
        }
        
        .stagger-1 {
          animation-delay: 0.1s;
        }
        
        .stagger-2 {
          animation-delay: 0.2s;
        }
        
        .stagger-3 {
          animation-delay: 0.3s;
        }
        
        .card-enter {
          animation: cardEnter 0.5s ease-out forwards;
        }
        
        @keyframes cardEnter {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Navigation specific animations */
        .nav-link {
          position: relative;
          transition: all 0.3s ease;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after {
          width: 100%;
        }
        
        .nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
          border-radius: 0.375rem;
          z-index: -1;
        }
        
        .nav-link:hover::before {
          transform: scaleX(1);
        }
        
        /* Mobile menu animation */
        .mobile-menu-enter {
          animation: mobileMenuEnter 0.3s ease-out forwards;
        }
        
        @keyframes mobileMenuEnter {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .mobile-nav-link {
          position: relative;
          overflow: hidden;
        }
        
        .mobile-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          transition: width 0.3s ease;
        }
        
        .mobile-nav-link:hover::after {
          width: 100%;
        }
        
        /* Button hover effects */
        .btn-animate::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 5px;
          height: 5px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 0;
          border-radius: 100%;
          transform: scale(1, 1) translate(-50%);
          transform-origin: 50% 50%;
        }
        
        .btn-animate:focus:not(:active)::after {
          animation: ripple 1s ease-out;
        }
        
        @keyframes ripple {
          0% {
            transform: scale(0, 0);
            opacity: 0.5;
          }
          100% {
            transform: scale(20, 20);
            opacity: 0;
          }
        }
        
        /* Logo animation */
        .logo-pulse {
          animation: logoPulse 2s infinite;
        }
        
        @keyframes logoPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
        
        /* Navigation item staggered animation */
        @keyframes navItemFadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .nav-item-animate {
          animation: navItemFadeIn 0.5s ease-out forwards;
        }
      `}</style>

      {/* Navigation */}
      <nav className="glass-card sticky top-0 z-50 animate-fade-in shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo with enhanced animations */}
            <div className="flex items-center gap-3 fade-in">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center hover-scale shadow-lg transform transition-all duration-300 hover:rotate-6 logo-pulse">
                <GraduationCap className="text-white h-7 w-7 transition-transform duration-500 hover:rotate-12" />
              </div>
              <div className="transform transition-transform duration-300 hover:scale-105">
                <span className="text-xl font-bold text-shimmer">Student Body Organization</span>
                <p className="text-xs text-muted-foreground hidden sm:block animate-pulse">Your Voice, Our Mission</p>
              </div>
            </div>
            
            {/* Desktop Navigation with enhanced animations */}
            <div className="hidden md:flex items-center space-x-1">
              {[
                { href: "#home", label: "Home", icon: <School className="w-4 h-4" /> },
                { href: "#officers", label: "Officers", icon: <Users className="w-4 h-4" /> },
                { href: "#events", label: "Events", icon: <Calendar className="w-4 h-4" /> },
                { href: "#announcements", label: "Announcements", icon: <FileText className="w-4 h-4" /> }
              ].map((item, index) => (
                <a 
                  key={item.href}
                  href={item.href} 
                  className="nav-link relative px-4 py-2 text-sm font-medium text-foreground rounded-lg overflow-hidden group transition-all duration-300 hover:text-primary flex items-center gap-2"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </span>
                  <span className="absolute inset-0 bg-primary/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg"></span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </a>
              ))}
            </div>
            
            {/* Action Buttons with enhanced animations */}
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/auth-setup')}
                className="btn-animate hover-glow border-2 border-primary/20 hover:border-primary inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-300 bg-background/80 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="btn-gradient inline-flex items-center justify-center rounded-lg text-sm font-medium text-primary-foreground h-10 px-4 py-2 hover-lift overflow-hidden group relative shadow-md hover:shadow-lg transition-all duration-300"
              >
                <span className="relative z-10 flex items-center">
                  Officer Login
                </span>
                <span className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu button with animations */}
        <div className="md:hidden flex items-center justify-center p-2 border-t border-border">
          <button 
            className="text-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10 transform transition-all duration-300 hover:scale-110"
            onClick={() => {
              const mobileMenu = document.getElementById('mobile-menu');
              if (mobileMenu) {
                mobileMenu.classList.toggle('hidden');
                if (!mobileMenu.classList.contains('hidden')) {
                  mobileMenu.classList.add('mobile-menu-enter');
                }
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu with animations */}
        <div id="mobile-menu" className="md:hidden hidden bg-background/95 backdrop-blur-sm border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {[
              { href: "#home", label: "Home", icon: <School className="w-5 h-5" /> },
              { href: "#officers", label: "Officers", icon: <Users className="w-5 h-5" /> },
              { href: "#events", label: "Events", icon: <Calendar className="w-5 h-5" /> },
              { href: "#announcements", label: "Announcements", icon: <FileText className="w-5 h-5" /> }
            ].map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                className="mobile-nav-link flex items-center px-3 py-3 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 transform hover:translate-x-1"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => {
                  const mobileMenu = document.getElementById('mobile-menu');
                  if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                  }
                }}
              >
                <span className="mr-3 text-primary">{item.icon}</span>
                {item.label}
              </a>
            ))}
            
            <div className="pt-4 pb-3 border-t border-border mt-3">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <GraduationCap className="text-white h-5 w-5" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-foreground">SBO Portal</div>
                  <div className="text-sm font-medium text-muted-foreground">Student Governance</div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-2">
                <button
                  onClick={() => navigate('/auth-setup')}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                >
                  Get Started
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                >
                  Officer Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="py-20 lg:py-32 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 animate-pulse-slow"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float blur-sm"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-accent/10 rounded-full animate-float blur-sm" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-primary/5 rounded-full animate-float blur-sm" style={{animationDelay: '2s'}}></div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5Y2EzYWYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOTEzOSAxLjc5MDg2MS00IDQtNCBoMTZjMi4yMDkxMzkgMCA0IDEuNzkwODYxIDQgNHYxNmMwIDIuMjA5MTM5LTEuNzkwODYxIDQtNCA0aC0xNmMtMi4yMDkxMzkgMC00LTEuNzkwODYxLTQtNHYtMTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Badge variant="secondary" className="mb-6 px-6 py-3 text-sm animate-bounce-gentle hover-scale bg-white/90 text-primary shadow-md">
            🎓 Empowering Student Leaders Since 2020
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shimmer slide-in-bottom">
            Leading the Future of
            <span className="block text-shine mt-2">Student Governance</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto slide-in-bottom stagger-1 bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-sm">
            Join us in creating positive change, fostering community, and representing the voice of every student. 
            Together, we build a stronger academic environment for all.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center slide-in-bottom stagger-2">
            <button 
              onClick={() => navigate('/officers')}
              className="btn-gradient inline-flex items-center justify-center rounded-lg text-lg font-medium text-primary-foreground h-14 px-10 gap-2 hover-lift shadow-xl transform transition-all duration-500 hover:scale-105"
            >
              <Users size={20} />
              Meet Our Officers
            </button>
            <button 
              onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
              className="pro-card inline-flex items-center justify-center rounded-lg text-lg font-medium border-2 border-primary/30 h-14 px-10 gap-2 hover-glow bg-white/90 backdrop-blur-sm transform transition-all duration-500 hover:scale-105"
            >
              <Calendar size={20} />
              Upcoming Events
            </button>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button 
            onClick={() => document.getElementById('officers')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-muted-foreground hover:text-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-card/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary">Our Core Values</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What We Stand For
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our organization is built on core values that drive meaningful change in our academic community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: "Community Building",
                description: "Fostering connections and unity among all students across different programs and backgrounds.",
                color: "from-blue-500 to-blue-600",
                stat: "5000+ Students"
              },
              {
                icon: Trophy,
                title: "Excellence",
                description: "Striving for the highest standards in academic achievement and student representation.",
                color: "from-amber-500 to-amber-600",
                stat: "15+ Awards"
              },
              {
                icon: BookOpen,
                title: "Education First",
                description: "Prioritizing academic success and creating an environment conducive to learning.",
                color: "from-green-500 to-green-600",
                stat: "50+ Programs"
              },
              {
                icon: Heart,
                title: "Leadership",
                description: "Developing future leaders who will make positive impacts in their communities.",
                color: "from-rose-500 to-rose-600",
                stat: "100+ Leaders"
              }
            ].map((feature, index) => (
              <Card key={index} className={`text-center card-hover card-enter animate-fade-in stagger-${index + 1} bg-white/90 backdrop-blur-sm border-0 shadow-xl overflow-hidden group`}>
                <div className={`h-2 bg-gradient-to-r ${feature.color} w-full transform transition-transform duration-500 group-hover:scale-x-110`}></div>
                <CardHeader className="pt-6">
                  <div className={`mx-auto w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 hover-scale shadow-lg transform transition-all duration-300 group-hover:rotate-6`}>
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gradient">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-base leading-relaxed mb-4">{feature.description}</p>
                  <Badge variant="outline" className="border-primary/30 text-primary font-medium">
                    {feature.stat}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Officers Section */}
      <section id="officers" className="py-16 bg-gradient-to-b from-card/50 to-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary">Leadership Team</Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Officers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the dedicated student leaders working to represent your voice and improve campus life.
            </p>
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button type="button" className="px-4 py-2 text-sm font-medium rounded-l-lg bg-primary text-white">
                All Officers
              </button>
              <button type="button" className="px-4 py-2 text-sm font-medium bg-white text-primary border-t border-b border-primary">
                Executive
              </button>
              <button type="button" className="px-4 py-2 text-sm font-medium rounded-r-lg bg-white text-primary border border-primary">
                Representatives
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleOfficers.map((officer, index) => (
              <Card key={officer.id} className="text-center card-hover pro-card animate-fade-in bg-white/90 backdrop-blur-sm shadow-lg overflow-hidden group" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="h-2 bg-gradient-to-r from-primary to-accent w-full transform transition-transform duration-500 group-hover:scale-x-110"></div>
                <CardContent className="pt-6">
                  <div className="relative mb-4">
                    <Avatar className="h-32 w-32 mx-auto hover-scale transform transition-all duration-300 group-hover:rotate-6 ring-4 ring-primary/20">
                      <AvatarImage src={officer.avatar} alt={officer.name} />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 to-accent/20">
                        {officer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 right-1/2 transform translate-x-1/2 bg-primary rounded-full p-1.5">
                      <Badge className="bg-white text-primary text-xs font-medium shadow-md">
                        {/* Fixed: Check if department exists, otherwise use default */}
                        {officer.department || "Student Affairs"}
                      </Badge>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{officer.name}</h3>
                  <Badge className="mb-4 bg-gradient-to-r from-primary to-primary-hover text-white shadow-md">
                    {officer.role}
                  </Badge>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {officer.bio}
                  </p>
                  <div className="flex justify-center space-x-3 mb-4">
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </button>
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Term: {new Date(officer.termStart).getFullYear()} - {new Date(officer.termStart).getFullYear() + 1}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="inline-flex items-center justify-center rounded-lg text-primary border-2 border-primary px-6 py-3 font-medium hover:bg-primary hover:text-white transition-all duration-300">
              View All Officers
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16 bg-gradient-to-b from-background to-muted/30 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary">Campus Life</Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">Upcoming Events</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't miss out on exciting campus events and activities organized by your SBO.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button className="px-4 py-2 text-sm rounded-full bg-primary text-white">
              All Events
            </button>
            <button className="px-4 py-2 text-sm rounded-full bg-white text-primary border border-primary">
              Academic
            </button>
            <button className="px-4 py-2 text-sm rounded-full bg-white text-primary border border-primary">
              Social
            </button>
            <button className="px-4 py-2 text-sm rounded-full bg-white text-primary border border-primary">
              Sports
            </button>
            <button className="px-4 py-2 text-sm rounded-full bg-white text-primary border border-primary">
              Cultural
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-3 text-center py-8 text-muted-foreground">
                Loading events...
              </div>
            ) : publicEvents.length > 0 ? (
              publicEvents.map((event, index) => (
                <Card key={event.id} className="card-hover pro-card animate-fade-in bg-white/90 backdrop-blur-sm shadow-lg overflow-hidden group" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="relative">
                    <div className="h-2 bg-gradient-to-r from-primary to-accent w-full transform transition-transform duration-500 group-hover:scale-x-110"></div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar size={16} />
                      {format(new Date(event.event_date), 'EEEE, MMMM d, yyyy')}
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">{event.description || 'No description'}</p>
                    <div className="space-y-2 mb-4">
                      {event.event_time && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock size={16} className="text-muted-foreground" />
                          {event.event_time}
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin size={16} className="text-muted-foreground" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-muted-foreground">
                No upcoming events at the moment.
              </div>
            )}
          </div>
          
          <div className="text-center mt-12">
            <button className="inline-flex items-center justify-center rounded-lg text-primary border-2 border-primary px-6 py-3 font-medium hover:bg-primary hover:text-white transition-all duration-300">
              View All Events
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section id="announcements" className="py-16 bg-gradient-to-b from-muted/30 to-background animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary">Stay Updated</Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">Latest Announcements</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stay informed with the latest news and updates from your Student Body Organization.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading announcements...
              </div>
            ) : publicAnnouncements.length > 0 ? (
              publicAnnouncements.map((announcement, index) => (
                <Card key={announcement.id} className="card-hover pro-card animate-fade-in bg-white/90 backdrop-blur-sm shadow-lg overflow-hidden group" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="h-1 bg-gradient-to-r from-primary to-accent w-full transform transition-transform duration-500 group-hover:scale-x-110"></div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{announcement.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText size={16} />
                        {format(new Date(announcement.created_at), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {announcement.content.length > 200 
                        ? `${announcement.content.substring(0, 200)}...` 
                        : announcement.content}
                    </p>
                    {announcement.content.length > 200 && (
                      <Button variant="ghost" className="text-primary p-0 h-auto hover:bg-transparent">
                        Read More
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No announcements at the moment.
              </div>
            )}
          </div>
          
          <div className="max-w-4xl mx-auto mt-12 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Subscribe to Announcements</h3>
            <p className="text-muted-foreground mb-4">Get the latest news and updates delivered to your inbox</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button className="bg-primary hover:bg-primary-hover">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-primary-hover to-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 animate-pulse-slow"></div>
        </div>
        
        {/* Stats showcase */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-3xl md:text-4xl font-bold mb-2">5000+</div>
              <div className="text-primary-foreground/80">Students</div>
            </div>
            <div className="animate-fade-in stagger-1">
              <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
              <div className="text-primary-foreground/80">Events</div>
            </div>
            <div className="animate-fade-in stagger-2">
              <div className="text-3xl md:text-4xl font-bold mb-2">15+</div>
              <div className="text-primary-foreground/80">Officers</div>
            </div>
            <div className="animate-fade-in stagger-3">
              <div className="text-3xl md:text-4xl font-bold mb-2">4</div>
              <div className="text-primary-foreground/80">Years</div>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-slide-up">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto animate-slide-up stagger-1">
            Join our student body organization and be part of the change you want to see in your academic community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up stagger-2">
            <button
              onClick={() => navigate('/auth-setup')}
              className="inline-flex items-center justify-center rounded-lg text-lg font-medium px-10 py-4 btn-animate hover-lift shadow-xl animate-scale-in bg-white text-primary hover:bg-white/90 gap-2 transform transition-all duration-300 hover:scale-105"
            >
              Get Started Today
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="inline-flex items-center justify-center rounded-lg text-lg font-medium px-10 py-4 border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-300 gap-2 transform hover:scale-105"
            >
              Contact Us
            </button>
          </div>
          
          {/* Testimonials */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "Joining SBO was the best decision I made in college. It helped me develop leadership skills I'll use for life.",
                author: "Alex Johnson",
                role: "Former President"
              },
              {
                quote: "The events organized by SBO made my college experience unforgettable. I made lifelong friends and memories.",
                author: "Maria Garcia",
                role: "Student Member"
              },
              {
                quote: "Through SBO, I found my voice and learned how to make real change on campus.",
                author: "David Chen",
                role: "Event Coordinator"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="italic mb-4">"{testimonial.quote}"</p>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm opacity-80">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-float blur-sm"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/5 rounded-full animate-float blur-sm" style={{animationDelay: '1.5s'}}></div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-card to-card/80 border-t border-border py-12 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 animate-slide-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center hover-scale shadow-lg">
                  <GraduationCap className="text-white h-7 w-7" />
                </div>
                <span className="text-xl font-bold text-gradient">Student Body Organization</span>
              </div>
              <p className="text-muted-foreground text-sm mb-4 max-w-md">
                Your Student Body Organization working to make campus life better for everyone. 
                We represent student interests and organize events that enrich the college experience.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 12a7 7 0 01-7 7 7 7 0 01-7-7 7 7 0 017-7 7 7 0 017 7zm0 0a8.949 8.949 0 01-2.012 5.716A8.953 8.953 0 0112 21a8.953 8.953 0 01-4.988-1.284A8.949 8.949 0 015 12a8.949 8.949 0 012.012-5.716A8.953 8.953 0 0112 3a8.953 8.953 0 014.988 1.284A8.949 8.949 0 0119 12zm-6.5-3.5a.5.5 0 01.5.5v4a.5.5 0 01-.5.5h-4a.5.5 0 01-.5-.5v-4a.5.5 0 01.5-.5h4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="animate-slide-up stagger-1">
              <h3 className="font-semibold mb-4 text-lg">Quick Links</h3>
              <div className="space-y-2">
                <a href="#officers" className="block text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  Officers
                </a>
                <a href="#events" className="block text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  Events
                </a>
                <a href="#announcements" className="block text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  Announcements
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  Resources
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  Gallery
                </a>
              </div>
            </div>
            
            <div className="animate-slide-up stagger-2">
              <h3 className="font-semibold mb-4 text-lg">Contact</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-start">
                  <Mail className="w-5 h-5 mr-2 text-primary" />
                  sbo@school.edu
                </p>
                <p className="flex items-start">
                  <Map className="w-5 h-5 mr-2 text-primary" />
                  Student Center, Room 205
                </p>
                <p className="flex items-start">
                  <Phone className="w-5 h-5 mr-2 text-primary" />
                  Monday - Friday, 9AM - 5PM
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border animate-fade-in stagger-3">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground mb-4 md:mb-0">
                © 2025 Student Body Organization. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Accessibility
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Back to top button */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-hover transition-all duration-300 hover:scale-110"
          aria-label="Back to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </footer>
    </div>
  );
}