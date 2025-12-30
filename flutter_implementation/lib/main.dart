import 'package:flutter/material.dart';
import 'core/models/tajweed_rule.dart';
import 'core/models/waqf_sign.dart';
import 'features/reader/widgets/ayah_text_widget.dart';
import 'features/reader/widgets/tajweed_waqf_legend.dart';

void main() {
  runApp(QuranCompanionApp());
}

class QuranCompanionApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Quran Companion',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.green,
        fontFamily: 'Amiri',
        textTheme: TextTheme(
          bodyLarge: TextStyle(fontSize: 18, height: 1.8),
          bodyMedium: TextStyle(fontSize: 16, height: 1.6),
        ),
      ),
      home: ReaderScreen(),
    );
  }
}

class ReaderScreen extends StatefulWidget {
  @override
  State<ReaderScreen> createState() => _ReaderScreenState();
}

class _ReaderScreenState extends State<ReaderScreen> {
  double _fontSize = 36.0;
  bool _showTajweed = true;
  bool _showWaqf = true;

  // Sample data - Al-Fatiha
  final List<AyahData> _ayahs = [
    AyahData(
      number: 1,
      arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
      translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
      transliteration: "Bismillah ir-Rahman ir-Raheem",
      waqfPositions: [],
    ),
    AyahData(
      number: 2,
      arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ",
      translation: "[All] praise is [due] to Allah, Lord of the worlds.",
      transliteration: "Al-hamdu lillahi Rabbi l-'alameen",
      waqfPositions: [
        WaqfPosition(position: 28, sign: WaqfSign.permissible),
      ],
    ),
    AyahData(
      number: 3,
      arabic: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
      translation: "The Entirely Merciful, the Especially Merciful,",
      transliteration: "Ar-Rahman ir-Raheem",
      waqfPositions: [
        WaqfPosition(position: 21, sign: WaqfSign.permissible),
      ],
    ),
    AyahData(
      number: 4,
      arabic: "مَـٰلِكِ يَوْمِ ٱلدِّينِ",
      translation: "Sovereign of the Day of Recompense.",
      transliteration: "Maliki yawmi d-deen",
      waqfPositions: [
        WaqfPosition(position: 18, sign: WaqfSign.mustStop),
      ],
    ),
    AyahData(
      number: 5,
      arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      translation: "It is You we worship and You we ask for help.",
      transliteration: "Iyyaka na'budu wa iyyaka nasta'een",
      waqfPositions: [
        WaqfPosition(position: 35, sign: WaqfSign.mustStop),
      ],
    ),
    AyahData(
      number: 6,
      arabic: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
      translation: "Guide us to the straight path.",
      transliteration: "Ihdina s-sirata l-mustaqeem",
      waqfPositions: [
        WaqfPosition(position: 30, sign: WaqfSign.doNotStop),
      ],
    ),
    AyahData(
      number: 7,
      arabic: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
      translation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
      transliteration: "Sirata l-ladhina an'amta 'alayhim ghayri l-maghdubi 'alayhim wa la d-dalleen",
      waqfPositions: [
        WaqfPosition(position: 34, sign: WaqfSign.permissible),
      ],
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFFFFBF5), // Warm cream background
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Al-Fatiha', style: TextStyle(fontSize: 20)),
            Text('The Opening', style: TextStyle(fontSize: 14, fontWeight: FontWeight.normal)),
          ],
        ),
        backgroundColor: Colors.green[700],
        foregroundColor: Colors.white,
        actions: [
          CompactLegendButton(),
          SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          // Settings bar
          Container(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black12,
                  blurRadius: 4,
                  offset: Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              children: [
                // Font size controls
                Icon(Icons.text_fields, size: 20, color: Colors.grey[700]),
                SizedBox(width: 8),
                Expanded(
                  child: Slider(
                    value: _fontSize,
                    min: 24,
                    max: 64,
                    divisions: 10,
                    label: _fontSize.round().toString(),
                    onChanged: (val) => setState(() => _fontSize = val),
                  ),
                ),
                Text('${_fontSize.round()}', style: TextStyle(fontWeight: FontWeight.bold)),

                SizedBox(width: 16),

                // Tajweed toggle
                Text('Tajweed', style: TextStyle(fontSize: 14)),
                Switch(
                  value: _showTajweed,
                  onChanged: (val) => setState(() => _showTajweed = val),
                  activeColor: Colors.green,
                ),

                SizedBox(width: 8),

                // Waqf toggle
                Text('Waqf', style: TextStyle(fontSize: 14)),
                Switch(
                  value: _showWaqf,
                  onChanged: (val) => setState(() => _showWaqf = val),
                  activeColor: Colors.green,
                ),
              ],
            ),
          ),

          // Ayahs
          Expanded(
            child: ListView(
              padding: EdgeInsets.all(16),
              children: [
                // Legend (collapsible)
                TajweedWaqfLegend(initiallyExpanded: false),

                SizedBox(height: 20),

                // Bismillah (centered)
                Center(
                  child: Container(
                    padding: EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.green[50],
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.green[200]!),
                    ),
                    child: Text(
                      'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
                      style: TextStyle(
                        fontSize: 32,
                        fontFamily: 'Amiri',
                        color: Colors.green[900],
                      ),
                      textDirection: TextDirection.rtl,
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),

                SizedBox(height: 30),

                // Ayahs
                ..._ayahs.map((ayah) => _buildAyahCard(ayah)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAyahCard(AyahData ayah) {
    return Container(
      margin: EdgeInsets.only(bottom: 24),
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 8,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Verse number badge
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: Colors.green[100],
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.green[300]!, width: 2),
                ),
                child: Center(
                  child: Text(
                    '${ayah.number}',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.green[900],
                    ),
                  ),
                ),
              ),
              SizedBox(width: 12),
              Text(
                'Verse ${ayah.number}',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey[700],
                ),
              ),
            ],
          ),

          SizedBox(height: 16),
          Divider(),
          SizedBox(height: 16),

          // Arabic text with Tajweed and Waqf
          AyahTextWidget(
            arabicText: ayah.arabic,
            fontSize: _fontSize,
            showTajweed: _showTajweed,
            showWaqf: _showWaqf,
            waqfPositions: _showWaqf ? ayah.waqfPositions : null,
          ),

          SizedBox(height: 20),

          // Translation
          Text(
            ayah.translation,
            style: TextStyle(
              fontSize: 16,
              height: 1.6,
              color: Colors.grey[700],
            ),
          ),

          SizedBox(height: 12),

          // Transliteration
          Text(
            ayah.transliteration,
            style: TextStyle(
              fontSize: 14,
              fontStyle: FontStyle.italic,
              color: Colors.grey[500],
            ),
          ),
        ],
      ),
    );
  }
}

// Simple data model for demo
class AyahData {
  final int number;
  final String arabic;
  final String translation;
  final String transliteration;
  final List<WaqfPosition> waqfPositions;

  AyahData({
    required this.number,
    required this.arabic,
    required this.translation,
    required this.transliteration,
    this.waqfPositions = const [],
  });
}
