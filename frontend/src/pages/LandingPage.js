import React, { useEffect } from 'react';
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
  Heart
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  // Component is ready
  useEffect(() => {
    // Component mounted successfully
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: "Study Resources",
      description: "Access a collection of educational materials including study guides, notes, and reference documents across various subjects.",
      color: "blue"
    },
    {
      icon: Users,
      title: "Community Sharing",
      description: "A platform where students and educators can share knowledge and contribute to a collaborative learning environment.",
      color: "green"
    },
    {
      icon: Shield,
      title: "Quality Content",
      description: "Resources are reviewed to ensure they meet educational standards and provide value to the learning community.",
      color: "purple"
    }
  ];

  const benefits = [
    {
      icon: BookOpen,
      title: "Easy Access",
      description: "Browse and download educational materials with a simple, intuitive interface designed for students."
    },
    {
      icon: Upload,
      title: "Simple Sharing",
      description: "Contribute your own study materials to help others in their learning journey."
    },
    {
      icon: Shield,
      title: "Reliable Platform",
      description: "A secure and stable platform for sharing and accessing educational resources."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Oxford Hero */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-5 animate-fadeIn">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-amber-700/20">
                <GraduationCap className="w-4 h-4" />
                Damesha's Learning Hub
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4 animate-fadeIn" style={{fontFamily: 'var(--font-serif)'}}>
              Private Tuition for
              <span className="block mt-2 text-gradient-primary">Ambitious Students</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fadeIn">
              Calm, rigorous guidance for GCSE and A‑Level success. Curated resources and structured progression with a human touch.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fadeIn">
              {isAuthenticated() ? (
                <>
                  <Button asChild variant="hero" size="lg" className="text-lg px-8 py-6">
                    <Link to="/dashboard">
                      <Upload className="w-5 h-5 mr-2" />
                      Admin Dashboard
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                    <Link to="/files">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Study Materials
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="hero" size="lg" className="text-lg px-8 py-6">
                    <Link to="/files">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Browse Materials
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                    <Link to="/submit">
                      <Upload className="w-5 h-5 mr-2" />
                      Submit a Resource
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Syllabus Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "GCSE Maths", desc: "Foundation to Higher", color: "indigo" },
                { title: "AS Level", desc: "Pure • Applied", color: "amber" },
                { title: "A2 Level", desc: "Pure • Applied", color: "slate" },
              ].map((item) => (
                <Card key={item.title} className="border-0 gradient-linen hover:shadow-[var(--shadow-lg)] transition">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl" style={{fontFamily: 'var(--font-serif)'}}>{item.title}</CardTitle>
                    <CardDescription>{item.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="ghost" size="sm">
                      <Link to="/files">
                        Explore
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Subtle academic texture overlay */}
        <div className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-70">
          <div className="w-full h-full gradient-linen" />
        </div>
      </section>

      {/* Features Section (Oxford tone) */}
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
                      Available
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

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-[rgb(250,245,235)] to-[rgb(245,238,225)] dark:from-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Heart className="w-4 h-4 mr-1 text-red-500" />
              Why Choose Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple, effective learning platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A straightforward approach to sharing and accessing educational resources.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card 
                  key={benefit.title}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Academic CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <Card className="gradient-primary text-primary-foreground border-0 shadow-[var(--shadow-lg)]">
            <CardContent className="pt-10 pb-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{fontFamily: 'var(--font-serif)'}}>
                Ready to study with intent?
              </h2>
              <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
                Access structured materials and a calm learning environment designed for confidence and clarity.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="secondary" size="lg">
                  <Link to="/files">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Explore Resources
                  </Link>
                </Button>
                <Button asChild variant="glass" size="lg">
                  <Link to="/submit">
                    <Upload className="w-5 h-5 mr-2" />
                    Contribute a Resource
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 