import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock, Send, Facebook, MessageCircle, GraduationCap, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="glass-card sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3 hover-scale">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="text-white h-7 w-7" />
              </div>
              <span className="text-xl font-bold text-gradient">Student Body Organization</span>
            </Link>
            <Link to="/">
              <Button variant="outline" className="btn-animate">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-16 slide-in-bottom">
          <h1 className="text-5xl font-bold mb-4 text-gradient">Get In Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions or suggestions? We'd love to hear from you. Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="pro-card card-enter">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Visit Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">Isabela State University</p>
                <p className="text-sm text-muted-foreground">
                  Information Technology Campus<br />
                  Santiago Extension Unit Campus<br />
                  Santiago City, Isabela
                </p>
              </CardContent>
            </Card>

            <Card className="pro-card card-enter stagger-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Email Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a 
                  href="mailto:sbo@isu.edu.ph" 
                  className="text-primary hover:underline"
                >
                  sbo@isu.edu.ph
                </a>
                <p className="text-sm text-muted-foreground mt-2">
                  We'll respond within 24-48 hours
                </p>
              </CardContent>
            </Card>

            <Card className="pro-card card-enter stagger-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  Call Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">+63 123 456 7890</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Monday - Friday: 8:00 AM - 5:00 PM
                </p>
              </CardContent>
            </Card>

            <Card className="pro-card card-enter stagger-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Office Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span className="font-medium">8:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="font-medium">9:00 AM - 12:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="pro-card card-enter stagger-4">
              <CardHeader>
                <CardTitle>Connect With Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button variant="outline" size="icon" className="hover-scale">
                    <Facebook className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="hover-scale">
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="hover-scale">
                    <Mail className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="pro-card card-enter stagger-1">
              <CardHeader>
                <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Juan Dela Cruz"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className="transition-all duration-300 focus:scale-[1.02]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="juan@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        className="transition-all duration-300 focus:scale-[1.02]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="What is this regarding?"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                      className="transition-all duration-300 focus:scale-[1.02]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                      className="transition-all duration-300 focus:scale-[1.02] resize-none"
                    />
                  </div>

                  <Button type="submit" className="w-full btn-gradient hover-lift" size="lg">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <Card className="pro-card overflow-hidden card-enter stagger-2">
            <CardHeader>
              <CardTitle>Find Us on Campus</CardTitle>
              <p className="text-muted-foreground">
                Our office is located at the IT Campus of Isabela State University
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-96 bg-muted flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Map integration coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 Student Body Organization. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
