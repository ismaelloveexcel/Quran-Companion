import '../../../core/models/tajweed_rule.dart';

/// Engine for detecting Tajweed rules in Arabic Quranic text
class TajweedEngine {
  /// Analyze Arabic text and return all Tajweed spans
  List<TajweedSpan> analyze(String arabicText) {
    if (arabicText.isEmpty) return [];

    List<TajweedSpan> spans = [];

    // Order matters: Check specific rules first, then general ones
    spans.addAll(_detectGhunnah(arabicText));
    spans.addAll(_detectIqlab(arabicText));
    spans.addAll(_detectIdghaam(arabicText));
    spans.addAll(_detectIkhfa(arabicText));
    spans.addAll(_detectQalqalah(arabicText));
    spans.addAll(_detectMadd(arabicText));

    // Remove overlaps - prioritize more specific rules
    return _removeOverlaps(spans);
  }

  /// Detect Ghunnah (غُنَّة) - Noon or Meem with Shaddah
  List<TajweedSpan> _detectGhunnah(String text) {
    List<TajweedSpan> spans = [];

    // Pattern: ن or م followed by Shaddah (ّ)
    final pattern = RegExp(r'[نم]\u0651');

    for (final match in pattern.allMatches(text)) {
      spans.add(TajweedSpan(
        start: match.start,
        end: match.end,
        rule: TajweedRule.ghunnah,
        matchedText: text.substring(match.start, match.end),
      ));
    }

    return spans;
  }

  /// Detect Iqlab (إقلاب) - Noon Sakinah/Tanween + ب
  List<TajweedSpan> _detectIqlab(String text) {
    List<TajweedSpan> spans = [];

    // Pattern: Noon Sakinah (نْ) or Tanween (ً ٌ ٍ) followed by ب
    final patterns = [
      RegExp(r'ن\u0652[\s]*ب'), // Noon Sakinah + Ba
      RegExp(r'[\u064B\u064C\u064D][\s]*ب'), // Tanween + Ba
    ];

    for (final pattern in patterns) {
      for (final match in pattern.allMatches(text)) {
        spans.add(TajweedSpan(
          start: match.start,
          end: match.end,
          rule: TajweedRule.iqlab,
          matchedText: text.substring(match.start, match.end),
        ));
      }
    }

    return spans;
  }

  /// Detect Idghaam (إدغام) - Noon Sakinah/Tanween + يرملون
  List<TajweedSpan> _detectIdghaam(String text) {
    List<TajweedSpan> spans = [];

    // Idghaam letters: ي ر م ل و ن
    const idghaamLetters = 'يرملون';

    // Pattern: Noon Sakinah or Tanween + Idghaam letter
    final patterns = [
      RegExp(r'ن\u0652[\s]*[' + idghaamLetters + r']'),
      RegExp(r'[\u064B\u064C\u064D][\s]*[' + idghaamLetters + r']'),
    ];

    for (final pattern in patterns) {
      for (final match in pattern.allMatches(text)) {
        spans.add(TajweedSpan(
          start: match.start,
          end: match.end,
          rule: TajweedRule.idghaam,
          matchedText: text.substring(match.start, match.end),
        ));
      }
    }

    return spans;
  }

  /// Detect Ikhfa (إخفاء) - Noon Sakinah/Tanween + 15 letters
  List<TajweedSpan> _detectIkhfa(String text) {
    List<TajweedSpan> spans = [];

    // 15 Ikhfa letters: ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك
    const ikhfaLetters = 'تثجدذزسشصضطظفقك';

    // Pattern: Noon Sakinah or Tanween + Ikhfa letter
    final patterns = [
      RegExp(r'ن\u0652[\s]*[' + ikhfaLetters + r']'),
      RegExp(r'[\u064B\u064C\u064D][\s]*[' + ikhfaLetters + r']'),
    ];

    for (final pattern in patterns) {
      for (final match in pattern.allMatches(text)) {
        spans.add(TajweedSpan(
          start: match.start,
          end: match.end,
          rule: TajweedRule.ikhfa,
          matchedText: text.substring(match.start, match.end),
        ));
      }
    }

    return spans;
  }

