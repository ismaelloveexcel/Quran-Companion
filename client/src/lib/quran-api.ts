const API_BASE = "https://api.alquran.cloud/v1";

export interface ApiSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface ApiAyah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
}

export interface SurahWithAyahs extends ApiSurah {
  ayahs: ApiAyah[];
}

export interface SurahListResponse {
  code: number;
  status: string;
  data: ApiSurah[];
}

export interface SurahDetailResponse {
  code: number;
  status: string;
  data: SurahWithAyahs[];
}

export async function getAllSurahs(): Promise<ApiSurah[]> {
  const response = await fetch(`${API_BASE}/surah`);
  const data: SurahListResponse = await response.json();
  if (data.code !== 200) {
    throw new Error("Failed to fetch surahs");
  }
  return data.data;
}

export async function getSurahWithTranslation(surahNumber: number): Promise<{
  arabic: SurahWithAyahs;
  english: SurahWithAyahs;
}> {
  const response = await fetch(
    `${API_BASE}/surah/${surahNumber}/editions/quran-uthmani,en.sahih`
  );
  const data: SurahDetailResponse = await response.json();
  if (data.code !== 200) {
    throw new Error("Failed to fetch surah");
  }
  return {
    arabic: data.data[0],
    english: data.data[1],
  };
}

export const PRONUNCIATION_TIPS: Record<string, Record<number, string>> = {
  "1": {
    1: "Pronounce 'Allah' with a heavy/thick sound (Tafkheem).",
    2: "Clear 'Ha' (ح) in 'Al-Hamd' - comes from the middle of the throat.",
    3: "Elongate the 'aa' in 'Rahmaan' for 2 counts.",
    4: "Sharp 'Da' sound in 'Deen'. Do not confuse with 'Dhaal'.",
    5: "Strong stress (Shaddah) on the 'Yaa' in 'Iyyaka'.",
    7: "Long elongation (Madd) in 'Daaalleen' (6 counts).",
  },
  "2": {
    1: "Pause briefly after each letter: Alif... Laaam... Meeem.",
    2: "Notice the three dots (ۛ)? You can stop at 'Rayb' OR 'Feeh', but not both.",
  },
  "112": {
    1: "Pronounce 'Qul' with a deep 'Q' from the back of the throat (Qalqalah letter).",
    2: "Strong emphasis on the doubled 'L' (Lam) in 'Allah'.",
    4: "Elongate the 'aa' in 'Ahad' for 2 counts. End clearly.",
  },
  "113": {
    1: "Qalqalah echo on the 'Q' in 'Falaq' when stopping.",
    5: "Clear distinction between 'Ha' (ح) in 'Hasad' - from the throat.",
  },
  "114": {
    1: "Pronounced 'Naas' with elongation (2 counts).",
    4: "Strong 'Kh' (خ) sound in 'Khannaas' - from upper throat.",
  },
};
