import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Trophy, 
  BookOpen, 
  Lightbulb,
  Shield,
  Handshake,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Integrity",
      description: "We uphold honesty and strong moral principles in all our actions and decisions."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Unity",
      description: "Together we stand stronger, fostering collaboration and inclusivity among students."
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation",
      description: "We embrace creative solutions and progressive thinking for student welfare."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Service",
      description: "Dedicated to serving our fellow students with passion and commitment."
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Excellence",
      description: "We strive for the highest standards in leadership and student representation."
    },
    {
      icon: <Handshake className="w-8 h-8" />,
      title: "Accountability",
      description: "We take responsibility for our actions and remain transparent to our constituents."
    }
  ];

  const achievements = [
    "Successfully organized 50+ campus events annually",
    "Secured ₱2M+ in student welfare budget",
    "Represented 5,000+ students across all programs",
    "Launched 10+ community outreach programs",
    "Established partnerships with 20+ organizations",
    "Achieved 95% student satisfaction rating"
  ];

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
        {/* Hero Section */}
        <div className="text-center mb-20 slide-in-bottom">
          <Badge className="mb-4 animate-bounce-gentle">About Us</Badge>
          <h1 className="text-5xl font-bold mb-6 text-gradient">
            Empowering Students, Building Futures
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The Student Body Organization at Isabela State University is committed to representing 
            the voice of every student, fostering leadership, and creating meaningful experiences 
            that shape our academic community.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <Card className="pro-card card-enter hover-lift">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              To serve as the unified voice of all students at ISU Santiago Extension, 
              advocating for their rights, welfare, and academic excellence while promoting 
              holistic development through meaningful programs, transparent governance, and 
              collaborative partnerships with the university administration.
            </CardContent>
          </Card>

          <Card className="pro-card card-enter hover-lift stagger-1">
            <CardHeader>
              <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <Eye className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="text-3xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              A vibrant student community where every voice matters, leaders emerge with 
              integrity, and students thrive academically, socially, and personally through 
              empowered representation, innovative programs, and a culture of excellence, 
              unity, and service.
            </CardContent>
          </Card>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <div className="text-center mb-12 slide-in-bottom">
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <Card 
                key={value.title} 
                className={`pro-card card-enter hover-glow stagger-${index % 3}`}
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                    {value.icon}
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  {value.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Our Story */}
        <div className="mb-20">
          <Card className="pro-card card-enter overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12 bg-gradient-to-br from-primary/5 to-accent/5">
                <BookOpen className="w-12 h-12 text-primary mb-6" />
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Founded in 2010, the Student Body Organization at ISU Santiago Extension 
                    has been at the forefront of student advocacy and campus development for 
                    over a decade.
                  </p>
                  <p>
                    What started as a small group of passionate students has grown into a 
                    comprehensive organization representing thousands of students across all 
                    academic programs.
                  </p>
                  <p>
                    Through the years, we have successfully championed student rights, organized 
                    memorable events, facilitated academic improvements, and built lasting 
                    partnerships that continue to benefit our student community.
                  </p>
                </div>
              </div>
              <div className="p-8 md:p-12">
                <h3 className="text-2xl font-bold mb-6">Key Achievements</h3>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 card-enter"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                      <p className="text-muted-foreground">{achievement}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* What We Do */}
        <div className="mb-20">
          <div className="text-center mb-12 slide-in-bottom">
            <h2 className="text-4xl font-bold mb-4">What We Do</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive programs and services for student welfare
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                title: "Student Advocacy",
                description: "Representing student concerns and interests to university administration"
              },
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "Academic Support",
                description: "Organizing study groups, tutorials, and academic enhancement programs"
              },
              {
                icon: <Trophy className="w-8 h-8" />,
                title: "Events & Activities",
                description: "Planning engaging campus events, competitions, and cultural celebrations"
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Welfare Programs",
                description: "Providing student assistance, counseling, and community outreach"
              }
            ].map((item, index) => (
              <Card 
                key={item.title} 
                className={`pro-card card-enter hover-lift text-center stagger-${index}`}
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary">
                    {item.icon}
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {item.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="pro-card card-enter bg-gradient-to-br from-primary/10 to-accent/10 border-none">
          <CardContent className="text-center py-16">
            <h2 className="text-4xl font-bold mb-4">Join Us in Making a Difference</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you want to get involved, share your ideas, or learn more about what we do, 
              we'd love to hear from you.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/contact">
                <Button size="lg" className="btn-gradient hover-lift">
                  Get in Touch
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="hover-lift">
                  Officer Portal
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
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
