import { useState, useRef, type FormEvent } from 'react';
import { motion, useInView } from 'framer-motion';
import './ContactSection.css';

/* ─── Animation variants ────────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: 'blur(5px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

/* ─── SVG Icons (inline for Champs Blue colouring) ──────────── */
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.72 11.72 0 003.66.59 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.12 8.44 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99C18.34 21.12 22 16.99 22 12z" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

/* ─── Component ─────────────────────────────────────────────── */
export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In production, wire this up to an API / email service
    setSubmitted(true);
  };

  return (
    <section
      className="contact-section"
      id="contact"
      ref={sectionRef}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* ─── Header ─────────────────────────────────────── */}
        <motion.div className="contact-header" variants={fadeUp}>
          <h2>Get in Touch ✉️</h2>
          <p>
            Ready to give your child a competitive edge? Reach out — we'd love
            to hear from you!
          </p>
        </motion.div>

        {/* ─── Two-Column Grid ────────────────────────────── */}
        <div className="contact-layout">
          {/* ─── LEFT: Contact Form ──────────────────────── */}
          <motion.div className="contact-form-card" variants={fadeUp}>
            <h3 className="contact-form-title">
              <span className="title-icon">📝</span> Send Us a Message
            </h3>

            {submitted ? (
              <div className="contact-success">
                <span className="success-icon">🎉</span>
                <h3>Message Sent!</h3>
                <p>
                  Thank you for reaching out. We'll get back to you within
                  24 hours.
                </p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact-parent-name">Parent's Name</label>
                    <input
                      type="text"
                      id="contact-parent-name"
                      name="parentName"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-child-name">Child's Name</label>
                    <input
                      type="text"
                      id="contact-child-name"
                      name="childName"
                      placeholder="Your child's name"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact-email">Email</label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      placeholder="you@email.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-phone">Phone</label>
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      placeholder="+91-XXXXXXXXXX"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-program">Program Interest</label>
                  <select id="contact-program" name="program">
                    <option value="">Select a program…</option>
                    <option value="level1">Level 1 — Foundation</option>
                    <option value="level2">Level 2 — Intermediate</option>
                    <option value="level3">Level 3 — Advanced</option>
                    <option value="other">Other / Not Sure</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Tell us what you'd like to know…"
                    rows={4}
                  />
                </div>

                <motion.button
                  type="submit"
                  className="contact-submit-btn"
                  id="contact-submit"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Send Message <SendIcon />
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* ─── RIGHT: Contact Info Sidebar ─────────────── */}
          <motion.div className="contact-info-sidebar" variants={fadeUp}>
            {/* Info Card */}
            <div className="contact-info-card">
              <h3 className="contact-info-title">
                <span className="title-icon">📞</span> Contact Info
              </h3>

              {/* Phone */}
              <div className="contact-info-item">
                <div className="contact-icon">
                  <PhoneIcon />
                </div>
                <div className="contact-info-details">
                  <span className="contact-info-label">Phone</span>
                  <a
                    href="tel:+919999062178"
                    className="contact-info-value"
                    id="contact-phone-link"
                  >
                    +91-9999062178
                  </a>
                  <span className="contact-person-name">Ankita Agarwal</span>
                </div>
              </div>

              {/* Email */}
              <div className="contact-info-item">
                <div className="contact-icon">
                  <EmailIcon />
                </div>
                <div className="contact-info-details">
                  <span className="contact-info-label">Email</span>
                  <a
                    href="mailto:champsworld.abacus@gmail.com"
                    className="contact-info-value"
                    id="contact-email-link"
                  >
                    champsworld.abacus@gmail.com
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="contact-info-item">
                <div className="contact-icon">
                  <LocationIcon />
                </div>
                <div className="contact-info-details">
                  <span className="contact-info-label">Location</span>
                  <span className="contact-info-value">
                    New Delhi, India
                  </span>
                </div>
              </div>
            </div>

            {/* Follow Us Card */}
            <div className="follow-us-card">
              <h3 className="follow-us-title">Follow Us 🌟</h3>
              <div className="follow-us-links">
                <a
                  href="https://www.facebook.com/profile.php?id=61574439505037"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="follow-us-link"
                  id="follow-facebook"
                >
                  <FacebookIcon />
                  Facebook
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
