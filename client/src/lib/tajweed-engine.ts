import { TajweedRule, TajweedSpan } from './tajweed-rules';

// Arabic diacritical marks (Unicode constants)
const SHADDAH = '\u0651';      // ّ - Emphasis/doubling mark
const SUKOON = '\u0652';       // ْ - No vowel mark
const TANWEEN_FATHATAN = '\u064B';  // ً - Tanween with Fatha
const TANWEEN_DAMMATAN = '\u064C';  // ٌ - Tanween with Damma  
const TANWEEN_KASRATAN = '\u064D';  // ٍ - Tanween with Kasra
const MADD_SIGN = '\u0653';    // ٓ - Madd above
const ALIF_MADD = '\u0622';    // آ - Alif with Madd

// Hamza variants
const HAMZA_VARIANTS = '[\u0621\u0623\u0624\u0625\u0626]';

/**
 * Engine for detecting Tajweed rules in Arabic Quranic text
 */
export class TajweedEngine {
  /**
   * Analyze Arabic text and return all Tajweed spans
   */
  analyze(arabicText: string): TajweedSpan[] {
    if (!arabicText) return [];

    const spans: TajweedSpan[] = [];

    // Order matters: Check specific rules first
    spans.push(...this.detectGhunnah(arabicText));
    spans.push(...this.detectIqlab(arabicText));
    spans.push(...this.detectIdghaam(arabicText));
    spans.push(...this.detectIkhfa(arabicText));
    spans.push(...this.detectQalqalah(arabicText));
    spans.push(...this.detectMadd(arabicText));

    return this.removeOverlaps(spans);
  }

  /**
   * Detect Ghunnah (غُنَّة) - Noon or Meem with Shaddah
   */
  private detectGhunnah(text: string): TajweedSpan[] {
    const spans: TajweedSpan[] = [];
    // Pattern: ن or م followed by Shaddah (ّ)
    const pattern = new RegExp(`[نم]${SHADDAH}`, 'g');
    let match;

    while ((match = pattern.exec(text)) !== null) {
      spans.push({
        start: match.index,
        end: match.index + match[0].length,
        rule: TajweedRule.GHUNNAH,
        text: match[0],
      });
    }

    return spans;
  }

