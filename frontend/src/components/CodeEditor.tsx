import React from 'react';
import { Language } from '../types';
import styles from './CodeEditor.module.css';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  error?: string;
}

/**
 * CodeEditor component with textarea fallback.
 * 
 * Note: Monaco Editor integration was not included in this implementation.
 * If you want to add Monaco Editor, install @monaco-editor/react package
 * and replace the textarea with the Monaco Editor component.
 * For now, this uses a styled textarea with syntax highlighting hints via CSS.
 */
export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  error,
}) => {
  return (
    <div className={styles.container}>
      <label htmlFor="code-editor" className={styles.label}>
        Candidate Source Code *
      </label>
      <p className={styles.helper}>
        Compiling is not enough; logical correctness will be analyzed.
      </p>
      <div className={styles.editorWrapper}>
        <textarea
          id="code-editor"
          className={`${styles.codeArea} ${error ? styles.error : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="E.g., paste your Python/Java/C++ solution here…"
          spellCheck={false}
          data-language={language}
        />
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
