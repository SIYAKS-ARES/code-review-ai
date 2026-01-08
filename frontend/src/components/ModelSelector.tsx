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
        return 'En az 2 model seçmelisiniz';
      }
    }
    return null;
  };

  const validationMessage = getValidationMessage();
  const activeModels = availableModels.filter(m => m.available);

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
            value={selectedModels[0] || activeModels[0]?.id || ''}
            onChange={(e) => handleSingleModelChange(e.target.value)}
            disabled={activeModels.length === 0}
          >
            {activeModels.length === 0 && (
              <option value="">Aktif model bulunamadı</option>
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
            Modeller (2-3 adet seçin)
          </label>
          <div className={styles.checkboxList}>
            {availableModels.map((model) => {
              const isSelected = selectedModels.includes(model.id);
              const isDisabled = !model.available || (!isSelected && selectedModels.length >= 3);

              return (
                <label
                  key={model.id}
                  className={`${styles.checkboxItem} ${isDisabled ? styles.checkboxDisabled : ''}`}
                  title={!model.available ? 'Model şu anda kullanılamıyor (API key eksik)' : ''}
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
                    {!model.available && ' (Pasif)'}
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
