import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  BookOpen, 
  Upload, 
  Users, 
  GraduationCap, 
  Star,
  Shield,
  ArrowRight,
  Heart,
  Sparkles,
  Zap,
  Target,
  Award,
  Clock,
  CheckCircle,
  TrendingUp,
  Globe,
  Lightbulb,
  Rocket,
  Play,
  ChevronRight,
  BookMarked,
  FileText,
  Download,
  Eye,
  BarChart3,
  Activity,
  Bell,
  Search,
  Filter,
  Calendar,
  UserCheck,
  Lock,
  Unlock,
  Settings,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  Youtube,
  Instagram,
  Facebook
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive Study Resources",
      description: "Access a vast collection of educational materials including study guides, practice tests, and reference documents across all subjects.",
      color: "blue",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Community-Driven Learning",
      description: "Join a collaborative learning environment where students and educators share knowledge and support each other's academic journey.",
      color: "green",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: "Quality-Assured Content",
      description: "All resources undergo rigorous review to ensure they meet educational standards and provide genuine value to learners.",
      color: "purple",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Target,
      title: "Focused Learning Paths",
      description: "Structured materials designed specifically for GCSE and A-Level students to maximize their academic potential.",
      color: "orange",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Lightning Fast Access",
      description: "Instant access to thousands of educational resources with our optimized platform designed for speed and efficiency."
    },
    {
      icon: Upload,
      title: "Easy Content Sharing",
      description: "Contribute your own study materials with our intuitive upload system and help others in their learning journey."
    },
    {
      icon: Lock,
      title: "Secure & Reliable",
      description: "Your data is protected with enterprise-grade security while maintaining 99.9% uptime for uninterrupted learning."
    },
    {
      icon: TrendingUp,
      title: "Track Your Progress",
      description: "Monitor your learning journey with detailed analytics and progress tracking to stay motivated and focused."
    }
  ];

  const stats = [
    { number: "10K+", label: "Study Resources", icon: BookOpen },
    { number: "5K+", label: "Active Students", icon: Users },
    { number: "99.9%", label: "Uptime", icon: Shield },
    { number: "24/7", label: "Support", icon: MessageCircle }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "A-Level Student",
      content: "This platform has completely transformed my study routine. The quality of resources is outstanding!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "GCSE Student",
      content: "Found exactly what I needed for my math revision. The community is incredibly helpful.",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Tutor",
      content: "As an educator, I love how easy it is to share quality materials with my students.",
      rating: 5
    }
  ];

  const subjects = [
    { name: "Mathematics", icon: BarChart3, color: "blue" },
    { name: "Physics", icon: Zap, color: "purple" },
    { name: "Chemistry", icon: Activity, color: "green" },
    { name: "Biology", icon: Heart, color: "emerald" },
    { name: "English", icon: BookOpen, color: "red" },
    { name: "History", icon: Globe, color: "orange" }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 animate-fadeIn`}>
              <Sparkles className="w-4 h-4" />
              Trusted by 10,000+ students worldwide
            </div>

            {/* Main Heading */}
            <h1 className={`text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-slideUp`}>
              <span className="text-gradient-primary">Master</span> Your Studies
              <br />
              <span className="text-foreground">With Confidence</span>
            </h1>

            {/* Subtitle */}
            <p className={`text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed animate-slideUp`} style={{ animationDelay: '0.2s' }}>
              The ultimate learning platform for GCSE and A-Level students. 
              Access premium study materials, connect with peers, and achieve your academic goals.
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slideUp`} style={{ animationDelay: '0.4s' }}>
              {isAuthenticated() ? (
                <>
                  <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                    <Link to="/dashboard">
                      <Rocket className="w-6 h-6 mr-3" />
                      Go to Dashboard
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-2 hover:bg-muted/50 transition-all duration-300">
                    <Link to="/files">
                      <BookOpen className="w-6 h-6 mr-3" />
                      Browse Materials
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                    <Link to="/files">
                      <BookOpen className="w-6 h-6 mr-3" />
                      Start Learning Free
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-2 hover:bg-muted/50 transition-all duration-300">
                    <Link to="/submit">
                      <Upload className="w-6 h-6 mr-3" />
                      Contribute Resources
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-slideUp`} style={{ animationDelay: '0.6s' }}>
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl mx-auto mb-3">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built with students in mind, our platform combines cutting-edge technology with proven educational methodologies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={feature.title}
                  className={`border-0 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 card-interactive animate-scaleIn`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl mb-2">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 relative bg-gradient-to-br from-slate-900/50 to-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From comprehensive study materials to advanced learning tools, we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="text-center p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-500 hover-lift"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              What Our Students Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of satisfied students who have transformed their learning experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.name}
                className="border-0 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 card-interactive"
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-semibold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <Card className="border-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-cyan-600/90"></div>
            <div className="relative z-10 p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Learning?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Join thousands of students who are already achieving their academic goals with our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  <Link to="/files">
                    <BookOpen className="w-6 h-6 mr-3" />
                    Start Learning Now
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300">
                  <Link to="/submit">
                    <Upload className="w-6 h-6 mr-3" />
                    Share Your Knowledge
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">Learning Platform</h3>
              <p className="text-muted-foreground mb-4">
                Empowering students to achieve their academic goals through quality educational resources and collaborative learning.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Study Materials</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Community</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Progress Tracking</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Tutorials</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center">
            <p className="text-muted-foreground">
              © 2024 Learning Platform. All rights reserved. Built with ❤️ for students worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 