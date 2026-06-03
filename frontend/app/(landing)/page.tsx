'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain, Users, Shield, Clock, TrendingUp } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const featureIcons = [
  { icon: Brain, titleKey: 'ai_powered_analysis', descriptionKey: 'advanced_ml' },
  { icon: Clock, titleKey: 'immediate_response', descriptionKey: 'real_time_assessment' },
  { icon: Shield, titleKey: 'confidential_safe', descriptionKey: 'data_encrypted' },
  { icon: Users, titleKey: 'healthcare_integration', descriptionKey: 'connect_providers' },
  { icon: TrendingUp, titleKey: 'health_monitoring', descriptionKey: 'track_symptoms' },
  { icon: Heart, titleKey: 'maternal_focused', descriptionKey: 'cultural_sensitivity' },
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
  { number: '1', titleKey: 'sign_up_form', descriptionKey: 'describe_symptoms' },
  { number: '2', titleKey: 'describe_symptoms', descriptionKey: 'get_analysis' },
  { number: '3', titleKey: 'get_analysis', descriptionKey: 'take_action' },
  { number: '4', titleKey: 'take_action', descriptionKey: 'product' },
];

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#f5ede3]">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-[#f4c2c6]" />
            <span className="font-bold text-lg text-gray-900">MamaAlert</span>
          </div>
          <div className="flex gap-3 items-center">
            <LanguageSwitcher />
            <Link href="/signin">
              <Button variant="outline" className="border-gray-300 text-gray-900 hover:bg-gray-50">
                {t('sign_in')}
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#a8c5a3] hover:bg-[#96b391] text-white">
                {t('get_started')}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {t('maternal_health')}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {t('ai_powered')}
            </p>
            <div className="flex gap-4">
              <Link href="/signup">
                <Button className="bg-[#f4c2c6] hover:bg-[#f0b0b7] text-gray-900 text-lg px-8 py-6">
                  {t('start_free')}
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" className="border-gray-300 text-gray-900 hover:bg-gray-50 text-lg px-8 py-6">
                  {t('learn_more')}
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#f4c2c6]/20 to-[#a8c5a3]/20 rounded-2xl p-12 flex items-center justify-center min-h-96">
            <div className="text-center">
              <Heart className="w-24 h-24 text-[#f4c2c6] mx-auto mb-4" />
              <p className="text-gray-600">{t('join_mama_alert')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('why_choose')}</h2>
            <p className="text-xl text-gray-600">{t('comprehensive_support')}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureIcons.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="bg-[#a8c5a3]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#a8c5a3]" />
                    </div>
                    <CardTitle className="text-lg text-gray-900">{t(feature.titleKey as any)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{t(feature.descriptionKey as any)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('how_it_works')}</h2>
          <p className="text-xl text-gray-600">{t('simple_secure')}</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[calc(100%+2rem)] h-1 bg-[#a8c5a3]/20" />
              )}
              <div className="relative z-10">
                <div className="bg-[#a8c5a3] text-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold">{step.number}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">{t(step.titleKey as any)}</h3>
                <p className="text-gray-600 text-center text-sm">{t(step.descriptionKey as any)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('what_people_say')}</h2>
            <p className="text-xl text-gray-600">{t('trusted_by')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="pt-6">
                  <div className="flex gap-4 mb-4">
                    <div className="bg-[#f4c2c6] w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-semibold text-gray-900">{testimonial.initials}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">{t('ready_to_start')}</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {t('join_thousands')}
        </p>
        <Link href="/signup">
          <Button className="bg-[#a8c5a3] hover:bg-[#96b391] text-white text-lg px-10 py-7">
            {t('get_started_free')}
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-[#f4c2c6]" />
                <span className="font-bold text-gray-900">MamaAlert</span>
              </div>
              <p className="text-sm text-gray-600">Maternal health support powered by AI</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">{t('product')}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">{t('features')}</a></li>
                <li><a href="#" className="hover:text-gray-900">{t('security')}</a></li>
                <li><a href="#" className="hover:text-gray-900">{t('pricing')}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">{t('company')}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">{t('about')}</a></li>
                <li><a href="#" className="hover:text-gray-900">{t('blog')}</a></li>
                <li><a href="#" className="hover:text-gray-900">{t('contact')}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">{t('legal')}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">{t('privacy')}</a></li>
                <li><a href="#" className="hover:text-gray-900">{t('terms')}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8">
            <p className="text-center text-sm text-gray-600">
              &copy; 2024 MamaAlert. {t('all_rights_reserved')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
