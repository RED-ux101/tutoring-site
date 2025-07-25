import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { BookOpen, Upload, Users, Download, GraduationCap, FileText } from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section with gradient background */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-16 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <GraduationCap className="w-4 h-4" />
                Damesha's Learning Hub
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Your Gateway to 
              <span className="text-primary block mt-2">
                Academic Excellence
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Access curated study materials, share your own resources, and join a community 
              dedicated to collaborative learning and academic growth.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {isAuthenticated() ? (
                <>
                  <Button asChild size="lg" className="text-lg px-8 py-6">
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
                  <Button asChild size="lg" className="text-lg px-8 py-6">
                    <Link to="/files">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Explore Materials
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                    <Link to="/submit">
                      <Upload className="w-5 h-5 mr-2" />
                      Contribute Resource
                    </Link>
                  </Button>
                </>
              )}
            </div>


          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need for academic success
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive platform designed to enhance your learning experience through 
              shared knowledge and collaborative study resources.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl mb-2">Rich Study Library</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Access a comprehensive collection of study guides, lecture notes, practice problems, 
                  and reference materials across multiple subjects and topics.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl mb-2">Community Driven</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Contribute your own study materials, notes, and resources to help fellow learners. 
                  Build a stronger academic community together.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl mb-2">Instant Access</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Download materials instantly with just one click. No registration barriers, 
                  no complicated processes - just immediate access to learning resources.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
              <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple. Effective. Collaborative.
            </h2>
            <p className="text-xl text-muted-foreground">
              Get started in three easy steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">Browse & Discover</h3>
                <p className="text-muted-foreground">
                  Explore our extensive collection of study materials organized by subject and type.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">Download & Study</h3>
                <p className="text-muted-foreground">
                  Download materials instantly and use them for your studies. No signup required.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">Share & Contribute</h3>
                <p className="text-muted-foreground">
                  Submit your own helpful resources to give back to the learning community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to enhance your learning journey?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Join thousands of students who are already benefiting from our collaborative 
              learning platform. Start exploring today.
            </p>
            
            {!isAuthenticated() && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="secondary" size="lg" className="text-lg px-8 py-6">
                  <Link to="/files">
                    <FileText className="w-5 h-5 mr-2" />
                    Start Browsing
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  <Link to="/submit">
                    <Upload className="w-5 h-5 mr-2" />
                    Submit Resource
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 