  /// Detect Qalqalah (قلقلة) - قطبجد with Sukoon
  List<TajweedSpan> _detectQalqalah(String text) {
    List<TajweedSpan> spans = [];

    // 5 Qalqalah letters: ق ط ب ج د
    const qalqalahLetters = 'قطبجد';

    // Pattern: Qalqalah letter with Sukoon (ْ) or at the end of a word
    final pattern = RegExp(r'[' + qalqalahLetters + r']\u0652');

    for (final match in pattern.allMatches(text)) {
      spans.add(TajweedSpan(
        start: match.start,
        end: match.end,
        rule: TajweedRule.qalqalah,
        matchedText: text.substring(match.start, match.end),
      ));
    }

    // Also check for Qalqalah letters at word boundaries (common in pauses)
    final wordEndPattern = RegExp(r'[' + qalqalahLetters + r'](?=\s|$)');
    for (final match in wordEndPattern.allMatches(text)) {
      // Only add if not already detected with Sukoon
      final overlaps = spans.any((s) => s.start == match.start);
      if (!overlaps) {
        spans.add(TajweedSpan(
          start: match.start,
          end: match.end,
          rule: TajweedRule.qalqalah,
          matchedText: text.substring(match.start, match.end),
        ));
      }
    }

    return spans;
  }

  /// Detect Madd (مَدّ) - Elongation
  List<TajweedSpan> _detectMadd(String text) {
    List<TajweedSpan> spans = [];

    // Common Madd patterns:
    // 1. Alif with Madd sign (آ)
    // 2. Waw with Sukoon after Dammah (وْ)
    // 3. Ya with Sukoon after Kasrah (يْ)
    // 4. Letters with Madd Lazim (connected or separated)

    final patterns = [
      // Madd with Alif Madd (آ)
      RegExp(r'[\u0622]'), // آ

      // Natural Madd with elongated vowels
      RegExp(r'[اوي]\u0653'), // With Madd sign

      // Madd Munfasil (separated) - vowel + Hamzah
      RegExp(r'[اوي][\s]*[\u0621\u0623\u0624\u0625\u0626]'),

      // Common Madd patterns in specific words
      RegExp(r'ا{2,}'), // Multiple Alifs (rare but possible)
    ];

    for (final pattern in patterns) {
      for (final match in pattern.allMatches(text)) {
        spans.add(TajweedSpan(
          start: match.start,
          end: match.end,
          rule: TajweedRule.madd,
          matchedText: text.substring(match.start, match.end),
        ));
      }
    }

    return spans;
  }

  /// Remove overlapping spans - keep the one with higher priority
  List<TajweedSpan> _removeOverlaps(List<TajweedSpan> spans) {
    if (spans.isEmpty) return spans;

    // Sort by start position
    spans.sort((a, b) => a.start.compareTo(b.start));

    List<TajweedSpan> result = [];
    TajweedSpan? current;

    for (final span in spans) {
      if (current == null) {
        current = span;
        continue;
      }

      // Check for overlap
      if (span.start < current.end) {
        // Overlapping - keep the more specific/important rule
        // Priority: Iqlab > Idghaam > Ghunnah > Ikhfa > Qalqalah > Madd
        final priorities = {
          TajweedRule.iqlab: 6,
          TajweedRule.idghaam: 5,
          TajweedRule.ghunnah: 4,
          TajweedRule.ikhfa: 3,
          TajweedRule.qalqalah: 2,
          TajweedRule.madd: 1,
        };

        final currentPriority = priorities[current.rule] ?? 0;
        final spanPriority = priorities[span.rule] ?? 0;

        if (spanPriority > currentPriority) {
          current = span;
        }
      } else {
        // No overlap - add current and move to next
        result.add(current);
        current = span;
      }
    }

    if (current != null) {
      result.add(current);
    }

    return result;
  }

  /// Get human-readable description of what was detected
  String describeSpan(TajweedSpan span) {
    return '${span.rule.englishName} at position ${span.start}: "${span.matchedText}"';
  }

  /// Get statistics about Tajweed usage in text
  Map<TajweedRule, int> getStatistics(String text) {
    final spans = analyze(text);
    final stats = <TajweedRule, int>{};

    for (final rule in TajweedRule.values) {
      stats[rule] = 0;
    }

    for (final span in spans) {
      stats[span.rule] = (stats[span.rule] ?? 0) + 1;
    }

    return stats;
  }
}
