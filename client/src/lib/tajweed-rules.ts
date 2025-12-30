// Tajweed rule definitions with colors
export enum TajweedRule {
  GHUNNAH = 'ghunnah',
  IDGHAAM = 'idghaam',
  IKHFA = 'ikhfa',
  IQLAB = 'iqlab',
  QALQALAH = 'qalqalah',
  MADD = 'madd',
}

export interface TajweedRuleInfo {
  name: string;
  arabicName: string;
  color: string;
  backgroundColor: string;
  explanation: string;
  howToApply: string;
  examples: string[];
}

export const TAJWEED_RULES: Record<TajweedRule, TajweedRuleInfo> = {
  [TajweedRule.GHUNNAH]: {
    name: 'Ghunnah (Nasal Sound)',
    arabicName: 'غُنَّة',
    color: '#2E7D32',
    backgroundColor: '#C8E6C9',
    explanation: 'Hold the nasal sound in your nose for 2 counts when you see Noon (ن) or Meem (م) with Shaddah (ّ).',
    howToApply: 'Let the sound resonate in your nasal cavity.',
    examples: ['إِنَّ', 'مِمَّا', 'عَمَّ', 'ثُمَّ'],
  },
  [TajweedRule.IDGHAAM]: {
    name: 'Idghaam (Merging)',
    arabicName: 'إدغام',
    color: '#1565C0',
    backgroundColor: '#BBDEFB',
    explanation: 'Merge the Noon Sakinah (نْ) or Tanween into the next letter smoothly.',
    howToApply: 'The letters that cause Idghaam are: ي ر م ل و ن. Blend them together.',
    examples: ['مِن رَّبِّهِمْ', 'هُدًى لِّلْمُتَّقِينَ', 'مِن نَّار'],
  },
  [TajweedRule.IKHFA]: {
    name: 'Ikhfa (Hiding)',
    arabicName: 'إخفاء',
    color: '#E65100',
    backgroundColor: '#FFE0B2',
    explanation: 'Partially hide the Noon Sakinah or Tanween sound with a soft nasal tone.',
    howToApply: 'Hide the sound when followed by: ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك',
    examples: ['أَنْ تَ', 'مِنْ سَ', 'يَوْمٍ ظَلِيمٍ'],
  },
  [TajweedRule.IQLAB]: {
    name: 'Iqlab (Converting)',
    arabicName: 'إقلاب',
    color: '#6A1B9A',
    backgroundColor: '#E1BEE7',
    explanation: 'Convert the Noon Sakinah or Tanween into a Meem (م) sound when followed by ب.',
    howToApply: 'Change the "n" sound to "m" before the letter ب (ba). Close your lips.',
    examples: ['مِنۢ بَعْدِ', 'سَمِيعٌۢ بَصِيرٌ', 'أَنۢبَتَتْ'],
  },
  [TajweedRule.QALQALAH]: {
    name: 'Qalqalah (Echo)',
    arabicName: 'قلقلة',
    color: '#C62828',
    backgroundColor: '#FFCDD2',
    explanation: 'Create a slight bouncing or echoing sound with specific letters when they have Sukoon.',
    howToApply: 'The 5 Qalqalah letters are: ق ط ب ج د. Make them "pop" slightly.',
    examples: ['الفَلَقِ', 'أَحَدٌ', 'يَتَرَبَّصُ', 'وَتَبَّ'],
  },
  [TajweedRule.MADD]: {
    name: 'Madd (Elongation)',
    arabicName: 'مَدّ',
    color: '#0277BD',
    backgroundColor: '#B3E5FC',
    explanation: 'Stretch the vowel sound for a specific number of counts (2, 4, or 6).',
    howToApply: 'When you see آ, و, or ي elongate the sound. Normal = 2 counts, Connected = 4-5, Separated = 6.',
    examples: ['الضَّآلِّينَ', 'جَآءَ', 'قَالُوا', 'يَقُولُونَ'],
  },
};

export interface TajweedSpan {
  start: number;
  end: number;
  rule: TajweedRule;
  text: string;
}
