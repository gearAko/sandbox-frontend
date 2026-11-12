"use client";

import { Container } from "@/components";
import styles from "./page.module.scss";
import ThreeBackground from "@/components/ThreeBackground/ThreeBackground";

function getGridColumns(itemCount: number): number {
  // Choose the largest column count (up to 3) that divides the item count evenly,
  // so every grid row fills completely with no empty blocks. Floor at 2 columns.
  // Examples: 4 → 2, 6 → 3, 8 → 2, 5 → 2, 7 → 2, 3 → 3.
  for (let cols = 3; cols >= 2; cols--) {
    if (itemCount % cols === 0) {
      return cols;
    }
  }
  return 2;
}

export default function Home() {
  const projects = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Project ${i + 1}`,
    desc: "Short description goes here.",
  }));
  const projectColumns = getGridColumns(projects.length);

  return (
    <div className={styles.page}>
      <ThreeBackground />
      <Container id="home" className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Hi, I&apos;m <span className={styles.name}>Your Name</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Placeholder for your introduction or tagline.
          </p>
          <div className={styles.heroActions}>
            <a
              href="#projects"
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              View Work
            </a>
            <a
              href="#contact"
              className={`${styles.btn} ${styles.btnSecondary}`}
            >
              Contact
            </a>
          </div>
        </div>
      </Container>

      <Container id="about" className={styles.section}>
        <h2 className={styles.sectionTitle}>About</h2>
        <p className={styles.sectionText}>
          Placeholder content for your about section. Tell visitors who you are,
          what you do, and what technologies you enjoy working with.
        </p>
      </Container>

      <Container id="projects" className={styles.section}>
        <h2 className={styles.sectionTitle}>Projects</h2>
        <div
          className={styles.projectGrid}
          style={
            {
              "--project-columns": String(projectColumns),
            } as React.CSSProperties
          }
        >
          {projects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.projectPlaceholder}>{project.title}</div>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.projectDesc}>{project.desc}</p>
            </div>
          ))}
        </div>
      </Container>

      <Container id="contact" className={styles.section}>
        <h2 className={styles.sectionTitle}>Contact</h2>
        <p className={styles.sectionText}>
          Placeholder for contact information or a contact form.
        </p>
      </Container>
    </div>
  );
}
