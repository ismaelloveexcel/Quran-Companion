import 'package:flutter/material.dart';

/// Represents the Waqf (stopping) signs in Quran recitation
enum WaqfSign {
  /// Must Stop (م - Meem) - Compulsory stop
  mustStop(
    symbol: 'ۘ',
    arabicName: 'م',
    englishName: 'Meem (Must Stop)',
    color: Color(0xFFD32F2F), // Red
    explanation: 'You MUST stop here to preserve the correct meaning of the verse. Take a breath before continuing.',
    action: 'STOP & BREATHE',
    priority: 5,
    audioExample: 'assets/audio/waqf/must_stop.mp3',
  ),

  /// Do Not Stop (لا - Laa) - Prohibited stop
  doNotStop(
    symbol: 'لا',
    arabicName: 'لا',
    englishName: 'Laa (Do Not Stop)',
    color: Color(0xFF212121), // Dark grey/black
    explanation: 'Do NOT stop here. You must continue reading to the next word to maintain proper meaning.',
    action: 'DON\'T STOP',
    priority: 5,
    audioExample: 'assets/audio/waqf/do_not_stop.mp3',
  ),

  /// Permissible (ج - Jeem) - Optional stop
  permissible(
    symbol: 'ج',
    arabicName: 'ج',
    englishName: 'Jeem (Permissible)',
    color: Color(0xFF4CAF50), // Green
    explanation: 'You can stop here if you need to take a breath, or you can continue. Both options are acceptable.',
    action: 'OPTIONAL',
    priority: 1,
    audioExample: 'assets/audio/waqf/permissible.mp3',
  ),

  /// Better to Continue (صلى - Saad-Laa)
  betterToContinue(
    symbol: 'صلى',
    arabicName: 'صلى',
    englishName: 'Saad-Laa (Better to Continue)',
    color: Color(0xFFFBC02D), // Yellow
    explanation: 'You can stop here if necessary, but it is better and more correct to continue reading.',
    action: 'KEEP GOING (preferred)',
    priority: 3,
    audioExample: 'assets/audio/waqf/better_continue.mp3',
  ),

  /// Better to Stop (قلى - Qaaf-Laa)
  betterToStop(
    symbol: 'قلى',
    arabicName: 'قلى',
    englishName: 'Qaaf-Laa (Better to Stop)',
    color: Color(0xFFFF9800), // Orange
    explanation: 'You can continue if needed, but it is better and more correct to stop here and take a breath.',
    action: 'PAUSE (preferred)',
    priority: 4,
    audioExample: 'assets/audio/waqf/better_stop.mp3',
  ),

  /// Paired Dots (∴ - Mu'anaqah) - Stop at one, not both
  pairedDots(
    symbol: 'ۛ',
    arabicName: '∴',
    englishName: 'Mu\'anaqah (Paired Dots)',
    color: Color(0xFF9C27B0), // Purple
    explanation: 'When you see these three dots appear twice in a verse, you should stop at ONE location, but not at the other.',
    action: 'PICK ONE LOCATION',
    priority: 2,
    audioExample: 'assets/audio/waqf/paired_dots.mp3',
  );

  const WaqfSign({
    required this.symbol,
    required this.arabicName,
    required this.englishName,
    required this.color,
    required this.explanation,
    required this.action,
    required this.priority,
    required this.audioExample,
  });

  final String symbol;
  final String arabicName;
  final String englishName;
  final Color color;
  final String explanation;
  final String action;
  final int priority; // 5 = must follow, 1 = optional
  final String audioExample;

  /// Get a lighter background color
  Color get backgroundColor => color.withOpacity(0.15);

  /// Get icon for visual representation
  IconData get icon {
    switch (this) {
      case WaqfSign.mustStop:
        return Icons.stop_circle;
      case WaqfSign.doNotStop:
        return Icons.do_not_disturb;
      case WaqfSign.permissible:
        return Icons.check_circle;
      case WaqfSign.betterToContinue:
        return Icons.arrow_forward;
      case WaqfSign.betterToStop:
        return Icons.pause_circle;
      case WaqfSign.pairedDots:
        return Icons.more_horiz;
    }
  }
}

/// Represents the position of a Waqf sign in an ayah
class WaqfPosition {
  final int position; // Character index in the text
  final WaqfSign sign;
  final String? context; // Surrounding text for context

  const WaqfPosition({
    required this.position,
    required this.sign,
    this.context,
  });

  Map<String, dynamic> toJson() {
    return {
      'position': position,
      'sign': sign.name,
      'context': context,
    };
  }

  factory WaqfPosition.fromJson(Map<String, dynamic> json) {
    return WaqfPosition(
      position: json['position'] as int,
      sign: WaqfSign.values.firstWhere(
        (s) => s.name == json['sign'],
        orElse: () => WaqfSign.permissible,
      ),
      context: json['context'] as String?,
    );
  }

  @override
  String toString() {
    return 'WaqfPosition(pos: $position, sign: ${sign.englishName})';
  }
}
