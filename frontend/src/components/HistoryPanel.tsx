import React from 'react';
import { HistoryItem, SingleModeResponse } from '../types';
import { formatDateTime, getLanguageLabel, truncateText } from '../utils/helpers';
import styles from './HistoryPanel.module.css';

interface HistoryPanelProps {
  items: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  items,
  onSelectItem,
  onClearHistory,
}) => {
  const getModelLabel = (modelId: string): string => {
    // Map model IDs to short display names
    const modelNames: Record<string, string> = {
      'gpt-4o': 'GPT-4o',
      'gemini-1.5-pro': 'Gemini',
      'claude-3.5-sonnet': 'Claude'
    };
    return modelNames[modelId] || modelId;
  };

  const renderItemContent = (item: HistoryItem) => {
    const isCompare = item.mode === 'compare';

    if (isCompare) {
      return (
        <>
          <div className={styles.itemHeader}>
            <span className={styles.compareLabel}>Comparison</span>
            <span className={styles.language}>
              {getLanguageLabel(item.language)}
            </span>
          </div>
          <p className={styles.verdict}>
            {item.models.map(getModelLabel).join(', ')} compared
          </p>
        </>
      );
    } else {
      const singleResult = item.result as SingleModeResponse;
      
      return (
        <>
          <div className={styles.itemHeader}>
            <span className={styles.language}>
              {getLanguageLabel(item.language)}
            </span>
          </div>
          <p className={styles.modelInfo}>
            Model: {getModelLabel(item.models[0])}
          </p>
          <p className={styles.verdict}>
            {truncateText(singleResult.comment, 60)}
          </p>
        </>
      );
    }
  };

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>History</h3>
        </div>
        <div className={styles.emptyState}>
          <p>No evaluations yet.</p>
          <p className={styles.emptyHint}>
            Your first evaluation will automatically appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>History ({items.length})</h3>
        <button
          className={styles.clearButton}
          onClick={onClearHistory}
          title="Clear History"
        >
          Clear
        </button>
      </div>
      <div className={styles.list}>
        {items.map((item) => (
          <button
            key={item.id}
            className={styles.item}
            onClick={() => onSelectItem(item)}
          >
            {renderItemContent(item)}
            <span className={styles.timestamp}>
              {formatDateTime(item.timestamp)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
