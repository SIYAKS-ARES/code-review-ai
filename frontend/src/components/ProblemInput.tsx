import React from 'react';
import styles from './ProblemInput.module.css';

interface ProblemInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const ProblemInput: React.FC<ProblemInputProps> = ({
  value,
  onChange,
  error,
}) => {
  return (
    <div className={styles.container}>
      <label htmlFor="problem-input" className={styles.label}>
        Problem Description *
      </label>
      <p className={styles.helper}>
        Be explicit about input, output, constraints, and examples.
      </p>
      <textarea
        id="problem-input"
        className={`${styles.textarea} ${error ? styles.error : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="E.g., Find the first recurring number in an array. Describe input/output format and constraints…"
        rows={8}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
