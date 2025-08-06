import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { 
  BookOpen, 
  Upload, 
  Users, 
  Star,
  Shield,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Rocket,
  Lock,
  MessageCircle,
  Twitter,
  Linkedin,
  Youtube,
  Calculator,
  Atom,
  Globe,
  History,
  Languages,
  Palette,
  Music,
  Code,
  Brain,
  Award,
  Clock,
  CheckCircle,
  Play,
  Download,
  Eye,
  Heart
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [activeSubject, setActiveSubject] = useState('maths');

  useEffect(() => {
    // Component mounted successfully
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

  const subjects = [
    {
      id: 'maths',
      name: 'Maths',
      icon: Calculator,
      description: 'Algebra, Calculus, Statistics, Geometry',
      color: 'from-blue-500 to-cyan-500',
      topics: ['Algebra', 'Calculus', 'Statistics', 'Geometry', 'Trigonometry']
    },
    {
      id: 'physics',
      name: 'Physics',
      icon: Atom,
      description: 'Mechanics, Electricity, Waves, Modern Physics',
      color: 'from-purple-500 to-pink-500',
      topics: ['Mechanics', 'Electricity', 'Waves', 'Modern Physics', 'Thermodynamics']
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      icon: Flask,
      description: 'Organic, Inorganic, Physical Chemistry',
      color: 'from-green-500 to-emerald-500',
      topics: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Chemistry']
    },
    {
      id: 'biology',
      name: 'Biology',
      icon: Brain,
      description: 'Cell Biology, Genetics, Ecology, Human Biology',
      color: 'from-emerald-500 to-teal-500',
      topics: ['Cell Biology', 'Genetics', 'Ecology', 'Human Biology', 'Evolution']
    },
    {
      id: 'english',
      name: 'English',
      icon: Languages,
      description: 'Literature, Language, Creative Writing',
      color: 'from-red-500 to-pink-500',
      topics: ['Literature', 'Language', 'Creative Writing', 'Poetry', 'Drama']
    },
    {
      id: 'history',
      name: 'History',
      icon: History,
      description: 'British History, World History, Politics',
      color: 'from-amber-500 to-orange-500',
      topics: ['British History', 'World History', 'Politics', 'Economics', 'Geography']
    }
  ];

  const learningPaths = [
    {
      title: "GCSE Foundation",
      description: "Perfect for Year 9-11 students",
      duration: "2 years",
      subjects: ["Maths", "English", "Sciences"],
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "A-Level Preparation",
      description: "Advanced studies for Year 12-13",
      duration: "2 years",
      subjects: ["Pure Maths", "Physics", "Chemistry"],
      icon: Award,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "University Prep",
      description: "Get ready for higher education",
      duration: "1 year",
      subjects: ["Advanced Topics", "Research Skills"],
      icon: Rocket,
      color: "from-green-500 to-emerald-500"
    }
  ];

  const recentResources = [
    {
      title: "A-Level Pure Maths Formula Sheet",
      subject: "Maths",
      downloads: 234,
      views: 1200,
      likes: 89,
      type: "PDF"
    },
    {
      title: "GCSE Physics Revision Notes",
      subject: "Physics",
      downloads: 189,
      views: 890,
      likes: 67,
      type: "PDF"
    },
    {
      title: "Chemistry Lab Safety Guide",
      subject: "Chemistry",
      downloads: 156,
      views: 745,
      likes: 45,
      type: "PDF"
    }
  ];

  const Flask = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-float dark:from-blue-500/20 dark:to-cyan-500/20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-float dark:from-purple-500/20 dark:to-pink-500/20" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-full blur-3xl animate-float dark:from-green-500/10 dark:to-emerald-500/10" style={{ animationDelay: '4s' }}></div>
        
        {/* Light mode specific elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-yellow-300/20 to-orange-300/20 rounded-full blur-3xl animate-float dark:from-yellow-500/10 dark:to-orange-500/10" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-tl from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl animate-float dark:from-indigo-500/10 dark:to-purple-500/10" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 animate-fadeIn`}>
              <Sparkles className="w-4 h-4" />
              Free access to quality educational resources
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

            {/* Quick Stats - Real Engagement Metrics */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-slideUp`} style={{ animationDelay: '0.6s' }}>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl mx-auto mb-3">
                  <Download className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">500+</div>
                <div className="text-sm text-muted-foreground">Resources Downloaded</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl mx-auto mb-3">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">Active</div>
                <div className="text-sm text-muted-foreground">Learning Community</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl mx-auto mb-3">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">100%</div>
                <div className="text-sm text-muted-foreground">Free Access</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl mx-auto mb-3">
                  <Clock className="w-6 h-6 text-orange-400" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Subject Showcase */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Explore Your Subjects
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover comprehensive study materials across all major subjects. Click on any subject to explore available resources.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
            {subjects.map((subject) => {
              const Icon = subject.icon;
              const isActive = activeSubject === subject.id;
              return (
                <Card 
                  key={subject.id}
                  className={`border-2 cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 ${
                    isActive 
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20' 
                      : 'border-slate-200 hover:border-slate-300 bg-white/70 dark:bg-slate-800/50 dark:border-slate-700'
                  }`}
                  onClick={() => setActiveSubject(subject.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${subject.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">{subject.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{subject.description}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {subject.topics.slice(0, 3).map((topic) => (
                        <span key={topic} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs text-slate-600 dark:text-slate-300">
                          {topic}
                        </span>
                      ))}
                      {subject.topics.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs text-slate-600 dark:text-slate-300">
                          +{subject.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Active Subject Details */}
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 bg-gradient-to-br from-white/70 to-slate-100/70 backdrop-blur-xl dark:from-slate-900/50 dark:to-slate-800/50">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {subjects.find(s => s.id === activeSubject)?.name} Resources
                  </h3>
                  <p className="text-muted-foreground">
                    Explore comprehensive study materials for {subjects.find(s => s.id === activeSubject)?.name.toLowerCase()}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Available Topics:</h4>
                    <div className="space-y-2">
                      {subjects.find(s => s.id === activeSubject)?.topics.map((topic) => (
                        <div key={topic} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-muted-foreground">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">What you'll find:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-muted-foreground">Study guides and notes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-muted-foreground">Practice questions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Play className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">Video explanations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-muted-foreground">Exam preparation</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-6">
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                    <Link to="/files">
                      Browse {subjects.find(s => s.id === activeSubject)?.name} Resources
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
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
                  className={`border-0 bg-gradient-to-br from-white/70 to-slate-100/70 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 card-interactive animate-scaleIn dark:from-slate-900/50 dark:to-slate-800/50`}
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

      {/* Learning Paths Section */}
      <section className="py-24 relative bg-gradient-to-br from-slate-100/50 to-blue-50/50 dark:from-slate-900/50 dark:to-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Your Learning Journey
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose your path and follow structured learning programs designed for your academic level.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {learningPaths.map((path, index) => {
              const Icon = path.icon;
              return (
                <Card 
                  key={path.title}
                  className="border-0 bg-gradient-to-br from-white/70 to-slate-100/70 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 card-interactive dark:from-slate-800/50 dark:to-slate-700/50"
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${path.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl mb-2">{path.title}</CardTitle>
                    <CardDescription className="text-base">{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        Duration: {path.duration}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Subjects Covered:</h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {path.subjects.map((subject) => (
                            <span key={subject} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm text-slate-600 dark:text-slate-300">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                        <Link to="/files">
                          Start Learning
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Resources Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Recently Added Resources
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Check out the latest study materials added by our community of educators and students.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {recentResources.map((resource) => (
              <Card 
                key={resource.title}
                className="border-0 bg-gradient-to-br from-white/70 to-slate-100/70 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 card-interactive dark:from-slate-900/50 dark:to-slate-800/50"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                      {resource.type}
                    </span>
                    <span className="text-sm text-muted-foreground">{resource.subject}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-4 line-clamp-2">{resource.title}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {resource.downloads}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {resource.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {resource.likes}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link to="/files">
                View All Resources
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 relative bg-gradient-to-br from-slate-100/50 to-blue-50/50 dark:from-slate-900/50 dark:to-slate-800/50">
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
                  className="text-center p-8 rounded-2xl bg-gradient-to-br from-white/70 to-slate-100/70 backdrop-blur-xl border border-slate-200/50 hover:border-slate-300/50 transition-all duration-500 hover-lift dark:from-slate-800/50 dark:to-slate-700/50 dark:border-slate-700/50 dark:hover:border-slate-600/50"
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

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <Card className="border-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white overflow-hidden relative dark:from-blue-600 dark:to-cyan-600">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/90 to-cyan-500/90 dark:from-blue-600/90 dark:to-cyan-600/90"></div>
            <div className="relative z-10 p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Learning?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Join our community of learners and start your journey towards academic excellence today.
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
      <footer className="py-16 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">Learning Platform</h3>
              <p className="text-muted-foreground mb-4">
                Empowering students to achieve their academic goals through quality educational resources and collaborative learning.
              </p>
                             <div className="flex space-x-4">
                 <button className="text-muted-foreground hover:text-foreground transition-colors">
                   <Twitter className="w-5 h-5" />
                 </button>
                 <button className="text-muted-foreground hover:text-foreground transition-colors">
                   <Linkedin className="w-5 h-5" />
                 </button>
                 <button className="text-muted-foreground hover:text-foreground transition-colors">
                   <Youtube className="w-5 h-5" />
                 </button>
               </div>
            </div>
            
                         <div>
               <h4 className="font-semibold text-foreground mb-4">Platform</h4>
               <ul className="space-y-2">
                 <li><button className="text-muted-foreground hover:text-foreground transition-colors">Study Materials</button></li>
                 <li><button className="text-muted-foreground hover:text-foreground transition-colors">Community</button></li>
                 <li><button className="text-muted-foreground hover:text-foreground transition-colors">Progress Tracking</button></li>
                 <li><button className="text-muted-foreground hover:text-foreground transition-colors">Resources</button></li>
               </ul>
             </div>
            
                         <div>
               <h4 className="font-semibold text-foreground mb-4">Support</h4>
               <ul className="space-y-2">
                 <li><button className="text-muted-foreground hover:text-foreground transition-colors">Help Center</button></li>
                 <li><button className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</button></li>
                 <li><button className="text-muted-foreground hover:text-foreground transition-colors">FAQ</button></li>
                 <li><button className="text-muted-foreground hover:text-foreground transition-colors">Tutorials</button></li>
               </ul>
             </div>
            
                         <div>
               <h4 className="font-semibold text-foreground mb-4">Legal</h4>
               <ul className="space-y-2">
                 <li><button className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</button></li>
                 <li><button className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</button></li>
                 <li><button className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</button></li>
                 <li><button className="text-muted-foreground hover:text-foreground transition-colors">GDPR</button></li>
               </ul>
             </div>
          </div>
          
                     <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 text-center">
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