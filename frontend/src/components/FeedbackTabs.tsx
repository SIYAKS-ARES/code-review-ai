import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { EvaluationResponse, SingleEvaluationResult, CompareModeResponse } from '../types';
import styles from './FeedbackTabs.module.css';

interface FeedbackTabsProps {
  result: EvaluationResponse;
  selectedModels?: string[];
}

export const FeedbackTabs: React.FC<FeedbackTabsProps> = ({ result, selectedModels = [] }) => {
  const [selectedModelId, setSelectedModelId] = useState<string>(
    selectedModels.length > 0 ? selectedModels[0] : ''
  );

  const isCompareMode = 'mode' in result && result.mode === 'compare';

  const getModelLabel = (modelId: string): string => {
    // Model ID'yi olduğu gibi döndür veya güzelleştir
    const modelNames: Record<string, string> = {
      'ChatGPT 5.2': 'ChatGPT 5.2',
      'Gemini 3 Pro': 'Gemini 3 Pro',
      'Claude 4.5 Sonnet': 'Claude 4.5 Sonnet'
    };
    return modelNames[modelId] || modelId;
  };

  // Tek model modu
  if (!isCompareMode) {
    const singleResult = result as SingleEvaluationResult;
    
    return (
      <div className={styles.container}>
        <div className={styles.singleMode}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>💬 Comment</h3>
            <p className={styles.comment}>{singleResult.comment}</p>
          </div>

          <div className={styles.runtimeSection}>
            <div className={styles.runtimeCard}>
              <h4 className={styles.runtimeLabel}>⏱️ Current Runtime</h4>
              <div className={styles.runtimeValue}>{singleResult.runtime}</div>
            </div>
            <div className={styles.runtimeCard}>
              <h4 className={styles.runtimeLabel}>🎯 Optimal Runtime</h4>
              <div className={styles.optimalValue}>{singleResult.optimalRuntime}</div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📝 Suggestions to Improve the Code</h3>
            <div className={styles.suggestions}>
              <ReactMarkdown>{String(singleResult.suggestions || '')}</ReactMarkdown>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>🎯 Roadmap</h3>
            <div className={styles.guidance}>
              <ReactMarkdown>{String(singleResult.guidance || '')}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Karşılaştırma modu
  const compareResult = result as CompareModeResponse;

  return (
    <div className={styles.container}>
      <div className={styles.compareMode}>
        {/* Sol: Model Listesi */}
        <div className={styles.modelList}>
          <h3 className={styles.modelListTitle}>Models</h3>
          {selectedModels.map(modelId => {
            const isSelected = modelId === selectedModelId;
            
            return (
              <button
                key={modelId}
                className={`${styles.modelButton} ${isSelected ? styles.modelButtonActive : ''}`}
                onClick={() => setSelectedModelId(modelId)}
              >
                <div className={styles.modelButtonContent}>
                  <span className={styles.modelName}>
                    {getModelLabel(modelId)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Sağ: Seçili Model Detayları */}
        <div className={styles.modelDetails}>
          {selectedModelId && compareResult.results[selectedModelId] && (
            <>
              <div className={styles.detailsHeader}>
                <h2 className={styles.detailsTitle}>{getModelLabel(selectedModelId)}</h2>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>💬 Comment</h3>
                <p className={styles.comment}>{compareResult.results[selectedModelId].comment}</p>
              </div>

              <div className={styles.runtimeSection}>
                <div className={styles.runtimeCard}>
                  <h4 className={styles.runtimeLabel}>⏱️ Current Runtime</h4>
                  <div className={styles.runtimeValue}>{compareResult.results[selectedModelId].runtime}</div>
                </div>
                <div className={styles.runtimeCard}>
                  <h4 className={styles.runtimeLabel}>🎯 Optimal Runtime</h4>
                  <div className={styles.optimalValue}>{compareResult.results[selectedModelId].optimalRuntime}</div>
                </div>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>📝 Suggestions to Improve the Code</h3>
                <div className={styles.suggestions}>
                  <ReactMarkdown>{String(compareResult.results[selectedModelId].suggestions || '')}</ReactMarkdown>
                </div>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>🎯 Roadmap</h3>
                <div className={styles.guidance}>
                  <ReactMarkdown>{String(compareResult.results[selectedModelId].guidance || '')}</ReactMarkdown>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
