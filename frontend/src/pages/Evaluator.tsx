import React, { useState, useEffect } from 'react';
import { ProblemInput } from '../components/ProblemInput';
import { CodeEditor } from '../components/CodeEditor';
import { LanguageSelect } from '../components/LanguageSelect';
import { ModelSelector } from '../components/ModelSelector';
import { FeedbackTabs } from '../components/FeedbackTabs';
import { HistoryPanel } from '../components/HistoryPanel';
import { evaluateCode, ApiError } from '../api/client';
import { Language, EvaluationResponse, HistoryItem, EvaluationMode, ModelId } from '../types';
import { saveToHistory, getHistory, saveLastInput, getLastInput, clearHistory } from '../utils/storage';
import styles from './Evaluator.module.css';

const EXAMPLE_PROBLEM = `Bir dizi içindeki tekrar eden ilk sayıyı bulun.

Girdi: Pozitif tam sayılardan oluşan bir dizi
Çıktı: İlk tekrar eden sayı, yoksa -1

Örnek:
Girdi: [2, 5, 1, 2, 3, 5, 1, 2, 4]
Çıktı: 2

Kısıtlar:
- Dizi uzunluğu: 1 ≤ n ≤ 10^5
- Sayı aralığı: 1 ≤ arr[i] ≤ 10^6`;

const EXAMPLE_CODE_PYTHON = `def ilk_tekrar(dizi):
    gorulen = set()
    for sayi in dizi:
        if sayi in gorulen:
            return sayi
        gorulen.add(sayi)
    return -1

# Test
print(ilk_tekrar([2, 5, 1, 2, 3, 5, 1, 2, 4]))`;

const EXAMPLE_CODE_JAVA = `import java.util.*;

public class Solution {
    public static int ilkTekrar(int[] dizi) {
        Set<Integer> gorulen = new HashSet<>();
        for (int sayi : dizi) {
            if (gorulen.contains(sayi)) {
                return sayi;
            }
            gorulen.add(sayi);
        }
        return -1;
    }
    
    public static void main(String[] args) {
        int[] dizi = {2, 5, 1, 2, 3, 5, 1, 2, 4};
        System.out.println(ilkTekrar(dizi));
    }
}`;

const EXAMPLE_CODE_CPP = `#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

int ilkTekrar(vector<int>& dizi) {
    unordered_set<int> gorulen;
    for (int sayi : dizi) {
        if (gorulen.count(sayi)) {
            return sayi;
        }
        gorulen.insert(sayi);
    }
    return -1;
}

int main() {
    vector<int> dizi = {2, 5, 1, 2, 3, 5, 1, 2, 4};
    cout << ilkTekrar(dizi) << endl;
    return 0;
}`;

