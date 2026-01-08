import React from 'react';
import { Language } from '../types';
import styles from './LanguageSelect.module.css';

interface LanguageSelectProps {
  value: Language;
  onChange: (value: Language) => void;
}

export const LanguageSelect: React.FC<LanguageSelectProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className={styles.container}>
      <label htmlFor="language-select" className={styles.label}>
        Kod Dili *
      </label>
      <select
        id="language-select"
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value as Language)}
      >
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="cpp">C++</option>
      </select>
    </div>
  );
};
