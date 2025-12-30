import 'package:flutter/material.dart';
import 'package:audioplayers/audioplayers.dart';
import '../../../core/models/tajweed_rule.dart';

/// Dialog that explains a Tajweed rule when user taps on colored text
class TajweedExplainerDialog extends StatefulWidget {
  final TajweedRule rule;

  const TajweedExplainerDialog({
    Key? key,
    required this.rule,
  }) : super(key: key);

  @override
  State<TajweedExplainerDialog> createState() => _TajweedExplainerDialogState();
}

class _TajweedExplainerDialogState extends State<TajweedExplainerDialog> {
  final AudioPlayer _audioPlayer = AudioPlayer();
  bool _isPlayingAudio = false;

  @override
  void dispose() {
    _audioPlayer.dispose();
    super.dispose();
  }

  Future<void> _playAudioExample() async {
    if (_isPlayingAudio) {
      await _audioPlayer.stop();
      setState(() => _isPlayingAudio = false);
      return;
    }

    setState(() => _isPlayingAudio = true);

    try {
      await _audioPlayer.play(AssetSource(widget.rule.audioExample));
      _audioPlayer.onPlayerComplete.listen((_) {
        if (mounted) {
          setState(() => _isPlayingAudio = false);
        }
      });
    } catch (e) {
      // Audio file might not exist yet
      if (mounted) {
        setState(() => _isPlayingAudio = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Audio example not available')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Container(
        constraints: BoxConstraints(maxWidth: 500, maxHeight: 600),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Header with color indicator
            Container(
              padding: EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: widget.rule.backgroundColor,
                borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
                border: Border(
                  bottom: BorderSide(color: widget.rule.borderColor, width: 3),
                ),
              ),
              child: Row(
                children: [
                  // Color indicator
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      color: widget.rule.color,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: widget.rule.color.withOpacity(0.4),
                          blurRadius: 8,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                  ),
                  SizedBox(width: 16),

                  // Title
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.rule.englishName,
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.black87,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          widget.rule.arabicName,
                          style: TextStyle(
                            fontSize: 28,
                            fontFamily: 'Amiri',
                            color: Colors.black54,
                          ),
                          textDirection: TextDirection.rtl,
                        ),
                      ],
                    ),
                  ),

                  // Close button
                  IconButton(
                    icon: Icon(Icons.close, size: 28),
                    onPressed: () => Navigator.pop(context),
                    color: Colors.black54,
                  ),
                ],
              ),
            ),

            // Content
            Flexible(
              child: SingleChildScrollView(
                padding: EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // What it is
                    _buildSection(
                      icon: Icons.info_outline,
                      title: 'What is it?',
                      content: widget.rule.explanation,
                    ),

                    SizedBox(height: 20),

                    // How to apply
                    _buildSection(
                      icon: Icons.school_outlined,
                      title: 'How to apply',
                      content: widget.rule.howToApply,
                    ),

                    SizedBox(height: 20),

                    // Examples
                    _buildExamplesSection(),

                    SizedBox(height: 20),

                    // Audio example button
                    _buildAudioButton(),
                  ],
                ),
              ),
            ),

            // Footer
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.vertical(bottom: Radius.circular(20)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.touch_app, size: 18, color: Colors.black54),
                  SizedBox(width: 8),
                  Text(
                    'Tap colored text while reading to see this explanation',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.black54,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSection({
    required IconData icon,
    required String title,
    required String content,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, size: 20, color: widget.rule.color),
            SizedBox(width: 8),
            Text(
              title,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
          ],
        ),
        SizedBox(height: 8),
        Container(
          padding: EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.grey[50],
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.grey[300]!),
          ),
          child: Text(
            content,
            style: TextStyle(
              fontSize: 15,
              height: 1.5,
              color: Colors.black87,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildExamplesSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(Icons.format_quote, size: 20, color: widget.rule.color),
            SizedBox(width: 8),
            Text(
              'Examples from Quran',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
          ],
        ),
        SizedBox(height: 12),
        ...widget.rule.examples.map((example) => Container(
              margin: EdgeInsets.only(bottom: 8),
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: widget.rule.backgroundColor,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: widget.rule.borderColor, width: 2),
              ),
              child: Center(
                child: Text(
                  example,
                  style: TextStyle(
                    fontSize: 32,
                    fontFamily: 'Amiri',
                    color: Colors.black87,
                    height: 1.8,
                  ),
                  textDirection: TextDirection.rtl,
                  textAlign: TextAlign.center,
                ),
              ),
            )),
      ],
    );
  }

  Widget _buildAudioButton() {
    return Center(
      child: ElevatedButton.icon(
        onPressed: _playAudioExample,
        icon: Icon(
          _isPlayingAudio ? Icons.stop_circle : Icons.play_circle_filled,
          size: 28,
        ),
        label: Text(
          _isPlayingAudio ? 'Stop Audio Example' : 'Play Audio Example',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        style: ElevatedButton.styleFrom(
          backgroundColor: widget.rule.color,
          foregroundColor: Colors.white,
          padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 4,
        ),
      ),
    );
  }
}
