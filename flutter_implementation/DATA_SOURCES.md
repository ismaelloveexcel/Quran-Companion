# Quran Data Sources & Integration Guide

This document explains how to get Quran data with Tajweed and Waqf signs for your Flutter app.

## Required Data

Your app needs:
1. **Arabic Text** (Uthmani script with diacritics)
2. **Translations** (English, Urdu, etc.)
3. **Transliterations** (Phonetic pronunciation)
4. **Waqf Signs** (Stopping rules positions)
5. **Metadata** (Surah names, verse counts, Juz, page numbers)

---

## Option 1: Quran.com API (Recommended)

**Free, comprehensive, and actively maintained.**

### Base URL
```
https://api.quran.com/api/v4/
```

### Key Endpoints

#### 1. Get All Surahs
```
GET https://api.quran.com/api/v4/chapters
```

Response includes:
- Surah ID, name (Arabic + transliteration)
- Verse count
- Revelation place (Meccan/Medinan)

#### 2. Get Verses with Uthmani Text
```
GET https://api.quran.com/api/v4/verses/by_chapter/1
  ?words=true
  &translations=131  (English - Sahih International)
  &fields=text_uthmani
```

#### 3. Get Word-by-Word Data
```
GET https://api.quran.com/api/v4/verses/by_chapter/1
  ?words=true
  &word_fields=text_uthmani,transliteration,translation
```

### Example Usage in Flutter

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class QuranApiService {
  static const baseUrl = 'https://api.quran.com/api/v4';

  Future<List<Surah>> fetchAllSurahs() async {
    final response = await http.get(
      Uri.parse('$baseUrl/chapters'),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return (data['chapters'] as List)
          .map((json) => Surah.fromJson(json))
          .toList();
    }
    throw Exception('Failed to load surahs');
  }

  Future<List<Ayah>> fetchSurahVerses(int surahId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/verses/by_chapter/$surahId?words=true&translations=131'),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return (data['verses'] as List)
          .map((json) => Ayah.fromJson(json))
          .toList();
    }
    throw Exception('Failed to load verses');
  }
}
```

### Limitations
- **Waqf signs NOT included** - You'll need to add these manually or use Option 2

---

## Option 2: Tanzil.net (XML with Waqf Signs)

**Includes Waqf signs but requires more processing.**

### Download Complete Quran

**Uthmani Text:**
```
http://tanzil.net/xml/uthmani
```

**Simple Text (for search):**
```
http://tanzil.net/xml/simple
```

**With Pause Marks (Waqf):**
```
http://tanzil.net/xml/uthmani?pauseMarks=true
```

### Pause Mark Symbols

Tanzil uses Unicode symbols for Waqf:
- `۞` = Section marker
- `۩` = Sajdah (prostration)
- `۝` = End of ayah marker

For detailed Waqf signs, you may need to combine with Option 3.

### Example: Parse Tanzil XML

```dart
import 'package:xml/xml.dart' as xml;

