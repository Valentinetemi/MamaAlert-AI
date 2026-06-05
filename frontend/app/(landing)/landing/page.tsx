'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain, Users, Shield, Clock, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning analyzes your symptoms instantly and provides accurate assessments.',
  },
  {
    icon: Clock,
    title: 'Immediate Response',
    description: 'Get real-time risk assessment and actionable recommendations in seconds.',
  },
  {
    icon: Shield,
    title: 'Confidential & Safe',
    description: 'Your health data is encrypted and protected. Your privacy is our priority.',
  },
  {
    icon: Users,
    title: 'Healthcare Integration',
    description: 'Connect with medical professionals for follow-up care and consultations.',
  },
  {
    icon: TrendingUp,
    title: 'Health Monitoring',
    description: 'Track symptoms and health trends over time with comprehensive analytics.',
  },
  {
    icon: Heart,
    title: 'Maternal Focused',
    description: 'Specifically designed for pregnant women with cultural sensitivity.',
  },
];

const testimonials = [
  {
    name: 'Aderonke O.',
    role: 'Mother of Two',
    quote: 'MamaAlert gave me peace of mind during my pregnancy. The quick assessment helped me know when to see my doctor.',
    initials: 'AO',
  },
  {
    name: 'Dr. Chioma Adeyemi',
    role: 'Obstetric Specialist',
    quote: 'As a healthcare provider, I appreciate how MamaAlert helps patients make informed decisions about their health.',
    initials: 'CA',
  },
  {
    name: 'Zainab M.',
    role: 'Expectant Mother',
    quote: 'The recommendations were clear and helpful. I felt supported throughout my pregnancy journey.',
    initials: 'ZM',
  },
];

