import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, FileText, Users, School, ArrowRight, Clock, MapPin } from 'lucide-react';
import { sampleOfficers, sampleAnnouncements, sampleEvents } from '@/data/sampleData';

export default function PublicHomePage() {
  const navigate = useNavigate();
  const publicAnnouncements = sampleAnnouncements.filter(a => a.isPublic);
  const publicEvents = sampleEvents.filter(e => e.isPublic);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <School className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">SBO</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-foreground hover:text-primary transition-colors">Home</a>
              <a href="#officers" className="text-foreground hover:text-primary transition-colors">Officers</a>
              <a href="#events" className="text-foreground hover:text-primary transition-colors">Events</a>
              <a href="#announcements" className="text-foreground hover:text-primary transition-colors">Announcements</a>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => navigate('/auth-setup')}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                Setup
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Officer Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            School Body Organization
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Representing students, managing resources, and creating memorable experiences 
            for our school community. Working together for a better tomorrow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/officers')}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 gap-2"
            >
              <Users size={20} />
              Meet Our Officers
            </button>
            <button 
              onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 gap-2"
            >
              <Calendar size={20} />
              Upcoming Events
            </button>
          </div>
        </div>
      </section>

      {/* Officers Section */}
      <section id="officers" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Officers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the dedicated student leaders working to represent your voice and improve campus life.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sampleOfficers.map((officer) => (
              <Card key={officer.id} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6">
                  <Avatar className="h-32 w-32 mx-auto mb-4">
                    <AvatarImage src={officer.avatar} alt={officer.name} />
                    <AvatarFallback className="text-2xl bg-primary/10">
                      {officer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold mb-2">{officer.name}</h3>
                  <Badge className="mb-4">{officer.role}</Badge>
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
      <section id="events" className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Upcoming Events</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't miss out on exciting campus events and activities organized by your SBO.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-all duration-300">
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
      <section id="announcements" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Latest Announcements</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stay informed with the latest news and updates from your Student Body Organization.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {publicAnnouncements.map((announcement) => (
              <Card key={announcement.id} className="hover:shadow-md transition-all duration-300">
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

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <School className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">SBO</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Your Student Body Organization working to make campus life better for everyone.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#officers" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Officers
                </a>
                <a href="#events" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Events
                </a>
                <a href="#announcements" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Announcements
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>sbo@school.edu</p>
                <p>Student Center, Room 205</p>
                <p>Monday - Friday, 9AM - 5PM</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 School Body Organization. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}