import React, { useState } from 'react';
import styles from './CollapsiblePanel.module.css';

interface CollapsiblePanelProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={styles.container}>
      <button
        className={styles.header}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={styles.title}>{title}</span>
        <span className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && <div className={styles.content}>{children}</div>}
    </div>
  );
};
