import React from 'react';
import { EvaluationMode, ModelId, AVAILABLE_MODELS } from '../types';
import styles from './ModelSelector.module.css';

interface ModelSelectorProps {
  mode: EvaluationMode;
  selectedModels: ModelId[];
  onModeChange: (mode: EvaluationMode) => void;
  onModelsChange: (models: ModelId[]) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  mode,
  selectedModels,
  onModeChange,
  onModelsChange,
}) => {
  const handleSingleModelChange = (modelId: ModelId) => {
    onModelsChange([modelId]);
  };

  const handleCompareModelToggle = (modelId: ModelId) => {
    if (selectedModels.includes(modelId)) {
      // Remove if already selected
      const newModels = selectedModels.filter((m) => m !== modelId);
      if (newModels.length >= 2) {
        onModelsChange(newModels);
      }
    } else {
      // Add if not selected and less than 3
      if (selectedModels.length < 3) {
        onModelsChange([...selectedModels, modelId]);
      }
    }
  };

  const getValidationMessage = (): string | null => {
    if (mode === 'compare') {
      if (selectedModels.length < 2) {
        return 'En az 2 model seçmelisiniz';
      }
    }
    return null;
  };

  const validationMessage = getValidationMessage();

  return (
    <div className={styles.container}>
      <label className={styles.mainLabel}>Model Seçimi</label>

      {/* Mode Selector */}
      <div className={styles.modeSelector}>
        <label className={styles.modeLabel}>Değerlendirme Modu</label>
        <div className={styles.segmentedControl}>
          <button
            type="button"
            className={`${styles.segment} ${mode === 'single' ? styles.segmentActive : ''}`}
            onClick={() => onModeChange('single')}
          >
            Tek Model
          </button>
          <button
            type="button"
            className={`${styles.segment} ${mode === 'compare' ? styles.segmentActive : ''}`}
            onClick={() => onModeChange('compare')}
          >
            Karşılaştır (Yan Yana)
          </button>
        </div>
      </div>

      {/* Single Model Selection */}
      {mode === 'single' && (
        <div className={styles.singleMode}>
          <label htmlFor="single-model-select" className={styles.label}>
            Model
          </label>
          <select
            id="single-model-select"
            className={styles.select}
            value={selectedModels[0] || 'gpt-4o'}
            onChange={(e) => handleSingleModelChange(e.target.value as ModelId)}
          >
            {AVAILABLE_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Compare Model Selection */}
      {mode === 'compare' && (
        <div className={styles.compareMode}>
          <label className={styles.label}>
            Modeller (2-3 adet seçin)
          </label>
          <div className={styles.checkboxList}>
            {AVAILABLE_MODELS.map((model) => {
              const isSelected = selectedModels.includes(model.id);
              const isDisabled = !isSelected && selectedModels.length >= 3;

              return (
                <label
                  key={model.id}
                  className={`${styles.checkboxItem} ${isDisabled ? styles.checkboxDisabled : ''}`}
                >
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={isSelected}
                    onChange={() => handleCompareModelToggle(model.id)}
                    disabled={isDisabled}
                  />
                  <span className={styles.checkboxLabel}>{model.label}</span>
                </label>
              );
            })}
          </div>
          {validationMessage && (
            <span className={styles.validationMessage}>{validationMessage}</span>
          )}
        </div>
      )}
    </div>
  );
};