Future<void> parseTanzilXML(String xmlContent) async {
  final document = xml.XmlDocument.parse(xmlContent);

  for (final suraNode in document.findAllElements('sura')) {
    final surahId = int.parse(suraNode.getAttribute('index')!);
    final surahName = suraNode.getAttribute('name')!;

    for (final ayaNode in suraNode.findAllElements('aya')) {
      final ayahNumber = int.parse(ayaNode.getAttribute('index')!);
      final text = ayaNode.getAttribute('text')!;

      // Store in database
      print('Surah $surahId, Ayah $ayahNumber: $text');
    }
  }
}
```

---

## Option 3: Local JSON Files (Offline-First)

**Best for performance and offline access.**

### Step 1: Download Pre-Processed Data

Use these community repositories:

1. **QuranEnc Project**
   ```
   https://github.com/islamic-network/quran-json
   ```

2. **Every Ayah**
   ```
   https://everyayah.com/data/
   ```

3. **Al-Quran Cloud**
   ```
   https://alquran.cloud/api
   ```

### Step 2: Add Waqf Signs Manually

Since Waqf data is scarce, you can:

1. **Use Mushaf Madani** as reference (official Saudi Quran)
2. **Crowdsource** from Quran teachers
3. **Extract from PDF** of colored Tajweed Mushaf

### Example: Manual Waqf Annotation

```json
{
  "surah_id": 2,
  "ayah_number": 2,
  "text": "ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًۭى لِّلْمُتَّقِينَ",
  "waqf_positions": [
    {
      "position": 23,
      "sign": "pairedDots",
      "context": "after رَيْبَ"
    },
    {
      "position": 32,
      "sign": "pairedDots",
      "context": "after فِيهِ"
    }
  ]
}
```

### Waqf Sign Detection Regex

```dart
class WaqfDetector {
  static List<WaqfPosition> detectWaqfSigns(String text) {
    List<WaqfPosition> positions = [];

    // Must Stop: ۘ or م
    final mustStopPattern = RegExp(r'[\u0658]|م');

    // Do Not Stop: لا
    final doNotStopPattern = RegExp(r'لا');

    // Permissible: ج
    final permissiblePattern = RegExp(r'ج');

    // Paired dots: ۛ
    final pairedDotsPattern = RegExp(r'[\u06DB]');

    // Detect and create WaqfPosition objects
    // ... implementation ...

    return positions;
  }
}
```

---

## Option 4: Quran Complex Official Data

**Most authoritative source (Saudi Arabia).**

### King Fahd Quran Complex

Website: https://qurancomplex.gov.sa/

They provide:
- Official Uthmani script
- Tajweed rules
- Audio from top reciters
- **Mushaf Madani PDF** (has all Waqf signs)

### How to Extract

1. Download Mushaf Madani PDF
2. Use OCR or manual annotation
3. Map Waqf positions to character indices

---

## Recommended Approach

**Hybrid Strategy:**

1. **Use Quran.com API** for:
   - Arabic text (Uthmani)
   - Translations
   - Word-by-word data
   - Metadata

2. **Manually add Waqf signs** for:
   - Al-Fatiha (7 verses) - Do this first for demo
   - Top 20 most-read surahs
   - Gradually expand

3. **Store locally in SQLite** for offline access

---

## Implementation Steps

### 1. Fetch Data from API

```dart
// Fetch once and cache
final surahs = await QuranApiService().fetchAllSurahs();
final ayahs = await QuranApiService().fetchSurahVerses(1);

// Store in SQLite
await QuranDatabase.instance.insertSurahs(surahs);
await QuranDatabase.instance.insertAyahs(ayahs);
```

### 2. Add Waqf Signs Manually

Create `assets/data/waqf_data.json`:

```json
{
  "1": {
    "4": [{"position": 18, "sign": "mustStop"}],
    "5": [{"position": 35, "sign": "mustStop"}],
    "6": [{"position": 30, "sign": "doNotStop"}]
  }
}
```

Load and merge:

```dart
final waqfData = await loadWaqfData();
for (final ayah in ayahs) {
  ayah.waqfPositions = waqfData[ayah.surahId]?[ayah.number] ?? [];
}
```

### 3. Display with Colors

```dart
AyahTextWidget(
  arabicText: ayah.textUthmani,
  fontSize: 32,
  showTajweed: true,
  showWaqf: true,
  waqfPositions: ayah.waqfPositions,
)
```

---

## Audio Sources

### Verse-by-Verse Audio

**EveryAyah.com:**
```
https://everyayah.com/data/[reciter]/[surah]/[ayah].mp3
```

Example:
```
https://everyayah.com/data/Alafasy_128kbps/001001.mp3
  (Surah 1, Ayah 1 by Mishary Alafasy)
```

**Reciters Available:**
- `Alafasy_128kbps` - Mishary Rashid Alafasy
- `Abdul_Basit_Mujawwad_128kbps` - Abdul Basit
- `Husary_128kbps` - Mahmoud Khalil Al-Hussary
- `Minshawi_Murattal_128kbps` - Mohamed Siddiq Al-Minshawi

### Full Surah Audio

**Islamic Network CDN:**
```
https://cdn.islamic.network/quran/audio/128/ar.alafasy/[surah_number].mp3
```

---

## pubspec.yaml Dependencies

```yaml
dependencies:
  http: ^1.1.0           # API requests
  sqflite: ^2.3.0        # Local storage
  xml: ^6.3.0            # Parse Tanzil XML
  audioplayers: ^5.2.1   # Audio playback
```

---

## Next Steps

1. **Start small**: Implement Al-Fatiha (7 verses) with full Waqf annotations
2. **Test thoroughly**: Verify Tajweed engine accuracy
3. **Expand gradually**: Add top 20 surahs
4. **Community contribution**: Allow users to report Waqf sign errors

---

## Need Help?

Open an issue with:
- Which data source you're using
- What's not working
- Sample data

I can help with:
- API integration code
- Waqf sign positioning
- Database schema
- Data migration scripts
