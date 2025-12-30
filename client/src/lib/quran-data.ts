export interface Surah {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  verses: number;
  type: "Meccan" | "Medinan";
  content: Ayah[];
}

export interface Ayah {
  number: number;
  text: string;
  translation: string;
  pronunciationTip?: string;
}

export const SURAHS: Surah[] = [
  {
    id: 1,
    name: "الفاتحة",
    transliteration: "Al-Fatiha",
    translation: "The Opening",
    verses: 7,
    type: "Meccan",
    content: [
      { 
        number: 1, 
        text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ", 
        translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
        pronunciationTip: "Pronounce 'Allah' with a heavy/thick sound (Tafkheem)."
      },
      { 
        number: 2, 
        text: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ", 
        translation: "[All] praise is [due] to Allah, Lord of the worlds -",
        pronunciationTip: "Clear 'Ha' (ح) in 'Al-Hamd' - comes from the middle of the throat."
      },
      { 
        number: 3, 
        text: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ", 
        translation: "The Entirely Merciful, the Especially Merciful,",
        pronunciationTip: "Elongate the 'aa' in 'Rahmaan' for 2 counts."
      },
      { 
        number: 4, 
        text: "مَـٰلِكِ يَوْمِ ٱلدِّينِ", 
        translation: "Sovereign of the Day of Recompense.",
        pronunciationTip: "Sharp 'Da' sound in 'Deen'. Do not confuse with 'Dhaal'."
      },
      { 
        number: 5, 
        text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", 
        translation: "It is You we worship and You we ask for help.",
        pronunciationTip: "Strong stress (Shaddah) on the 'Yaa' in 'Iyyaka'."
      },
      { 
        number: 6, 
        text: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ", 
        translation: "Guide us to the straight path -"
      },
      { 
        number: 7, 
        text: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ", 
        translation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
        pronunciationTip: "Long elongation (Madd) in 'Daaalleen' (6 counts)."
      },
    ]
  },
  {
    id: 2,
    name: "البقرة",
    transliteration: "Al-Baqarah",
    translation: "The Cow",
    verses: 286,
    type: "Medinan",
    content: [
      { number: 1, text: "الٓمٓ", translation: "Alif, Lam, Meem.", pronunciationTip: "Pause briefly after each letter: Alif... Laaam... Meeem." },
      { number: 2, text: "ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًۭى لِّلْمُتَّقِينَ", translation: "This is the Book about which there is no doubt, a guidance for those conscious of Allah -", pronunciationTip: "Notice the three dots (ۛ)? You can stop at 'Rayb' OR 'Feeh', but not both." },
      { number: 3, text: "ٱلَّذِينَ يُؤْمِنُونَ بِٱلْغَيْبِ وَيُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا رَزَقْنَـٰهُمْ يُنفِقُونَ", translation: "Who believe in the unseen, establish prayer, and spend out of what We have provided for them," },
      { number: 4, text: "وَٱلَّذِينَ يُؤْمِنُونَ بِمَآ أُنزِلَ إِلَيْكَ وَمَآ أُنزِلَ مِن قَبْلِكَ وَبِٱلْـَٔاخِرَةِ هُمْ يُوقِنُونَ", translation: "And who believe in what has been revealed to you, and what was revealed before you, and of the Hereafter they are certain." },
      { number: 5, text: "أُو۟لَـٰٓئِكَ عَلَىٰ هُدًۭى مِّن رَّبِّهِمْ ۖ وَأُو۟لَـٰٓئِكَ هُمُ ٱلْمُفْلِحُونَ", translation: "Those are upon [right] guidance from their Lord, and it is those who are the successful." }
    ]
  },
  {
    id: 18,
    name: "الكهف",
    transliteration: "Al-Kahf",
    translation: "The Cave",
    verses: 110,
    type: "Meccan",
    content: [
      { number: 1, text: "ٱلْحَمْدُ لِلَّهِ ٱلَّذِىٓ أَنزَلَ عَلَىٰ عَبْدِهِ ٱلْكِتَـٰبَ وَلَمْ يَجْعَل لَّهُۥ عِوَجَا ۜ", translation: "[All] praise is [due] to Allah, who has sent down upon His Servant the Book and has not made therein any deviance." },
      { number: 2, text: "قَيِّمًۭا لِّيُنذِرَ بَأْسًۭا شَدِيدًۭا مِّن لَّدُنْهُ وَيُبَشِّرَ ٱلْمُؤْمِنِينَ ٱلَّذِينَ يَعْمَلُونَ ٱلصَّـٰلِحَـٰتِ أَنَّ لَهُمْ أَجْرًا حَسَنًۭا", translation: "[He has made it] straight, to warn of severe punishment from Him and to give good tidings to the believers who do righteous deeds that they will have a good reward," }
    ]
  },
  {
    id: 36,
    name: "يس",
    transliteration: "Ya-Sin",
    translation: "Ya Sin",
    verses: 83,
    type: "Meccan",
    content: [
      { number: 1, text: "يسٓ", translation: "Ya, Seen." },
      { number: 2, text: "وَٱلْقُرْءَانِ ٱلْحَكِيمِ", translation: "By the wise Qur'an." },
      { number: 3, text: "إِنَّكَ لَمِنَ ٱلْمُرْسَلِينَ", translation: "Indeed you, [O Muhammad], are from among the messengers," }
    ]
  },
  {
    id: 67,
    name: "الملك",
    transliteration: "Al-Mulk",
    translation: "The Sovereignty",
    verses: 30,
    type: "Meccan",
    content: [
      { number: 1, text: "تَبَـٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌ", translation: "Blessed is He in whose hand is dominion, and He is over all things competent -" },
      { number: 2, text: "ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًۭا ۚ وَهُوَ ٱلْعَزِيزُ ٱلْغَفُورُ", translation: "[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -" }
    ]
  }
];
