import { HistoryItem, Language } from '../types';

const STORAGE_KEYS = {
  HISTORY: 'code-eval-history',
  LAST_PROBLEM: 'code-eval-last-problem',
  LAST_CODE: 'code-eval-last-code',
  LAST_LANGUAGE: 'code-eval-last-language',
} as const;

const MAX_HISTORY_ITEMS = 10;

export function saveToHistory(item: HistoryItem): void {
  try {
    const history = getHistory();
    history.unshift(item);
    
    // Keep only last 10 items
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
}

export function getHistory(): HistoryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!data) return [];
    
    return JSON.parse(data) as HistoryItem[];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}

export function saveLastInput(problem: string, code: string, language: Language): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_PROBLEM, problem);
    localStorage.setItem(STORAGE_KEYS.LAST_CODE, code);
    localStorage.setItem(STORAGE_KEYS.LAST_LANGUAGE, language);
  } catch (error) {
    console.error('Failed to save last input:', error);
  }
}

export function getLastInput(): { problem: string; code: string; language: Language } {
  try {
    return {
      problem: localStorage.getItem(STORAGE_KEYS.LAST_PROBLEM) || '',
      code: localStorage.getItem(STORAGE_KEYS.LAST_CODE) || '',
      language: (localStorage.getItem(STORAGE_KEYS.LAST_LANGUAGE) as Language) || 'python',
    };
  } catch (error) {
    console.error('Failed to load last input:', error);
    return { problem: '', code: '', language: 'python' };
  }
}
