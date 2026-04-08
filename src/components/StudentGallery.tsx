import { motion } from 'framer-motion';
import studentsData from '../data/students.json';
import './StudentGallery.css';

// ─── Unique gradient per student (seeded by index) ──────────────
const AVATAR_GRADIENTS = [
  ['#1e3a8a', '#3b82f6'],
  ['#1e3a6a', '#60a5fa'],
  ['#1e40af', '#93c5fd'],
  ['#1d4ed8', '#38bdf8'],
  ['#2563eb', '#818cf8'],
  ['#1e3a8a', '#6366f1'],
  ['#1e40af', '#a78bfa'],
  ['#1d4ed8', '#67e8f9'],
  ['#2563eb', '#34d399'],
  ['#1e3a8a', '#22d3ee'],
];

// ─── Get initials from name ─────────────────────────────────────
function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ─── Individual hexagon card ────────────────────────────────────
interface Student {
  id: number;
  name: string;
  level: string;
  imagePath: string;
  age?: number;
  achievement?: string;
  avatar?: string | null;
}

interface HexCardProps {
  student: Student;
  index: number;
}

function HexCard({ student, index }: HexCardProps) {
  const [g1, g2] = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
  const initials = getInitials(student.name);

  // Each bead gets its own bob timing for zero-G independence
  const bobDuration = 3 + (index % 5) * 0.4;
  const bobDelay = index * 0.3;

  return (
    <motion.div
      className="hex-card-wrapper"
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <motion.div
        className="hex-card"
        animate={{
          y: [0, -8, 0, 6, 0],
        }}
        transition={{
          duration: bobDuration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: bobDelay,
        }}
        whileHover={{
          scale: 1.06,
          transition: { duration: 0.25, ease: 'easeOut' },
        }}
      >
        {/* Hexagon frame */}
        <div className="hex-frame">
          <div className="hex-inner">
            {/* Avatar */}
            <div
              className="hex-avatar"
              style={{
                background: `linear-gradient(135deg, ${g1} 0%, ${g2} 100%)`,
              }}
            >
              <span className="hex-initials">{initials}</span>
            </div>
          </div>
          {/* Glow ring (visible on hover) */}
          <div className="hex-glow-ring" />
        </div>

        {/* Info */}
        <div className="hex-info">
          <span className="hex-name">{student.name}</span>
          <span className="hex-level">{student.level}</span>
          <span className="hex-achievement">{student.achievement}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Gallery Component ──────────────────────────────────────────
export default function StudentGallery() {
  return (
    <section className="gallery-section" id="student-gallery">
      <div className="gallery-header">
        <motion.span
          className="gallery-tag"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Our Champions
        </motion.span>
        <motion.h2
          className="gallery-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          The <span className="gallery-title-accent">Minds</span> That
          Inspire Us
        </motion.h2>
        <motion.p
          className="gallery-subtitle"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Meet the young prodigies who've turned mental math into a
          superpower.
        </motion.p>
      </div>

      <div className="hex-grid">
        {(studentsData as Student[]).map((student, i) => (
          <HexCard key={student.id} student={student} index={i} />
        ))}
      </div>
    </section>
  );
}
