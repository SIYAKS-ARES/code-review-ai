import React from 'react';
import styles from './About.module.css';

export const About: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>About</h1>
        
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What Does It Do?</h2>
          <p className={styles.text}>
            This tool evaluates students&apos; code and provides pedagogical feedback.
            The goal is not to give students the direct solution, but to teach them to think
            and develop their own solutions using the <strong>Socratic method</strong>.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What Is the Socratic Method?</h2>
          <p className={styles.text}>
            The Socratic method is based on asking questions that encourage students to think,
            rather than giving them the answers directly. This approach:
          </p>
          <ul className={styles.list}>
            <li>Improves critical thinking skills</li>
            <li>Encourages deep learning</li>
            <li>Strengthens problem-solving abilities</li>
            <li>Helps students arrive at their own solutions</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How Does It Work?</h2>
          <ol className={styles.list}>
            <li>
              <strong>Problem Description:</strong> Write down the problem you want to solve in detail.
              Specify the input/output format and constraints.
            </li>
            <li>
              <strong>Code Input:</strong> Write your solution in one of Python, Java, or C++.
            </li>
            <li>
              <strong>Evaluation:</strong> The system analyzes your code and:
              <ul className={styles.nestedList}>
                <li>Provides a qualitative assessment of your solution</li>
                <li>Lists detected issues and potential problems</li>
                <li>Gives Socratic hints (not full solutions!)</li>
              </ul>
            </li>
            <li>
              <strong>Improvement:</strong> Use the hints to improve your code and evaluate it again.
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Important Notes</h2>
          <div className={styles.infoBox}>
            <p className={styles.text}>
              ⚠️ This tool does not write code for you or provide complete solutions.
              Its purpose is to guide students to develop their own solutions.
            </p>
            <p className={styles.text}>
              💡 Sometimes a "Suggested Code" section may appear, but this is a secondary resource.
              Your priority should always be to use the Socratic hints to evolve your own solution.
            </p>
            <p className={styles.text}>
              📚 Your evaluation history is stored locally in your browser.
              The last 10 evaluations are saved automatically.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Supported Languages</h2>
          <div className={styles.languageGrid}>
            <div className={styles.languageCard}>
              <span className={styles.languageIcon}>🐍</span>
              <span className={styles.languageName}>Python</span>
            </div>
            <div className={styles.languageCard}>
              <span className={styles.languageIcon}>☕</span>
              <span className={styles.languageName}>Java</span>
            </div>
            <div className={styles.languageCard}>
              <span className={styles.languageIcon}>⚙️</span>
              <span className={styles.languageName}>C++</span>
            </div>
          </div>
        </section>

        <section className={styles.footer}>
          <p className={styles.footerText}>
            This tool is an LLM (Large Language Model) based learning assistant.
            We wish you success on your learning journey! 🚀
          </p>
        </section>
      </div>
    </div>
  );
};
