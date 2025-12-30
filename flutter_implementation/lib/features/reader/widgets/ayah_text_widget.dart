import 'package:flutter/material.dart';
import '../../../core/models/tajweed_rule.dart';
import '../../../core/models/waqf_sign.dart';
import '../tajweed/tajweed_engine.dart';
import '../dialogs/tajweed_explainer_dialog.dart';
import '../dialogs/waqf_explainer_dialog.dart';

/// Widget that displays an Ayah with Tajweed coloring and Waqf signs
class AyahTextWidget extends StatelessWidget {
  final String arabicText;
  final double fontSize;
  final bool showTajweed;
  final bool showWaqf;
  final List<WaqfPosition>? waqfPositions;
  final TextAlign textAlign;
  final double lineHeight;

  const AyahTextWidget({
    Key? key,
    required this.arabicText,
    this.fontSize = 32.0,
    this.showTajweed = true,
    this.showWaqf = true,
    this.waqfPositions,
    this.textAlign = TextAlign.right,
    this.lineHeight = 2.0,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (!showTajweed && !showWaqf) {
      // Plain text without any coloring
      return Text(
        arabicText,
        textDirection: TextDirection.rtl,
        textAlign: textAlign,
        style: TextStyle(
          fontSize: fontSize,
          fontFamily: 'Amiri',
          height: lineHeight,
          color: Theme.of(context).textTheme.bodyLarge?.color,
        ),
      );
    }

    // Build colored text with Tajweed and Waqf
    return RichText(
      textDirection: TextDirection.rtl,
      textAlign: textAlign,
      text: TextSpan(
        style: TextStyle(
          fontSize: fontSize,
          fontFamily: 'Amiri',
          height: lineHeight,
          color: Theme.of(context).textTheme.bodyLarge?.color ?? Colors.black,
        ),
        children: _buildTextSpans(context),
      ),
    );
  }

  List<InlineSpan> _buildTextSpans(BuildContext context) {
    List<InlineSpan> spans = [];

    // Get Tajweed spans if enabled
    final tajweedSpans = showTajweed
        ? TajweedEngine().analyze(arabicText)
        : <TajweedSpan>[];

    // Combine positions: Tajweed spans + Waqf positions
    final allPositions = <int, dynamic>{};

    for (final tajweedSpan in tajweedSpans) {
      for (int i = tajweedSpan.start; i < tajweedSpan.end; i++) {
        allPositions[i] = tajweedSpan;
      }
    }

    // Build the text with colors
    int currentPos = 0;
    final textLength = arabicText.length;

    while (currentPos < textLength) {
      // Check if current position has Tajweed
      if (allPositions.containsKey(currentPos)) {
        final tajweedSpan = allPositions[currentPos] as TajweedSpan;

        spans.add(
          WidgetSpan(
            alignment: PlaceholderAlignment.baseline,
            baseline: TextBaseline.alphabetic,
            child: GestureDetector(
              onTap: () => _showTajweedExplanation(context, tajweedSpan.rule),
              child: Container(
                padding: EdgeInsets.symmetric(horizontal: 2),
                decoration: BoxDecoration(
                  color: tajweedSpan.rule.backgroundColor,
                  borderRadius: BorderRadius.circular(4),
                  border: Border(
                    bottom: BorderSide(
                      color: tajweedSpan.rule.borderColor,
                      width: 2,
                    ),
                  ),
                ),
                child: Text(
                  arabicText.substring(tajweedSpan.start, tajweedSpan.end),
                  style: TextStyle(
                    fontSize: fontSize,
                    fontFamily: 'Amiri',
                    height: lineHeight,
                    color: Theme.of(context).textTheme.bodyLarge?.color,
                  ),
                  textDirection: TextDirection.rtl,
                ),
              ),
            ),
          ),
        );

        currentPos = tajweedSpan.end;
      } else {
        // Regular text without Tajweed
        int nextTajweedPos = textLength;

        // Find next Tajweed position
        for (final pos in allPositions.keys) {
          if (pos > currentPos && pos < nextTajweedPos) {
            nextTajweedPos = pos;
          }
        }

        final regularText = arabicText.substring(currentPos, nextTajweedPos);

        // Check for Waqf signs in this segment
        if (showWaqf && waqfPositions != null) {
          spans.addAll(_buildTextWithWaqf(context, regularText, currentPos));
        } else {
          spans.add(TextSpan(text: regularText));
        }

        currentPos = nextTajweedPos;
      }
    }

    return spans;
  }

  /// Build text with Waqf sign indicators
  List<InlineSpan> _buildTextWithWaqf(
    BuildContext context,
    String text,
    int basePosition,
  ) {
    if (waqfPositions == null || waqfPositions!.isEmpty) {
      return [TextSpan(text: text)];
    }

    List<InlineSpan> spans = [];
    int currentPos = 0;

    for (final waqfPos in waqfPositions!) {
      final relativePos = waqfPos.position - basePosition;

      if (relativePos >= 0 && relativePos <= text.length) {
        // Add text before Waqf sign
        if (currentPos < relativePos) {
          spans.add(TextSpan(text: text.substring(currentPos, relativePos)));
        }

        // Add Waqf indicator
        spans.add(
          WidgetSpan(
            alignment: PlaceholderAlignment.middle,
            child: GestureDetector(
              onTap: () => _showWaqfExplanation(context, waqfPos.sign),
              child: Container(
                margin: EdgeInsets.symmetric(horizontal: 4),
                padding: EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: waqfPos.sign.backgroundColor,
                  border: Border.all(color: waqfPos.sign.color, width: 2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  waqfPos.sign.symbol,
                  style: TextStyle(
                    fontSize: fontSize * 0.6,
                    color: waqfPos.sign.color,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ),
        );

        currentPos = relativePos;
      }
    }

    // Add remaining text
    if (currentPos < text.length) {
      spans.add(TextSpan(text: text.substring(currentPos)));
    }

    return spans;
  }

  void _showTajweedExplanation(BuildContext context, TajweedRule rule) {
    showDialog(
      context: context,
      builder: (ctx) => TajweedExplainerDialog(rule: rule),
    );
  }

  void _showWaqfExplanation(BuildContext context, WaqfSign sign) {
    showDialog(
      context: context,
      builder: (ctx) => WaqfExplainerDialog(sign: sign),
    );
  }
}
