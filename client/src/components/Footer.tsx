import React from 'react';
import './Footer.css';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaCode, FaTrophy, FaHackerrank } from 'react-icons/fa';
import { SiLeetcode, SiGeeksforgeeks } from 'react-icons/si';

const Footer: React.FC = () => {
  const socialLinks = [
    { href: 'https://linkedin.com/in/asifalam26/', icon: <FaLinkedin />, label: 'LinkedIn' },
    { href: 'https://github.com/Code-Asif', icon: <FaGithub />, label: 'GitHub' },
    { href: 'https://leetcode.com/u/code_asif/', icon: <SiLeetcode />, label: 'LeetCode' },
    { href: 'https://geeksforgeeks.org/user/asifcs26/', icon: <SiGeeksforgeeks />, label: 'GeeksforGeeks' },
    { href: 'https://hackerrank.com/profile/safety_asif_alam', icon: <FaHackerrank />, label: 'HackerRank' },
    { href: 'mailto:developer.asif@outlook.com', icon: <FaEnvelope />, label: 'Email' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  return (
    <footer className="footer">
      {/* Animated background elements */}
      <div className="footer-animated-bg">
        <motion.div
          className="floating-orb orb-1"
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="floating-orb orb-2"
          animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="floating-orb orb-3"
          animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        className="footer-container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Brand Section with Big Animated Name */}
        <motion.div className="footer-section footer-brand" variants={itemVariants}>
          <div className="footer-name-wrapper">
            <motion.h3 className="footer-logo-animated">
              {'ASIF ALAM'.split('').map((char, i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: 'easeInOut',
                  }}
                  className="char"
                >
                  {char}
                </motion.span>
              ))}
            </motion.h3>
          </div>
          <motion.p
            className="footer-tagline"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Junior Software Developer • AI Enthusiast • Full Stack Developer
          </motion.p>
          <p className="footer-description">
            Crafting elegant digital solutions with cutting-edge technology. Specializing in AI-powered applications, full-stack development, and creating tools that transform how people build their professional presence.
          </p>
          <motion.div
            className="footer-stats"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="stat">
              <div className="stat-number">500+</div>
              <div className="stat-label">Resumes Built</div>
            </div>
            <div className="stat">
              <div className="stat-number">100%</div>
              <div className="stat-label">ATS Compatible</div>
            </div>
            <div className="stat">
              <div className="stat-number">24/7</div>
              <div className="stat-label">AI Support</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Social Links Section */}
        <motion.div className="footer-section" variants={itemVariants}>
          <h4 className="footer-heading">Connect</h4>
          <ul className="footer-links social-links-grid">
            {socialLinks.filter(link => link.href).map((link, index) => (
              <motion.li
                key={index}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="cube-link social-link"
                  title={link.label}
                >
                  <span className="cube-link-inner">
                    <span className="cube-face cube-face-front">{link.icon}</span>
                    <span className="cube-face cube-face-bottom">{link.icon}</span>
                  </span>
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Contact Section */}
        <motion.div className="footer-section" variants={itemVariants}>
          <h4 className="footer-heading">Get In Touch</h4>
          <div className="footer-contact">
            <motion.p
              whileHover={{ x: 5, color: '#e50914' }}
              transition={{ type: 'spring' }}
            >
              <FaEnvelope /> developer.asif@outlook.com
            </motion.p>
            <motion.p
              whileHover={{ x: 5, color: '#e50914' }}
              transition={{ type: 'spring' }}
            >
              <FaCode /> Open for collaborations
            </motion.p>
            <motion.p
              whileHover={{ x: 5, color: '#e50914' }}
              transition={{ type: 'spring' }}
            >
              <FaTrophy /> Let's build something extraordinary!
            </motion.p>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Bar */}
      <motion.div
        className="footer-bottom"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="footer-bottom-content">
          <p className="footer-copy">© {new Date().getFullYear()} ASIF. All rights reserved.</p>
          <motion.p
            className="footer-made"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Made with <span className="heart">❤️</span> by ASIF using React, TypeScript & Framer Motion
          </motion.p>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