  /**
   * Detect Iqlab (إقلاب) - Noon Sakinah/Tanween + ب
   */
  private detectIqlab(text: string): TajweedSpan[] {
    const spans: TajweedSpan[] = [];

    // Noon Sakinah (نْ) or Tanween (ً ٌ ٍ) followed by ب
    const patterns = [
      new RegExp(`ن${SUKOON}[\\s]*ب`, 'g'),           // Noon Sakinah + Ba
      new RegExp(`[${TANWEEN_FATHATAN}${TANWEEN_DAMMATAN}${TANWEEN_KASRATAN}][\\s]*ب`, 'g'), // Tanween + Ba
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        spans.push({
          start: match.index,
          end: match.index + match[0].length,
          rule: TajweedRule.IQLAB,
          text: match[0],
        });
      }
    });

    return spans;
  }

  /**
   * Detect Idghaam (إدغام) - Noon Sakinah/Tanween + يرملون
   */
  private detectIdghaam(text: string): TajweedSpan[] {
    const spans: TajweedSpan[] = [];
    const idghaamLetters = 'يرملون';

    const patterns = [
      new RegExp(`ن${SUKOON}[\\s]*[${idghaamLetters}]`, 'g'),
      new RegExp(`[${TANWEEN_FATHATAN}${TANWEEN_DAMMATAN}${TANWEEN_KASRATAN}][\\s]*[${idghaamLetters}]`, 'g'),
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        spans.push({
          start: match.index,
          end: match.index + match[0].length,
          rule: TajweedRule.IDGHAAM,
          text: match[0],
        });
      }
    });

    return spans;
  }

  /**
   * Detect Ikhfa (إخفاء) - Noon Sakinah/Tanween + 15 letters
   */
  private detectIkhfa(text: string): TajweedSpan[] {
    const spans: TajweedSpan[] = [];
    const ikhfaLetters = 'تثجدذزسشصضطظفقك';

    const patterns = [
      new RegExp(`ن${SUKOON}[\\s]*[${ikhfaLetters}]`, 'g'),
      new RegExp(`[${TANWEEN_FATHATAN}${TANWEEN_DAMMATAN}${TANWEEN_KASRATAN}][\\s]*[${ikhfaLetters}]`, 'g'),
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        spans.push({
          start: match.index,
          end: match.index + match[0].length,
          rule: TajweedRule.IKHFA,
          text: match[0],
        });
      }
    });

    return spans;
  }

  /**
   * Detect Qalqalah (قلقلة) - قطبجد with Sukoon
   */
  private detectQalqalah(text: string): TajweedSpan[] {
    const spans: TajweedSpan[] = [];
    const qalqalahLetters = 'قطبجد';

    // With Sukoon
    const pattern = new RegExp(`[${qalqalahLetters}]${SUKOON}`, 'g');
    let match;

    while ((match = pattern.exec(text)) !== null) {
      spans.push({
        start: match.index,
        end: match.index + match[0].length,
        rule: TajweedRule.QALQALAH,
        text: match[0],
      });
    }

    // At word end
    const wordEndPattern = new RegExp(`[${qalqalahLetters}](?=\\s|$)`, 'g');
    while ((match = wordEndPattern.exec(text)) !== null) {
      // Only add if not already detected with Sukoon
      const overlaps = spans.some(s => s.start === match!.index);
      if (!overlaps) {
        spans.push({
          start: match.index,
          end: match.index + match[0].length,
          rule: TajweedRule.QALQALAH,
          text: match[0],
        });
      }
    }

    return spans;
  }

  /**
   * Detect Madd (مَدّ) - Elongation
   */
  private detectMadd(text: string): TajweedSpan[] {
    const spans: TajweedSpan[] = [];

    const patterns = [
      new RegExp(`[${ALIF_MADD}]`, 'g'),                    // Alif Madd (آ)
      new RegExp(`[اوي]${MADD_SIGN}`, 'g'),                 // With Madd sign
      new RegExp(`[اوي][\\s]*${HAMZA_VARIANTS}`, 'g'), // Madd Munfasil
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        spans.push({
          start: match.index,
          end: match.index + match[0].length,
          rule: TajweedRule.MADD,
          text: match[0],
        });
      }
    });

    return spans;
  }

  /**
   * Remove overlapping spans - keep higher priority rules
   */
  private removeOverlaps(spans: TajweedSpan[]): TajweedSpan[] {
    if (spans.length === 0) return spans;

    // Sort by start position
    spans.sort((a, b) => a.start - b.start);

    // Priority: Iqlab > Idghaam > Ghunnah > Ikhfa > Qalqalah > Madd
    const priorities: Record<TajweedRule, number> = {
      [TajweedRule.IQLAB]: 6,
      [TajweedRule.IDGHAAM]: 5,
      [TajweedRule.GHUNNAH]: 4,
      [TajweedRule.IKHFA]: 3,
      [TajweedRule.QALQALAH]: 2,
      [TajweedRule.MADD]: 1,
    };

    const result: TajweedSpan[] = [];
    let current: TajweedSpan | null = null;

    for (const span of spans) {
      if (!current) {
        current = span;
        continue;
      }

      // Check for overlap
      if (span.start < current.end) {
        // Overlapping - keep higher priority
        const currentPriority = priorities[current.rule] || 0;
        const spanPriority = priorities[span.rule] || 0;

        if (spanPriority > currentPriority) {
          current = span;
        }
      } else {
        // No overlap - add current and move to next
        result.push(current);
        current = span;
      }
    }

    if (current) {
      result.push(current);
    }

    return result;
  }
}