const steps = [
  {
    number: '1',
    title: 'Sign Up',
    description: 'Create your secure account in less than a minute',
  },
  {
    number: '2',
    title: 'Describe Symptoms',
    description: "Tell us about any symptoms or concerns you're experiencing",
  },
  {
    number: '3',
    title: 'Get Analysis',
    description: 'Receive AI-powered assessment and health recommendations',
  },
  {
    number: '4',
    title: 'Take Action',
    description: 'Follow recommendations or connect with healthcare providers',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFF5F5]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[#FECDD3]/60 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#F9A8D4] to-[#93C5FD]">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-[#1C1014]">MamaAlert</span>
          </div>
          <div className="flex gap-3">
            <Link href="/signin">
              <Button
                variant="outline"
                className="border-[#FECDD3] text-[#6B5057] hover:border-[#F9A8D4] hover:bg-[#FFF5F5] hover:text-[#BE185D]"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-[#F9A8D4] to-[#93C5FD] text-white hover:opacity-90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FECDD3] bg-white/80 px-4 py-1.5 text-sm text-[#BE185D]">
              Your garden of care begins here
            </p>
            <h1 className="mb-6 text-5xl font-light leading-tight text-[#1C1014] md:text-6xl" style={{ fontFamily: "'Playfair Display', serif" }}>
              Maternal Health Support at Your Fingertips
            </h1>
            <p className="mb-8 text-xl text-[#6B5057]">
              AI-powered health assessment designed specifically for pregnant women. Get instant insights and connect with healthcare providers when you need them most.
            </p>
            <div className="flex gap-4">
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-[#F9A8D4] to-[#93C5FD] px-8 py-6 text-lg text-white hover:opacity-90">
                  Start Free Today
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  variant="outline"
                  className="border-[#FECDD3] px-8 py-6 text-lg text-[#6B5057] hover:border-[#F9A8D4] hover:bg-white"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex min-h-96 items-center justify-center rounded-[2.5rem] border border-[#FECDD3]/50 bg-gradient-to-br from-[#F9A8D4]/20 via-[#FFF5F5] to-[#93C5FD]/20 p-12 shadow-[0_32px_80px_rgba(249,168,212,0.14)]">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F9A8D4] to-[#93C5FD]">
                <Heart className="h-12 w-12 text-white" />
              </div>
              <p className="text-[#6B5057]">Your wellness journey starts here</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y border-[#FECDD3]/40 bg-white/70 py-20 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-light text-[#1C1014]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Why Choose MamaAlert
            </h2>
            <p className="text-xl text-[#6B5057]">Comprehensive maternal health support built with care and expertise</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="border-[#FECDD3]/50 bg-white/80 transition-shadow duration-300 hover:shadow-[0_20px_60px_rgba(249,168,212,0.12)]"
                >
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FDF2F8]">
                      <Icon className="h-6 w-6 text-[#F9A8D4]" />
                    </div>
                    <CardTitle className="text-lg text-[#1C1014]">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#6B5057]">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-light text-[#1C1014]" style={{ fontFamily: "'Playfair Display', serif" }}>
            How It Works
          </h2>
          <p className="text-xl text-[#6B5057]">Simple, quick, and secure process</p>
        </div>
        <div className="grid gap-8 md:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute left-[60%] top-12 hidden h-1 w-[calc(100%+2rem)] bg-[#F9A8D4]/20 md:block" />
              )}
              <div className="relative z-10">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#F9A8D4] to-[#93C5FD] text-white shadow-[0_8px_24px_rgba(249,168,212,0.35)]">
                  <span className="text-3xl font-semibold">{step.number}</span>
                </div>
                <h3 className="mb-2 text-center text-lg font-medium text-[#1C1014]">{step.title}</h3>
                <p className="text-center text-sm text-[#6B5057]">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-[#FECDD3]/40 bg-white/70 py-20 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-light text-[#1C1014]" style={{ fontFamily: "'Playfair Display', serif" }}>
              What People Say
            </h2>
            <p className="text-xl text-[#6B5057]">Trusted by expecting mothers and healthcare providers</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-[#FECDD3]/50 bg-white/80">
                <CardContent className="pt-6">
                  <div className="mb-4 flex gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F9A8D4] to-[#93C5FD]">
                      <span className="font-semibold text-white">{testimonial.initials}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-[#1C1014]">{testimonial.name}</p>
                      <p className="text-sm text-[#B09099]">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="italic text-[#6B5057]">&ldquo;{testimonial.quote}&rdquo;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="mb-6 text-4xl font-light text-[#1C1014]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Ready to Take Control of Your Maternal Health?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-[#6B5057]">
          Join thousands of women who trust MamaAlert for their pregnancy health monitoring and support.
        </p>
        <Link href="/signup">
          <Button className="bg-gradient-to-r from-[#F9A8D4] to-[#93C5FD] px-10 py-7 text-lg text-white hover:opacity-90">
            Get Started - It&apos;s Free
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#FECDD3]/40 bg-white/60 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-[#F9A8D4]" />
                <span className="font-semibold text-[#1C1014]">MamaAlert</span>
              </div>
              <p className="text-sm text-[#6B5057]">Maternal health support powered by AI</p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-[#1C1014]">Product</h3>
              <ul className="space-y-2 text-sm text-[#6B5057]">
                <li><a href="#" className="hover:text-[#BE185D]">Features</a></li>
                <li><a href="#" className="hover:text-[#BE185D]">Security</a></li>
                <li><a href="#" className="hover:text-[#BE185D]">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-[#1C1014]">Company</h3>
              <ul className="space-y-2 text-sm text-[#6B5057]">
                <li><a href="#" className="hover:text-[#BE185D]">About</a></li>
                <li><a href="#" className="hover:text-[#BE185D]">Blog</a></li>
                <li><a href="#" className="hover:text-[#BE185D]">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-[#1C1014]">Legal</h3>
              <ul className="space-y-2 text-sm text-[#6B5057]">
                <li><a href="#" className="hover:text-[#BE185D]">Privacy</a></li>
                <li><a href="#" className="hover:text-[#BE185D]">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#FECDD3]/40 pt-8">
            <p className="text-center text-sm text-[#B09099]">
              &copy; 2024 MamaAlert. All rights reserved. | Not a substitute for professional medical advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
