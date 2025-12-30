import 'package:flutter/material.dart';
import 'package:audioplayers/audioplayers.dart';
import '../../../core/models/waqf_sign.dart';

/// Dialog that explains a Waqf (stopping) sign
class WaqfExplainerDialog extends StatefulWidget {
  final WaqfSign sign;

  const WaqfExplainerDialog({
    Key? key,
    required this.sign,
  }) : super(key: key);

  @override
  State<WaqfExplainerDialog> createState() => _WaqfExplainerDialogState();
}

class _WaqfExplainerDialogState extends State<WaqfExplainerDialog> {
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
      await _audioPlayer.play(AssetSource(widget.sign.audioExample));
      _audioPlayer.onPlayerComplete.listen((_) {
        if (mounted) {
          setState(() => _isPlayingAudio = false);
        }
      });
    } catch (e) {
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
            // Header with Waqf sign
            Container(
              padding: EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: widget.sign.backgroundColor,
                borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
                border: Border(
                  bottom: BorderSide(color: widget.sign.color, width: 3),
                ),
              ),
              child: Row(
                children: [
                  // Sign indicator
                  Container(
                    width: 70,
                    height: 70,
                    decoration: BoxDecoration(
                      color: widget.sign.color,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: widget.sign.color.withOpacity(0.4),
                          blurRadius: 12,
                          spreadRadius: 3,
                        ),
                      ],
                    ),
                    child: Center(
                      child: Text(
                        widget.sign.symbol,
                        style: TextStyle(
                          fontSize: 36,
                          color: Colors.white,
                          fontFamily: 'Amiri',
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                  SizedBox(width: 16),

                  // Title
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.sign.englishName,
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.black87,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          widget.sign.arabicName,
                          style: TextStyle(
                            fontSize: 32,
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
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Action card (prominent)
                    Container(
                      padding: EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            widget.sign.color,
                            widget.sign.color.withOpacity(0.8),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: widget.sign.color.withOpacity(0.3),
                            blurRadius: 8,
                            offset: Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          Icon(
                            widget.sign.icon,
                            size: 48,
                            color: Colors.white,
                          ),
                          SizedBox(height: 12),
                          Text(
                            widget.sign.action,
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                              letterSpacing: 1.2,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),

                    SizedBox(height: 24),

                    // Explanation
                    _buildSection(
                      icon: Icons.info_outline,
                      title: 'What does this mean?',
                      content: widget.sign.explanation,
                    ),

                    SizedBox(height: 20),

                    // Priority indicator
                    _buildPriorityIndicator(),

                    SizedBox(height: 20),

                    // Audio button
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
                  Flexible(
                    child: Text(
                      'Tap Waqf signs while reading to see this explanation',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.black54,
                        fontStyle: FontStyle.italic,
                      ),
                      textAlign: TextAlign.center,
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
            Icon(icon, size: 20, color: widget.sign.color),
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
          padding: EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.grey[50],
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.grey[300]!),
          ),
          child: Text(
            content,
            style: TextStyle(
              fontSize: 15,
              height: 1.6,
              color: Colors.black87,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildPriorityIndicator() {
    final priorityText = widget.sign.priority == 5
        ? 'MUST FOLLOW'
        : widget.sign.priority >= 3
            ? 'RECOMMENDED'
            : 'OPTIONAL';

    final priorityColor = widget.sign.priority == 5
        ? Colors.red
        : widget.sign.priority >= 3
            ? Colors.orange
            : Colors.green;

    return Container(
      padding: EdgeInsets.symmetric(vertical: 12, horizontal: 16),
      decoration: BoxDecoration(
        color: priorityColor.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: priorityColor, width: 2),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.priority_high, color: priorityColor, size: 24),
          SizedBox(width: 8),
          Text(
            'Priority: $priorityText',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: priorityColor,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAudioButton() {
    return Center(
      child: ElevatedButton.icon(
        onPressed: _playAudioExample,
        icon: Icon(
          _isPlayingAudio ? Icons.stop_circle : Icons.volume_up,
          size: 28,
        ),
        label: Text(
          _isPlayingAudio ? 'Stop Example' : 'Hear Example',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        style: ElevatedButton.styleFrom(
          backgroundColor: widget.sign.color,
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
