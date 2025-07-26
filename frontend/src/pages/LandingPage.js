import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  BookOpen, 
  Upload, 
  Users, 
  Download, 
  GraduationCap, 
  FileText, 
  Star,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Heart,
  Zap
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalDownloads: 0,
    activeUsers: 0,
    avgRating: 4.8
  });
  const [animatedStats, setAnimatedStats] = useState({
    totalFiles: 0,
    totalDownloads: 0,
    activeUsers: 0
  });

  // Simulate loading stats from API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalFiles: 156,
        totalDownloads: 2847,
        activeUsers: 324,
        avgRating: 4.8
      });
    }, 500);
  }, []);

  // Animate numbers counting up
  useEffect(() => {
    const animateNumber = (target, current, setter, speed = 50) => {
      if (current < target) {
        const increment = Math.ceil((target - current) / 20);
        setTimeout(() => {
          const newValue = Math.min(current + increment, target);
          setter(prev => ({ ...prev, [setter.name]: newValue }));
          if (newValue < target) {
            animateNumber(target, newValue, setter, speed);
          }
        }, speed);
      }
    };

    if (stats.totalFiles > 0) {
      animateNumber(stats.totalFiles, animatedStats.totalFiles, 
        { name: 'totalFiles', fn: setAnimatedStats }, 30);
      animateNumber(stats.totalDownloads, animatedStats.totalDownloads, 
        { name: 'totalDownloads', fn: setAnimatedStats }, 20);
      animateNumber(stats.activeUsers, animatedStats.activeUsers, 
        { name: 'activeUsers', fn: setAnimatedStats }, 40);
    }
  }, [stats]);

  const features = [
    {
      icon: BookOpen,
      title: "Rich Study Library",
      description: "Access comprehensive study guides, lecture notes, practice problems, and reference materials across multiple subjects.",
      color: "blue",
      stats: `${animatedStats.totalFiles}+ Resources`
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join a collaborative learning environment where students and educators share knowledge and grow together.",
      color: "green", 
      stats: `${animatedStats.activeUsers}+ Active Users`
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "All resources are carefully reviewed and approved by experienced educators to ensure accuracy and relevance.",
      color: "purple",
      stats: `${stats.avgRating}★ Average Rating`
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Computer Science Student",
      content: "This platform has been a game-changer for my studies. The quality of resources is outstanding!",
      rating: 5
    },
    {
      name: "Alex K.",
      role: "Engineering Student", 
      content: "I love how easy it is to find exactly what I need. The search and organization are perfect.",
      rating: 5
    },
    {
      name: "Maria L.",
      role: "Mathematics Student",
      content: "Contributing my own resources and helping others has made learning so much more engaging.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Animated Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 pt-16 pb-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 animate-fadeIn">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 hover:bg-primary/20 transition-colors cursor-pointer">
                <GraduationCap className="w-4 h-4" />
                <Sparkles className="w-4 h-4" />
                Damesha's Learning Hub
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 animate-slideUp">
              Your Gateway to 
              <span className="text-primary block mt-2 relative">
                Academic Excellence
                <div className="absolute -top-2 -right-2">
                  <Zap className="w-8 h-8 text-yellow-500 animate-bounce" />
                </div>
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed animate-slideUp" style={{animationDelay: '0.2s'}}>
              Access curated study materials, share your own resources, and join a community 
              dedicated to collaborative learning and academic growth.
            </p>

            {/* Animated Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mb-8 animate-slideUp" style={{animationDelay: '0.4s'}}>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{animatedStats.totalFiles}+</div>
                <div className="text-sm text-muted-foreground">Resources</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{animatedStats.totalDownloads}+</div>
                <div className="text-sm text-muted-foreground">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{animatedStats.activeUsers}+</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slideUp" style={{animationDelay: '0.6s'}}>
              {isAuthenticated() ? (
                <>
                  <Button asChild size="lg" className="text-lg px-8 py-6 group hover:scale-105 transition-transform">
                    <Link to="/dashboard">
                      <Upload className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                      Admin Dashboard
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 group hover:scale-105 transition-transform">
                    <Link to="/files">
                      <BookOpen className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                      Study Materials
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg" className="text-lg px-8 py-6 group hover:scale-105 transition-transform">
                    <Link to="/files">
                      <BookOpen className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                      Explore Materials
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 group hover:scale-105 transition-transform">
                    <Link to="/submit">
                      <Upload className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform" />
                      Contribute Resource
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Star className="w-4 h-4 mr-1" />
              Premium Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need for academic success
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive platform designed to enhance your learning experience through 
              shared knowledge and collaborative study resources.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={feature.title}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-8 h-8 text-${feature.color}-600 group-hover:animate-pulse`} />
                    </div>
                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {feature.stats}
                    </Badge>
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

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Button asChild size="lg" className="group">
              <Link to="/files">
                Explore All Resources
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Heart className="w-4 h-4 mr-1 text-red-500" />
              Student Love
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What our community says
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied students who have transformed their learning experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.name}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to elevate your learning?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join our community today and discover the power of collaborative education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6 group">
                <Link to="/files">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Start Exploring
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 border-white/20 hover:bg-white/20">
                <Link to="/submit">
                  <Upload className="w-5 h-5 mr-2" />
                  Share Your Knowledge
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 