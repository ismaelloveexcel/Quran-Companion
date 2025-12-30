import 'package:flutter/material.dart';
import '../../../core/models/tajweed_rule.dart';
import '../../../core/models/waqf_sign.dart';
import '../dialogs/tajweed_explainer_dialog.dart';
import '../dialogs/waqf_explainer_dialog.dart';

/// Legend widget showing all Tajweed colors and Waqf signs
/// Can be collapsed/expanded and provides quick reference
class TajweedWaqfLegend extends StatelessWidget {
  final bool initiallyExpanded;

  const TajweedWaqfLegend({
    Key? key,
    this.initiallyExpanded = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.all(16),
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: ExpansionTile(
        title: Row(
          children: [
            Icon(Icons.palette, color: Colors.indigo),
            SizedBox(width: 12),
            Text(
              'Color Guide',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.indigo,
              ),
            ),
          ],
        ),
        subtitle: Text('Tap any color to learn more'),
        initiallyExpanded: initiallyExpanded,
        children: [
          Padding(
            padding: EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Tajweed Rules Section
                _buildSectionHeader(
                  icon: Icons.record_voice_over,
                  title: 'Pronunciation Rules (Tajweed)',
                  color: Colors.indigo,
                ),
                SizedBox(height: 12),
                ...TajweedRule.values.map((rule) =>
                    _buildTajweedLegendItem(context, rule)),

                SizedBox(height: 24),
                Divider(thickness: 2),
                SizedBox(height: 16),

                // Waqf Signs Section
                _buildSectionHeader(
                  icon: Icons.pause_circle_outline,
                  title: 'Stopping Rules (Waqf)',
                  color: Colors.deepOrange,
                ),
                SizedBox(height: 12),
                ...WaqfSign.values.map((sign) =>
                    _buildWaqfLegendItem(context, sign)),

                SizedBox(height: 16),

                // Help text
                Container(
                  padding: EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.blue[50],
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.blue[200]!),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.lightbulb_outline,
                          color: Colors.blue[700], size: 20),
                      SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Tap colored text or Waqf signs while reading for detailed explanations',
                          style: TextStyle(
                            fontSize: 13,
                            color: Colors.blue[900],
                            fontStyle: FontStyle.italic,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader({
    required IconData icon,
    required String title,
    required Color color,
  }) {
    return Row(
      children: [
        Icon(icon, color: color, size: 24),
        SizedBox(width: 8),
        Text(
          title,
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
      ],
    );
  }

  Widget _buildTajweedLegendItem(BuildContext context, TajweedRule rule) {
    return InkWell(
      onTap: () => _showTajweedDialog(context, rule),
      borderRadius: BorderRadius.circular(8),
      child: Container(
        margin: EdgeInsets.only(bottom: 8),
        padding: EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: rule.backgroundColor,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: rule.borderColor, width: 2),
        ),
        child: Row(
          children: [
            // Color indicator
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: rule.color,
                borderRadius: BorderRadius.circular(8),
                boxShadow: [
                  BoxShadow(
                    color: rule.color.withOpacity(0.3),
                    blurRadius: 4,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
            ),
            SizedBox(width: 12),

            // Text
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    rule.englishName,
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  SizedBox(height: 2),
                  Text(
                    rule.arabicName,
                    style: TextStyle(
                      fontSize: 20,
                      fontFamily: 'Amiri',
                      color: Colors.black54,
                    ),
                    textDirection: TextDirection.rtl,
                  ),
                ],
              ),
            ),

            // Arrow
            Icon(
              Icons.chevron_right,
              color: rule.color,
              size: 24,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWaqfLegendItem(BuildContext context, WaqfSign sign) {
    return InkWell(
      onTap: () => _showWaqfDialog(context, sign),
      borderRadius: BorderRadius.circular(8),
      child: Container(
        margin: EdgeInsets.only(bottom: 8),
        padding: EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: sign.backgroundColor,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: sign.color, width: 2),
        ),
        child: Row(
          children: [
            // Sign indicator
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: sign.color,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: sign.color.withOpacity(0.3),
                    blurRadius: 4,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: Center(
                child: Text(
                  sign.symbol,
                  style: TextStyle(
                    fontSize: 24,
                    color: Colors.white,
                    fontFamily: 'Amiri',
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            SizedBox(width: 12),

            // Text
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    sign.englishName,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    sign.action,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: sign.color,
                    ),
                  ),
                ],
              ),
            ),

            // Arrow
            Icon(
              Icons.chevron_right,
              color: sign.color,
              size: 24,
            ),
          ],
        ),
      ),
    );
  }

  void _showTajweedDialog(BuildContext context, TajweedRule rule) {
    showDialog(
      context: context,
      builder: (ctx) => TajweedExplainerDialog(rule: rule),
    );
  }

  void _showWaqfDialog(BuildContext context, WaqfSign sign) {
    showDialog(
      context: context,
      builder: (ctx) => WaqfExplainerDialog(sign: sign),
    );
  }
}

/// Compact version for toolbar/header
class CompactLegendButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: Icon(Icons.palette_outlined),
      tooltip: 'View Color Guide',
      onPressed: () {
        showDialog(
          context: context,
          builder: (ctx) => Dialog(
            child: Container(
              constraints: BoxConstraints(maxWidth: 500, maxHeight: 700),
              child: Column(
                children: [
                  AppBar(
                    title: Text('Color Guide'),
                    automaticallyImplyLeading: false,
                    actions: [
                      IconButton(
                        icon: Icon(Icons.close),
                        onPressed: () => Navigator.pop(ctx),
                      ),
                    ],
                  ),
                  Expanded(
                    child: SingleChildScrollView(
                      child: TajweedWaqfLegend(initiallyExpanded: true),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