export const Evaluator: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<Language>('python');
  const [evaluationMode, setEvaluationMode] = useState<EvaluationMode>('compare');
  const [selectedModels, setSelectedModels] = useState<ModelId[]>(['gpt-4o', 'gemini-1.5-pro', 'claude-3.5-sonnet']);
  const [result, setResult] = useState<EvaluationResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState({
    problem: '',
    code: '',
    models: '',
  });

  // Load last input and history on mount
  useEffect(() => {
    const lastInput = getLastInput();
    setProblem(lastInput.problem);
    setCode(lastInput.code);
    setLanguage(lastInput.language);
    setHistory(getHistory());
  }, []);

  // Save input to localStorage whenever it changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveLastInput(problem, code, language);
    }, 500); // Debounce

    return () => clearTimeout(timeoutId);
  }, [problem, code, language]);

  // Handle mode change
  const handleModeChange = (mode: EvaluationMode) => {
    setEvaluationMode(mode);
    
    // Reset model selection based on mode
    if (mode === 'single') {
      setSelectedModels([selectedModels[0] || 'gpt-4o']);
    } else {
      // For compare mode, ensure at least 2 models are selected
      if (selectedModels.length < 2) {
        setSelectedModels(['gpt-4o', 'gemini-1.5-pro']);
      }
    }
    
    setValidationErrors({ ...validationErrors, models: '' });
  };

  const validateInputs = (): boolean => {
    const errors = {
      problem: '',
      code: '',
      models: '',
    };

    if (!problem.trim()) {
      errors.problem = 'Problem tanımı zorunludur';
    }

    if (!code.trim()) {
      errors.code = 'Kod zorunludur';
    }

    if (evaluationMode === 'compare' && selectedModels.length < 2) {
      errors.models = 'Karşılaştırma modu için en az 2 model seçmelisiniz';
    }

    setValidationErrors(errors);
    return !errors.problem && !errors.code && !errors.models;
  };

  const handleEvaluate = async () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await evaluateCode({
        problem,
        code,
        language,
        mode: evaluationMode,
        models: selectedModels,
      });

      setResult(response);

      // Save to history
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        problem,
        code,
        language,
        mode: evaluationMode,
        models: selectedModels,
        result: response,
      };

      saveToHistory(historyItem);
      setHistory(getHistory());
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setProblem('');
    setCode('');
    setResult(null);
    setError(null);
    setValidationErrors({ problem: '', code: '', models: '' });
  };

  const handleLoadExample = () => {
    setProblem(EXAMPLE_PROBLEM);
    
    switch (language) {
      case 'python':
        setCode(EXAMPLE_CODE_PYTHON);
        break;
      case 'java':
        setCode(EXAMPLE_CODE_JAVA);
        break;
      case 'cpp':
        setCode(EXAMPLE_CODE_CPP);
        break;
    }

    setResult(null);
    setError(null);
    setValidationErrors({ problem: '', code: '', models: '' });
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setProblem(item.problem);
    setCode(item.code);
    setLanguage(item.language);
    setEvaluationMode(item.mode);
    setSelectedModels(item.models as ModelId[]);
    setResult(item.result);
    setError(null);
    setValidationErrors({ problem: '', code: '', models: '' });
  };

  const handleClearHistory = () => {
    if (confirm('Tüm geçmişi silmek istediğinizden emin misiniz?')) {
      clearHistory();
      setHistory([]);
    }
  };

  const isEvaluateDisabled = loading || !problem.trim() || !code.trim() || 
    (evaluationMode === 'compare' && selectedModels.length < 2);

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.inputSection}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>LLM Karşılaştırma Arayüzü (Araştırma)</h2>
            
            <ProblemInput
              value={problem}
              onChange={setProblem}
              error={validationErrors.problem}
            />

            <LanguageSelect value={language} onChange={setLanguage} />

            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
              error={validationErrors.code}
            />

            <ModelSelector
              mode={evaluationMode}
              selectedModels={selectedModels}
              onModeChange={handleModeChange}
              onModelsChange={setSelectedModels}
            />

            {validationErrors.models && (
              <span className={styles.errorText}>{validationErrors.models}</span>
            )}

            <div className={styles.actions}>
              <button
                className={styles.btnPrimary}
                onClick={handleEvaluate}
                disabled={isEvaluateDisabled}
              >
                {loading ? 'Değerlendiriliyor…' : 'Değerlendir'}
              </button>
              <button className={styles.btnSecondary} onClick={handleClear}>
                Temizle
              </button>
              <button className={styles.btnSecondary} onClick={handleLoadExample}>
                Örnek Yükle
              </button>
            </div>

            {error && (
              <div className={styles.errorBox}>
                <p className={styles.errorMessage}>❌ {error}</p>
                <button
                  className={styles.btnSecondary}
                  onClick={handleEvaluate}
                  disabled={isEvaluateDisabled}
                >
                  Tekrar Dene
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.resultSection}>
          {result ? (
            <FeedbackTabs result={result} selectedModels={selectedModels} />
          ) : (
            <div className={styles.placeholder}>
              <div className={styles.placeholderContent}>
                <span className={styles.placeholderIcon}>📊</span>
                <h3 className={styles.placeholderTitle}>
                  Değerlendirme Sonuçları
                </h3>
                <p className={styles.placeholderText}>
                  Sol taraftan problem ve kod girerek "Değerlendir" butonuna basın.
                  Sonuçlar burada görüntülenecek.
                </p>
              </div>
            </div>
          )}

          <div className={styles.historyContainer}>
            <HistoryPanel
              items={history}
              onSelectItem={handleSelectHistory}
              onClearHistory={handleClearHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
