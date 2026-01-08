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
        Problem Tanımı *
      </label>
      <p className={styles.helper}>
        Ne beklediğini net yaz: giriş, çıkış, kısıtlar ve örnek.
      </p>
      <textarea
        id="problem-input"
        className={`${styles.textarea} ${error ? styles.error : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Örn: Bir dizi içindeki tekrar eden ilk sayıyı bulun. Girdi/çıktı formatını ve kısıtları yazın…"
        rows={8}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
