# Quran Companion - Flutter Implementation

A Flutter app for reading the Quran with **Tajweed color-coding** and **Waqf (stopping) signs** - designed for elderly users and non-native Arabic speakers.

## ✨ Key Features

### 🎨 Tajweed Color Coding (6 Rules)
- **Ghunnah** (Green) - Nasal sound
- **Idghaam** (Dark Blue) - Merging
- **Ikhfa** (Orange) - Hiding
- **Iqlab** (Purple) - Converting
- **Qalqalah** (Red) - Echo sound
- **Madd** (Light Blue) - Elongation

### 🛑 Waqf Stopping Signs (5 Signs)
- **Must Stop** (Red circle) - ۘ
- **Do Not Stop** (Black) - لا
- **Permissible** (Green) - ج
- **Better to Continue** (Yellow) - صلى
- **Better to Stop** (Orange) - قلى

### 🔊 Interactive Learning
- Tap any colored text → Learn the Tajweed rule
- Tap any Waqf sign → Learn when to stop
- Audio examples for each rule
- Complete color guide reference

### ♿ Accessibility
- Large, adjustable font (24-72sp)
- High contrast colors
- Simple tap interactions
- Screen reader support

---

## 📁 Project Structure

```
lib/
├── core/
│   └── models/
│       ├── tajweed_rule.dart         # 6 Tajweed rules with colors
│       └── waqf_sign.dart            # 5 Waqf signs with actions
│
├── features/
│   └── reader/
│       ├── tajweed/
│       │   └── tajweed_engine.dart   # Detects Tajweed in Arabic text
│       ├── widgets/
│       │   ├── ayah_text_widget.dart       # Colored Quran text
│       │   └── tajweed_waqf_legend.dart    # Color guide
│       └── dialogs/
│           ├── tajweed_explainer_dialog.dart
│           └── waqf_explainer_dialog.dart
│
└── assets/
    ├── data/
    │   └── sample_surah_with_waqf.json    # Example data structure
    ├── audio/
    │   ├── tajweed/                       # Tajweed rule examples
    │   └── waqf/                          # Waqf sign examples
    └── fonts/
        ├── Amiri-Regular.ttf              # Arabic font
        └── Amiri-Bold.ttf
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```yaml
# pubspec.yaml
dependencies:
  flutter:
    sdk: flutter

  # UI
  audioplayers: ^5.2.1      # Audio playback for examples

  # Data & Storage
  http: ^1.1.0              # API requests
  sqflite: ^2.3.0           # Local database
  path: ^1.8.3              # Path utilities
  shared_preferences: ^2.2.2

  # Utils
  xml: ^6.3.0               # Parse Tanzil XML if needed

fonts:
  - family: Amiri
    fonts:
      - asset: assets/fonts/Amiri-Regular.ttf
      - asset: assets/fonts/Amiri-Bold.ttf
        weight: 700
```

### 2. Download Arabic Font

Download Amiri font (free):
```
https://fonts.google.com/specimen/Amiri
```

Place in `assets/fonts/`

### 3. Get Quran Data

See [DATA_SOURCES.md](DATA_SOURCES.md) for options.

**Quick option**: Use sample data provided:
```dart
final ayah = Ayah(
  surahId: 1,
  ayahNumber: 1,
  textUthmani: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
  translation: "In the name of Allah...",
  waqfPositions: [
    WaqfPosition(position: 32, sign: WaqfSign.permissible),
  ],
);
```

### 4. Display Ayah with Colors

```dart
import 'package:flutter/material.dart';
import 'features/reader/widgets/ayah_text_widget.dart';

class ReaderScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Al-Fatiha')),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            // Color guide (collapsible)
            TajweedWaqfLegend(),

            SizedBox(height: 20),

            // Ayah with Tajweed colors and Waqf signs
            AyahTextWidget(
              arabicText: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
              fontSize: 36,
              showTajweed: true,
              showWaqf: true,
              waqfPositions: [
                WaqfPosition(position: 32, sign: WaqfSign.permissible),
              ],
            ),

            SizedBox(height: 12),

            // Translation
            Text(
              "In the name of Allah, the Entirely Merciful...",
              style: TextStyle(fontSize: 16, color: Colors.grey[700]),
            ),
          ],
        ),
      ),
    );
  }
}
```

---

## 🎨 How Tajweed Works

### 1. Tajweed Engine

The `TajweedEngine` analyzes Arabic text using regex patterns:

```dart
final engine = TajweedEngine();
final spans = engine.analyze("إِنَّ ٱللَّهَ");

// Returns:
// [TajweedSpan(start: 0, end: 4, rule: Ghunnah, text: "إِنَّ")]
```

### 2. Color Mapping

Each detected rule gets a color:

```dart
switch (rule) {
  case TajweedRule.ghunnah:
    return Color(0xFF4CAF50);  // Green
  case TajweedRule.idghaam:
    return Color(0xFF1565C0);  // Dark Blue
  // ... etc
}
```

### 3. Interactive UI

Tap colored text → Explainer dialog shows:
- Rule name (Arabic + English)
- What it means
- How to pronounce
- Examples from Quran
- Audio demonstration

---

## 🛑 How Waqf Works

### 1. Data Structure

Waqf signs are stored with character positions:

```json
{
  "text": "ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ ۛ فِيهِ",
  "waqf_positions": [
    {
      "position": 23,
      "sign": "pairedDots",
      "context": "after رَيْبَ"
    }
  ]
}
```

### 2. Visual Indicators

Waqf signs appear as colored badges:

```
لَا رَيْبَ [ۛ] فِيهِ
         ↑
    Purple badge
    (Paired Dots)
