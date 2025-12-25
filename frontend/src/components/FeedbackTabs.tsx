import React, { useState } from 'react';
import { EvaluationResponse, SingleEvaluationResult, CompareModeResponse, AVAILABLE_MODELS, ModelId } from '../types';
import styles from './FeedbackTabs.module.css';

interface FeedbackTabsProps {
  result: EvaluationResponse;
  selectedModels?: ModelId[];
}

export const FeedbackTabs: React.FC<FeedbackTabsProps> = ({ result, selectedModels = [] }) => {
  const [selectedModelId, setSelectedModelId] = useState<string>(
    selectedModels.length > 0 ? selectedModels[0] : ''
  );

  const isCompareMode = 'mode' in result && result.mode === 'compare';

  const getModelLabel = (modelId: string): string => {
    const model = AVAILABLE_MODELS.find((m) => m.id === modelId);
    return model ? model.label : modelId;
  };

  // Tek model modu
  if (!isCompareMode) {
    const singleResult = result as SingleEvaluationResult;
    
    return (
      <div className={styles.container}>
        <div className={styles.singleMode}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>💬 Yorum</h3>
            <p className={styles.comment}>{singleResult.comment}</p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📝 Kodu Düzeltmek İçin Tavsiyeler</h3>
            <pre className={styles.suggestions}>{singleResult.suggestions}</pre>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>🎯 Yol Haritası</h3>
            <pre className={styles.guidance}>{singleResult.guidance}</pre>
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
          <h3 className={styles.modelListTitle}>Modeller</h3>
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
                <h3 className={styles.sectionTitle}>💬 Yorum</h3>
                <p className={styles.comment}>{compareResult.results[selectedModelId].comment}</p>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>📝 Kodu Düzeltmek İçin Tavsiyeler</h3>
                <pre className={styles.suggestions}>{compareResult.results[selectedModelId].suggestions}</pre>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>🎯 Yol Haritası</h3>
                <pre className={styles.guidance}>{compareResult.results[selectedModelId].guidance}</pre>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
