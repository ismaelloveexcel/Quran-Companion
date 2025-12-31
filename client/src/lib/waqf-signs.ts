// Waqf (stopping) sign definitions
export enum WaqfSign {
  MUST_STOP = 'mustStop',
  DO_NOT_STOP = 'doNotStop',
  PERMISSIBLE = 'permissible',
  BETTER_CONTINUE = 'betterContinue',
  BETTER_STOP = 'betterStop',
}

export interface WaqfSignInfo {
  symbol: string;
  arabicName: string;
  name: string;
  color: string;
  backgroundColor: string;
  explanation: string;
  action: string;
  priority: number; // 5 = must follow, 1 = optional
}

export const WAQF_SIGNS: Record<WaqfSign, WaqfSignInfo> = {
  [WaqfSign.MUST_STOP]: {
    symbol: 'ۘ',
    arabicName: 'م',
    name: 'Meem (Must Stop)',
    color: '#D32F2F',
    backgroundColor: '#FFEBEE',
    explanation: 'You MUST stop here to preserve the correct meaning. Take a breath before continuing.',
    action: 'STOP & BREATHE',
    priority: 5,
  },
  [WaqfSign.DO_NOT_STOP]: {
    symbol: 'لا',
    arabicName: 'لا',
    name: 'Laa (Do Not Stop)',
    color: '#212121',
    backgroundColor: '#F5F5F5',
    explanation: 'Do NOT stop here. Continue reading to the next word to maintain proper meaning.',
    action: "DON'T STOP",
    priority: 5,
  },
  [WaqfSign.PERMISSIBLE]: {
    symbol: 'ج',
    arabicName: 'ج',
    name: 'Jeem (Permissible)',
    color: '#2E7D32',
    backgroundColor: '#E8F5E9',
    explanation: 'You can stop here if you need breath, or continue. Both are acceptable.',
    action: 'OPTIONAL',
    priority: 1,
  },
  [WaqfSign.BETTER_CONTINUE]: {
    symbol: 'صلى',
    arabicName: 'صلى',
    name: 'Saad-Laa (Better to Continue)',
    color: '#F9A825',
    backgroundColor: '#FFF9C4',
    explanation: 'You can stop if necessary, but it is better to continue reading.',
    action: 'KEEP GOING (preferred)',
    priority: 3,
  },
  [WaqfSign.BETTER_STOP]: {
    symbol: 'قلى',
    arabicName: 'قلى',
    name: 'Qaaf-Laa (Better to Stop)',
    color: '#EF6C00',
    backgroundColor: '#FFE0B2',
    explanation: 'You can continue if needed, but it is better to stop here and take a breath.',
    action: 'PAUSE (preferred)',
    priority: 4,
  },
};

export interface WaqfPosition {
  position: number;
  sign: WaqfSign;
  context?: string;
}
