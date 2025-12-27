import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiZap } from 'react-icons/fi';
import { MdAutoAwesome } from 'react-icons/md';
import { useResumeStore } from '../store/resumeStore';
import * as api from '../utils/api';
import toast from 'react-hot-toast';
import Footer from '../components/Footer';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [apiStatus, setApiStatus] = useState<boolean | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    api
      .healthCheck()
      .then(() => setApiStatus(true))
      .catch(() => setApiStatus(false));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
      {/* Animated background orbs */}
      <motion.div
        className="fixed top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: [0, 30, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="fixed top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: [0, -30, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="fixed -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Mouse follow glow effect */}
      <motion.div
        className="fixed w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full filter blur-3xl pointer-events-none"
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 200,
        }}
      />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-md bg-white/5 sticky top-0 z-40 border-b border-purple-500/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <FiZap className="text-white text-xl" />
            </motion.div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              AI Resume Builder
            </h1>
          </motion.div>

          {apiStatus !== null && (
            <motion.div
              className="flex items-center gap-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className={`w-3 h-3 rounded-full ${
                  apiStatus ? 'bg-green-500' : 'bg-red-500'
                }`}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm text-gray-400">
                {apiStatus ? 'System Ready' : 'Offline'}
              </span>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 z-10">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Content */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div>
              <motion.div
                className="inline-block"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-purple-500/50 rounded-full text-sm text-purple-300 backdrop-blur-sm">
                  ✨ Powered by Advanced AI
                </span>
              </motion.div>
            </div>

            <div className="space-y-4">
              <motion.h2
                className="text-6xl sm:text-7xl font-black text-white leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Craft Your
              </motion.h2>
              <motion.h2
                className="text-6xl sm:text-7xl font-black leading-tight bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Perfect Resume
              </motion.h2>
              <motion.h2
                className="text-6xl sm:text-7xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  textShadow: [
                    '0 0 20px rgba(34, 197, 94, 0.5)',
                    '0 0 40px rgba(59, 130, 246, 0.5)',
                    '0 0 20px rgba(168, 85, 247, 0.5)',
                  ],
                }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                In Minutes!
              </motion.h2>
            </div>

            <motion.p
              className="text-xl text-gray-300 leading-relaxed max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Harness the power of cutting-edge AI to create a professional, ATS-friendly resume that gets you noticed. Our intelligent assistant guides you through every step.
            </motion.p>

            {/* Feature bullets with animation */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {[
                'AI-powered content generation tailored to your profession',
                '100% ATS-compliant formatting',
                'Multiple professional templates',
                'Export as PDF or Word document',
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3 group"
                  whileHover={{ x: 10 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <motion.div
                    className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  >
                    <span className="text-white text-sm font-bold">✓</span>
                  </motion.div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <motion.button
                onClick={onGetStarted}
                disabled={!apiStatus}
                className="relative group inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-10 py-4 rounded-xl transition-all overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-3">
                  Start Building Your Resume
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <FiArrowRight />
                  </motion.span>
                </span>
              </motion.button>
            </motion.div>

            {!apiStatus && (
              <motion.p
                className="text-red-400 text-sm"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⚠️ Backend server is not responding. Check your API connection.
              </motion.p>
            )}
          </motion.div>

          {/* Right Visual - Animated Resume Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl opacity-25 blur-3xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />

            <motion.div
              className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
              whileHover={{ y: -10, boxShadow: '0 30px 60px rgba(59, 130, 246, 0.3)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              {/* Animated lines simulating resume content */}
              <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Header */}
                <div>
                  <motion.div
                    className="h-4 bg-gradient-to-r from-blue-400 to-purple-500 w-32 rounded-full"
                    variants={itemVariants}
                  />
                  <motion.div
                    className="h-2 bg-white/20 w-full rounded-full mt-3"
                    variants={itemVariants}
                  />
                  <motion.div
                    className="h-2 bg-white/20 w-2/3 rounded-full mt-2"
                    variants={itemVariants}
                  />
                </div>

                {/* Experience Section */}
                <div className="pt-4 space-y-3">
                  <motion.div
                    className="h-2 bg-gradient-to-r from-purple-400 to-pink-400 w-2/5 rounded-full"
                    variants={itemVariants}
                  />
                  <motion.div
                    className="h-2 bg-white/20 w-full rounded-full"
                    variants={itemVariants}
                  />
                  <motion.div
                    className="h-2 bg-white/20 w-5/6 rounded-full"
                    variants={itemVariants}
                  />
                </div>

                {/* Skills Section */}
                <div className="pt-4 space-y-3">
                  <motion.div
                    className="h-2 bg-gradient-to-r from-cyan-400 to-blue-400 w-1/3 rounded-full"
                    variants={itemVariants}
                  />
                  <motion.div
                    className="h-2 bg-white/20 w-full rounded-full"
                    variants={itemVariants}
                  />
                  <motion.div
                    className="h-2 bg-white/20 w-4/5 rounded-full"
                    variants={itemVariants}
                  />
                </div>
              </motion.div>

              {/* Floating badges */}
              <motion.div
                className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                ⚡ AI Powered
              </motion.div>

              <motion.div
                className="absolute bottom-6 -left-4 bg-gradient-to-r from-green-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                ✓ ATS Ready
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.h3
              className="text-4xl sm:text-5xl font-black text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Why Choose Our Resume Builder?
            </motion.h3>
            <motion.div
              className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '✨', title: 'AI-Powered', desc: 'Smart content generation for each section' },
              { icon: '📄', title: 'Templates', desc: 'Multiple professional designs' },
              { icon: '🚀', title: 'Lightning Fast', desc: 'Create your resume in minutes' },
              { icon: '🎯', title: 'ATS Optimized', desc: 'Pass applicant tracking systems' },
              { icon: '⚡', title: 'Real-time Preview', desc: 'See changes instantly' },
              { icon: '📥', title: 'Easy Export', desc: 'PDF, Word, and more formats' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:border-purple-500/50 transition-all overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

                <motion.div
                  className="text-5xl mb-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {feature.icon}
                </motion.div>

                <h4 className="text-xl font-bold text-white mb-2 relative z-10">
                  {feature.title}
                </h4>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors relative z-10">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <motion.section
        className="relative py-20 z-10 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl" />

        <motion.div
          className="max-w-4xl mx-auto px-4 text-center relative z-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h3
            className="text-4xl sm:text-5xl font-black text-white mb-6"
            variants={itemVariants}
          >
            Ready to Transform Your Career?
          </motion.h3>
          <motion.p
            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Join thousands of professionals who've created stunning resumes with our AI-powered builder. Your dream job is just one click away!
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            <motion.button
              onClick={onGetStarted}
              disabled={!apiStatus}
              className="relative group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-10 py-4 rounded-xl transition-all overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                <FiZap /> Start Now
              </span>
            </motion.button>

            <motion.button
              className="group inline-flex items-center justify-center gap-3 border-2 border-purple-500/50 hover:border-purple-400 text-white font-bold px-10 py-4 rounded-xl transition-all hover:bg-white/5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More <FiArrowRight />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
