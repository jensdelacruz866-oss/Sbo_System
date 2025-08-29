import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, FileText, Users, School, ArrowRight, Clock, MapPin, GraduationCap, Heart, Trophy, BookOpen } from 'lucide-react';
import { sampleOfficers, sampleAnnouncements, sampleEvents } from '@/data/sampleData';

export default function PublicHomePage() {
  const navigate = useNavigate();
  const publicAnnouncements = sampleAnnouncements.filter(a => a.isPublic);
  const publicEvents = sampleEvents.filter(e => e.isPublic);

  return (
    <div className="min-h-screen gradient-bg page-transition">
      {/* Navigation */}
      <nav className="glass-card sticky top-0 z-50 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 fade-in">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center hover-scale shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-shimmer">Student Body Organization</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-foreground hover:text-primary transition-all duration-300 hover-glow">Home</a>
              <a href="#officers" className="text-foreground hover:text-primary transition-all duration-300 hover-glow">Officers</a>
              <a href="#events" className="text-foreground hover:text-primary transition-all duration-300 hover-glow">Events</a>
              <a href="#announcements" className="text-foreground hover:text-primary transition-all duration-300 hover-glow">Announcements</a>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/auth-setup')}
                className="btn-animate hover-glow border-2 border-primary/20 hover:border-primary inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-300 bg-background/80 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="btn-gradient inline-flex items-center justify-center rounded-lg text-sm font-medium text-primary-foreground h-10 px-4 py-2 hover-lift"
              >
                Officer Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 animate-pulse-slow"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-accent/10 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-primary/5 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Badge variant="secondary" className="mb-6 px-6 py-3 text-sm animate-bounce-gentle hover-scale">
            🎓 Empowering Student Leaders
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shimmer slide-in-bottom">
            Leading the Future of
            <span className="block text-shine mt-2">Student Governance</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto slide-in-bottom stagger-1">
            Join us in creating positive change, fostering community, and representing the voice of every student. 
            Together, we build a stronger academic environment for all.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center slide-in-bottom stagger-2">
            <button 
              onClick={() => navigate('/officers')}
              className="btn-gradient inline-flex items-center justify-center rounded-lg text-lg font-medium text-primary-foreground h-12 px-10 gap-2 hover-lift shadow-lg"
            >
              <Users size={20} />
              Meet Our Officers
            </button>
            <button 
              onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
              className="pro-card inline-flex items-center justify-center rounded-lg text-lg font-medium border-2 border-primary/30 h-12 px-10 gap-2 hover-glow"
            >
              <Calendar size={20} />
              Upcoming Events
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 animate-fade-in">
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
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: Trophy,
                title: "Excellence",
                description: "Striving for the highest standards in academic achievement and student representation.",
                color: "from-amber-500 to-amber-600"
              },
              {
                icon: BookOpen,
                title: "Education First",
                description: "Prioritizing academic success and creating an environment conducive to learning.",
                color: "from-green-500 to-green-600"
              },
              {
                icon: Heart,
                title: "Leadership",
                description: "Developing future leaders who will make positive impacts in their communities.",
                color: "from-rose-500 to-rose-600"
              }
            ].map((feature, index) => (
              <Card key={index} className={`text-center card-hover card-enter animate-fade-in stagger-${index + 1} bg-white/80 backdrop-blur-sm border-0 shadow-lg`}>
                <CardHeader>
                  <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 hover-scale shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gradient">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-base leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Officers Section */}
      <section id="officers" className="py-16 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Officers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the dedicated student leaders working to represent your voice and improve campus life.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleOfficers.map((officer, index) => (
              <Card key={officer.id} className="text-center card-hover pro-card animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="pt-6">
                  <Avatar className="h-32 w-32 mx-auto mb-4 hover-scale">
                    <AvatarImage src={officer.avatar} alt={officer.name} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 to-accent/20">
                      {officer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold mb-2">{officer.name}</h3>
                  <Badge className="mb-4 bg-gradient-to-r from-primary to-primary-hover">{officer.role}</Badge>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {officer.bio}
                  </p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Term: {new Date(officer.termStart).getFullYear()} - {new Date(officer.termStart).getFullYear() + 1}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16 bg-muted/30 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Upcoming Events</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't miss out on exciting campus events and activities organized by your SBO.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicEvents.map((event, index) => (
              <Card key={event.id} className="card-hover pro-card animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar size={16} />
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">{event.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={16} className="text-muted-foreground" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={16} className="text-muted-foreground" />
                      {event.location}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section id="announcements" className="py-16 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Latest Announcements</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stay informed with the latest news and updates from your Student Body Organization.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {publicAnnouncements.map((announcement, index) => (
              <Card key={announcement.id} className="card-hover pro-card animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText size={16} />
                      {new Date(announcement.date).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{announcement.content}</p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      By {announcement.author}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-primary-hover to-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 animate-pulse-slow"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-slide-up">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto animate-slide-up stagger-1">
            Join our student body organization and be part of the change you want to see in your academic community.
          </p>
          <button
            onClick={() => navigate('/auth-setup')}
            className="inline-flex items-center justify-center rounded-lg text-lg font-medium px-10 py-4 btn-animate hover-lift shadow-xl animate-scale-in stagger-2 bg-white text-primary hover:bg-white/90 gap-2"
          >
            Get Started Today
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/5 rounded-full animate-float" style={{animationDelay: '1.5s'}}></div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-card to-card/80 border-t border-border py-12 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="animate-slide-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center hover-scale shadow-lg">
                  <GraduationCap className="text-white h-6 w-6" />
                </div>
                <span className="text-lg font-bold text-gradient">SBO</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Your Student Body Organization working to make campus life better for everyone.
              </p>
            </div>
            
            <div className="animate-slide-up stagger-1">
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#officers" className="block text-sm text-muted-foreground hover:text-primary transition-colors hover-scale">
                  Officers
                </a>
                <a href="#events" className="block text-sm text-muted-foreground hover:text-primary transition-colors hover-scale">
                  Events
                </a>
                <a href="#announcements" className="block text-sm text-muted-foreground hover:text-primary transition-colors hover-scale">
                  Announcements
                </a>
              </div>
            </div>

            <div className="animate-slide-up stagger-2">
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>sbo@school.edu</p>
                <p>Student Center, Room 205</p>
                <p>Monday - Friday, 9AM - 5PM</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center animate-fade-in stagger-3">
            <p className="text-sm text-muted-foreground">
              © 2024 Student Body Organization. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}