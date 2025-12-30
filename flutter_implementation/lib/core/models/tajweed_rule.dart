import 'package:flutter/material.dart';

/// Represents the 6 core Tajweed rules for proper Quran recitation
enum TajweedRule {
  /// Ghunnah (غُنَّة) - Nasal sound held for 2 counts
  ghunnah(
    arabicName: 'غُنَّة',
    englishName: 'Ghunnah (Nasal Sound)',
    color: Color(0xFF4CAF50), // Green
    explanation: 'Hold the nasal sound in your nose for 2 counts when you see Noon (ن) or Meem (م) with Shaddah (ّ).',
    howToApply: 'Let the sound resonate in your nasal cavity. Examples: إِنَّ (Inna), عَمَّ (Amma)',
    examples: ['إِنَّ', 'مِمَّا', 'عَمَّ', 'ثُمَّ'],
    audioExample: 'assets/audio/tajweed/ghunnah.mp3',
  ),

  /// Idghaam (إدغام) - Merging two letters into one
  idghaam(
    arabicName: 'إدغام',
    englishName: 'Idghaam (Merging)',
    color: Color(0xFF1565C0), // Dark Blue
    explanation: 'Merge the Noon Sakinah (نْ) or Tanween into the next letter smoothly.',
    howToApply: 'The letters that cause Idghaam are: ي ر م ل و ن. Blend them together.',
    examples: ['مِن رَّبِّهِمْ', 'هُدًى لِّلْمُتَّقِينَ', 'مِن نَّار'],
    audioExample: 'assets/audio/tajweed/idghaam.mp3',
  ),

  /// Ikhfa (إخفاء) - Hiding the sound
  ikhfa(
    arabicName: 'إخفاء',
    englishName: 'Ikhfa (Hiding)',
    color: Color(0xFFFF9800), // Orange
    explanation: 'Partially hide the Noon Sakinah or Tanween sound with a soft nasal tone.',
    howToApply: 'Hide the sound when followed by these 15 letters: ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك',
    examples: ['أَنْ تَ', 'مِنْ سَ', 'يَوْمٍ ظَلِيمٍ'],
    audioExample: 'assets/audio/tajweed/ikhfa.mp3',
  ),

  /// Iqlab (إقلاب) - Converting the sound
  iqlab(
    arabicName: 'إقلاب',
    englishName: 'Iqlab (Converting)',
    color: Color(0xFF9C27B0), // Purple
    explanation: 'Convert the Noon Sakinah or Tanween into a Meem (م) sound when followed by ب.',
    howToApply: 'Change the "n" sound to "m" before the letter ب (ba). Close your lips like saying "m".',
    examples: ['مِنۢ بَعْدِ', 'سَمِيعٌۢ بَصِيرٌ', 'أَنۢبَتَتْ'],
    audioExample: 'assets/audio/tajweed/iqlab.mp3',
  ),

  /// Qalqalah (قلقلة) - Echoing/bouncing sound
  qalqalah(
    arabicName: 'قلقلة',
    englishName: 'Qalqalah (Echo)',
    color: Color(0xFFD32F2F), // Red
    explanation: 'Create a slight bouncing or echoing sound with specific letters when they have Sukoon (no vowel).',
    howToApply: 'The 5 Qalqalah letters are: ق ط ب ج د. Make them "pop" slightly.',
    examples: ['الفَلَقِ', 'أَحَدٌ', 'يَتَرَبَّصُ', 'وَتَبَّ'],
    audioExample: 'assets/audio/tajweed/qalqalah.mp3',
  ),

  /// Madd (مَدّ) - Elongation/stretching
  madd(
    arabicName: 'مَدّ',
    englishName: 'Madd (Elongation)',
    color: Color(0xFF03A9F4), // Light Blue
    explanation: 'Stretch the vowel sound for a specific number of counts (2, 4, or 6).',
    howToApply: 'When you see آ, و, or ي elongate the sound. Normal Madd = 2 counts, Connected = 4-5, Separated = 6.',
    examples: ['الضَّآلِّينَ', 'جَآءَ', 'قَالُوا', 'يَقُولُونَ'],
    audioExample: 'assets/audio/tajweed/madd.mp3',
  );

  const TajweedRule({
    required this.arabicName,
    required this.englishName,
    required this.color,
    required this.explanation,
    required this.howToApply,
    required this.examples,
    required this.audioExample,
  });

  final String arabicName;
  final String englishName;
  final Color color;
  final String explanation;
  final String howToApply;
  final List<String> examples;
  final String audioExample;

  /// Get a lighter background color for highlighting
  Color get backgroundColor => color.withOpacity(0.25);

  /// Get a darker border color
  Color get borderColor => color.withOpacity(0.5);
}

/// Represents a span of text with a specific Tajweed rule applied
class TajweedSpan {
  final int start;
  final int end;
  final TajweedRule rule;
  final String matchedText;

  const TajweedSpan({
    required this.start,
    required this.end,
    required this.rule,
    required this.matchedText,
  });

  int get length => end - start;

  @override
  String toString() {
    return 'TajweedSpan(start: $start, end: $end, rule: ${rule.englishName}, text: "$matchedText")';
  }
}