```

### 3. Tap to Learn

Tap badge → Dialog shows:
- Sign name
- **Action** (STOP, DON'T STOP, etc.)
- Explanation
- Priority level
- Audio example

---

## 🎯 Usage Examples

### Example 1: Basic Ayah Display

```dart
AyahTextWidget(
  arabicText: ayah.textUthmani,
  fontSize: 32,
  showTajweed: true,
  showWaqf: true,
  waqfPositions: ayah.waqfPositions,
)
```

### Example 2: Settings Toggle

```dart
class ReadingSettings {
  bool showTajweed = true;
  bool showWaqf = true;
  double fontSize = 32;
}

// In UI:
SwitchListTile(
  title: Text('Show Tajweed Colors'),
  value: settings.showTajweed,
  onChanged: (val) => setState(() => settings.showTajweed = val),
)
```

### Example 3: Color Guide Button

```dart
// In AppBar:
actions: [
  CompactLegendButton(),  // Shows popup with all colors
]
```

### Example 4: Programmatic Analysis

```dart
final engine = TajweedEngine();

// Analyze text
final spans = engine.analyze(arabicText);

// Get statistics
final stats = engine.getStatistics(arabicText);
print('Found ${stats[TajweedRule.ghunnah]} Ghunnah instances');

// Describe each span
for (final span in spans) {
  print(engine.describeSpan(span));
}
```

---

## 🎵 Audio Integration

### 1. Tajweed Rule Examples

Record or download audio for each rule:

```
assets/audio/tajweed/
├── ghunnah.mp3
├── idghaam.mp3
├── ikhfa.mp3
├── iqlab.mp3
├── qalqalah.mp3
└── madd.mp3
```

### 2. Waqf Sign Examples

```
assets/audio/waqf/
├── must_stop.mp3
├── do_not_stop.mp3
├── permissible.mp3
├── better_continue.mp3
└── better_stop.mp3
```

### 3. Play in Dialog

```dart
final audioPlayer = AudioPlayer();
await audioPlayer.play(AssetSource('audio/tajweed/ghunnah.mp3'));
```

---

## 🧪 Testing

### Test Tajweed Detection

```dart
void main() {
  test('Detect Ghunnah correctly', () {
    final engine = TajweedEngine();
    final text = 'إِنَّ ٱللَّهَ';  // Contains Ghunnah

    final spans = engine.analyze(text);

    expect(spans.length, greaterThan(0));
    expect(spans.first.rule, TajweedRule.ghunnah);
    expect(spans.first.matchedText, 'إِنَّ');
  });

  test('Detect Qalqalah at word end', () {
    final engine = TajweedEngine();
    final text = 'الفَلَقِ';  // ق with Sukoon

    final spans = engine.analyze(text);

    expect(spans.any((s) => s.rule == TajweedRule.qalqalah), true);
  });
}
```

---

## 📱 Platform Support

- ✅ **Android** 6.0+ (API 23+)
- ✅ **iOS** 11.0+
- ✅ **Web** (with limitations on audio)
- ⚠️ **Desktop** (untested)

---

## 🎨 Customization

### Change Tajweed Colors

Edit `lib/core/models/tajweed_rule.dart`:

```dart
ghunnah(
  // ... other properties
  color: Color(0xFF00FF00),  // Change to bright green
)
```

### Change Font Size Range

Edit `ayah_text_widget.dart`:

```dart
Slider(
  value: fontSize,
  min: 20.0,   // Minimum
  max: 80.0,   // Maximum
  onChanged: (val) => setState(() => fontSize = val),
)
```

### Add More Waqf Signs

Edit `lib/core/models/waqf_sign.dart` and add new enum values.

---

## 🐛 Troubleshooting

### Tajweed colors not showing

1. Check that `showTajweed = true`
2. Verify Arabic text has diacritics (Uthmani script)
3. Test with simple text: `إِنَّ ٱللَّهَ`

### Waqf signs not appearing

1. Ensure `waqfPositions` is not null/empty
2. Check position indices match text length
3. Verify sign enum name matches JSON

### Audio not playing

1. Confirm file exists in `assets/audio/`
2. Check `pubspec.yaml` includes assets
3. Run `flutter pub get` after changes

### Font looks wrong

1. Ensure Amiri font is downloaded and in `assets/fonts/`
2. Check `pubspec.yaml` font declaration
3. Restart app after font changes

---

## 📚 Learn More

- **Tajweed Rules**: https://www.learn-quran-tajweed.com/
- **Waqf Signs Guide**: https://www.islamicstudies.info/quran/waqf.php
- **Arabic Typography**: https://www.khaledhosny.org/typography/

---

## 🤝 Contributing

### How to Add Waqf Data

1. Open Mushaf Madani PDF
2. Find Waqf sign in verse
3. Count character position (including diacritics)
4. Add to JSON:

```json
{
  "position": 45,
  "sign": "mustStop",
  "context": "after الدين"
}
```

### Improving Tajweed Detection

The regex patterns can be improved! Submit PRs to:
- `lib/features/reader/tajweed/tajweed_engine.dart`

---

## 📄 License

MIT License - See LICENSE file

---

## 🙏 Acknowledgments

- **Quran.com** for API and data
- **Tanzil.net** for Uthmani text
- **King Fahd Quran Complex** for official Mushaf
- **Amiri Font** by Khaled Hosny

---

## 📞 Support

Need help? Open an issue with:
- Flutter/Dart version
- Device/platform
- What you're trying to do
- Error messages

**May Allah reward you for this work! 🤲**
