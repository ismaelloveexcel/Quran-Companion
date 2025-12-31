// Local storage utilities for persisting user preferences

const STORAGE_KEYS = {
  FONT_SIZE: 'quran-companion-font-size',
  LAST_READ: 'quran-companion-last-read',
  SHOW_TIPS: 'quran-companion-show-tips',
  SHOW_LEGEND: 'quran-companion-show-legend',
} as const;

export interface LastReadData {
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  verseNumber: number;
  totalVerses: number;
  timestamp: number;
}

// Font Size
export function saveFontSize(size: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, size.toString());
  } catch (e) {
    console.warn('Failed to save font size to localStorage:', e);
  }
}

export function loadFontSize(defaultSize: number = 32): number {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.FONT_SIZE);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 24 && parsed <= 64) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load font size from localStorage:', e);
  }
  return defaultSize;
}

// Last Read Position
export function saveLastRead(data: LastReadData): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_READ, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save last read position:', e);
  }
}

export function loadLastRead(): LastReadData | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LAST_READ);
    if (saved) {
      return JSON.parse(saved) as LastReadData;
    }
  } catch (e) {
    console.warn('Failed to load last read position:', e);
  }
  return null;
}

// Show Tips preference
export function saveShowTips(show: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SHOW_TIPS, show.toString());
  } catch (e) {
    console.warn('Failed to save show tips preference:', e);
  }
}

export function loadShowTips(defaultValue: boolean = true): boolean {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SHOW_TIPS);
    if (saved !== null) {
      return saved === 'true';
    }
  } catch (e) {
    console.warn('Failed to load show tips preference:', e);
  }
  return defaultValue;
}

// Show Legend preference
export function saveShowLegend(show: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SHOW_LEGEND, show.toString());
  } catch (e) {
    console.warn('Failed to save show legend preference:', e);
  }
}

export function loadShowLegend(defaultValue: boolean = true): boolean {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SHOW_LEGEND);
    if (saved !== null) {
      return saved === 'true';
    }
  } catch (e) {
    console.warn('Failed to load show legend preference:', e);
  }
  return defaultValue;
}
