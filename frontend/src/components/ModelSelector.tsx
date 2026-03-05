import React from 'react';
import { EvaluationMode, ModelInfo } from '../types';
import styles from './ModelSelector.module.css';

interface ModelSelectorProps {
  mode: EvaluationMode;
  selectedModels: string[];
  availableModels: ModelInfo[];
  onModeChange: (mode: EvaluationMode) => void;
  onModelsChange: (models: string[]) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  mode,
  selectedModels,
  availableModels,
  onModeChange,
  onModelsChange,
}) => {
  const handleSingleModelChange = (modelId: string) => {
    onModelsChange([modelId]);
  };

  const handleCompareModelToggle = (modelId: string) => {
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
        return 'Please select at least 2 models';
      }
    }
    return null;
  };

  const validationMessage = getValidationMessage();
  const activeModels = availableModels.filter(m => m.available);

  return (
    <div className={styles.container}>
      <label className={styles.mainLabel}>Model Selection</label>

      {/* Mode Selector */}
      <div className={styles.modeSelector}>
        <label className={styles.modeLabel}>Evaluation Mode</label>
        <div className={styles.segmentedControl}>
          <button
            type="button"
            className={`${styles.segment} ${mode === 'single' ? styles.segmentActive : ''}`}
            onClick={() => onModeChange('single')}
          >
            Single Model
          </button>
          <button
            type="button"
            className={`${styles.segment} ${mode === 'compare' ? styles.segmentActive : ''}`}
            onClick={() => onModeChange('compare')}
          >
            Compare (Side by Side)
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
            value={selectedModels[0] || activeModels[0]?.id || ''}
            onChange={(e) => handleSingleModelChange(e.target.value)}
            disabled={activeModels.length === 0}
          >
            {activeModels.length === 0 && (
              <option value="">No active model found</option>
            )}
            {activeModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Compare Model Selection */}
      {mode === 'compare' && (
        <div className={styles.compareMode}>
          <label className={styles.label}>
            Models (select 2-3)
          </label>
          <div className={styles.checkboxList}>
            {availableModels.map((model) => {
              const isSelected = selectedModels.includes(model.id);
              const isDisabled = !model.available || (!isSelected && selectedModels.length >= 3);

              return (
                <label
                  key={model.id}
                  className={`${styles.checkboxItem} ${isDisabled ? styles.checkboxDisabled : ''}`}
                  title={!model.available ? 'Model is currently unavailable (missing API key)' : ''}
                >
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={isSelected}
                    onChange={() => handleCompareModelToggle(model.id)}
                    disabled={isDisabled}
                  />
                  <span className={styles.checkboxLabel}>
                    {model.name}
                    {!model.available && ' (Inactive)'}
                  </span>
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
