import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import studentsData from '../data/students.json';
import './Gallery.css';

// Import all images from the students folder to get their Vite-processed URLs
const imageModules = import.meta.glob('/src/assets/students/*.{png,jpg,jpeg,webp,svg}', { eager: true, query: '?url', import: 'default' });

interface Student {
  id: number;
  name: string;
  imagePath: string;
  level: string;
}

const levels = ['All', 'Level 1', 'Level 2', 'Level 3', 'Graduates'];

const Gallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');

  const filteredStudents = (studentsData as Student[]).filter(
    (student) => activeTab === 'All' || student.level === activeTab
  );

  return (
    <section className="clean-gallery-section" id="student-gallery">
      <div className="clean-gallery-header">
        <h2>Our Champions</h2>
      </div>

      <div className="gallery-tabs">
        {levels.map((level) => (
          <button
            key={level}
            className={`gallery-tab ${activeTab === level ? 'active' : ''}`}
            onClick={() => setActiveTab(level)}
          >
            {level}
          </button>
        ))}
      </div>

      <motion.div layout className="clean-gallery-grid">
        <AnimatePresence mode="popLayout">
          {filteredStudents.map((student) => {
            // Find the image URL from glob based on the exact path matched in JSON
            const srcUrl = (imageModules[student.imagePath] as string) || '';
            
            return (
              <motion.div
                key={student.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="clean-gallery-item"
              >
                <div className="clean-gallery-image-wrapper">
                  {/* Fallback to simple bg if image wasn't found in glob */}
                  {srcUrl ? (
                    <img src={srcUrl} alt={`Student ${student.name}`} loading="lazy" />
                  ) : (
                    <div className="image-placeholder">No Image</div>
                  )}
                </div>
                <div className="clean-gallery-caption">
                  {student.name}
                  <div className="clean-gallery-level">{student.level}</div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default Gallery;
