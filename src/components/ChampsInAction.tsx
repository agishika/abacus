import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './ChampsInAction.css';

// Facebook reel embed URL (oEmbed player format)
const FB_VIDEO_URL =
  'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1849896072334751&show_text=false';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export default function ChampsInAction() {
  const [showVideo, setShowVideo] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      className="champs-video-section"
      id="champs-in-action"
      ref={sectionRef}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* ─── Header ───────────────────────────────────────── */}
        <motion.div className="champs-video-header" variants={fadeUp}>
          <h2>
            Watch Our Champions Solve Math in Seconds!{' '}
            <span className="header-emoji" role="img" aria-label="trophy">
              🏆
            </span>
          </h2>
          <p className="champs-video-subtitle">
            See what real Champs World students can do with the power of abacus
          </p>
        </motion.div>

        {/* ─── Video Container ──────────────────────────────── */}
        <motion.div className="champs-video-container" variants={fadeUp}>
          <div className="champs-video-frame">
            <div className="champs-video-iframe-wrap">
              {/* Lazy-load the iframe only after user clicks play */}
              {showVideo ? (
                <iframe
                  src={FB_VIDEO_URL}
                  title="Champs in Action – Facebook Reel"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                /* Placeholder with 3D Play Button */
                <div
                  className="champs-play-overlay"
                  onClick={() => setShowVideo(true)}
                  role="button"
                  tabIndex={0}
                  aria-label="Play video"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setShowVideo(true);
                  }}
                >
                  <div className="play-btn-3d">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ─── Mascot ─────────────────────────────────────── */}
          <motion.div
            className="champs-mascot"
            initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
            animate={
              isInView
                ? { opacity: 1, scale: 1, rotate: 0 }
                : { opacity: 0, scale: 0.5, rotate: -15 }
            }
            transition={{ delay: 0.6, duration: 0.5, type: 'spring' }}
          >
            <img
              src="/math-champ-mascot.png"
              alt="Math Champ mascot"
              loading="lazy"
              width={110}
              height={110}
            />
          </motion.div>

          {/* ─── Speech Bubble ──────────────────────────────── */}
          <motion.div
            className="mascot-speech"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isInView
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.8 }
            }
            transition={{ delay: 0.9, duration: 0.4 }}
          >
            Watch me! 🧮
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
