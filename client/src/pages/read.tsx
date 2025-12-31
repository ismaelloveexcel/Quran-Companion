import { useParams, Link } from "wouter";
import { ArrowLeft, Minus, Plus, Play, Pause, Lightbulb, Loader2, Share2, Check } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import TajweedGuide from "@/components/TajweedGuide";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getSurahWithTranslation, PRONUNCIATION_TIPS } from "@/lib/quran-api";
import ColorCodedVerse, { StopMarksLegend } from "@/components/ColorCodedVerse";
import { 
  saveFontSize, 
  loadFontSize, 
  saveLastRead, 
  saveShowTips, 
  loadShowTips, 
  saveShowLegend, 
  loadShowLegend 
} from "@/lib/storage";

export default function Read() {
  const { id } = useParams();
  const surahNumber = parseInt(id || "1");
  const [fontSize, setFontSize] = useState(() => loadFontSize(32));
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTips, setShowTips] = useState(() => loadShowTips(true));
  const [showLegend, setShowLegend] = useState(() => loadShowLegend(true));
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["surah", surahNumber],
    queryFn: () => getSurahWithTranslation(surahNumber),
    staleTime: Infinity,
  });

  // Persist font size changes
  useEffect(() => {
    saveFontSize(fontSize);
  }, [fontSize]);

  // Persist show tips preference
  useEffect(() => {
    saveShowTips(showTips);
  }, [showTips]);

  // Persist show legend preference
  useEffect(() => {
    saveShowLegend(showLegend);
  }, [showLegend]);

  // Save last read position when data is loaded
  useEffect(() => {
    if (data) {
      saveLastRead({
        surahNumber: data.arabic.number,
        surahName: data.arabic.englishName,
        surahNameArabic: data.arabic.name,
        verseNumber: 1,
        totalVerses: data.arabic.numberOfAyahs,
        timestamp: Date.now(),
      });
    }
  }, [data]);

  // Share/copy verse handler
  const handleShareVerse = useCallback(async (verseNumber: number, arabicText: string, translation: string, surahName: string) => {
    const shareText = `${arabicText}\n\n"${translation}"\n\n— ${surahName}, Verse ${verseNumber}`;
    
    // Try Web Share API first (mobile-friendly)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${surahName} - Verse ${verseNumber}`,
          text: shareText,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fall back to clipboard
      }
    }
    
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedVerse(verseNumber);
      setTimeout(() => setCopiedVerse(null), 2000);
    } catch (err) {
      console.warn('Failed to copy to clipboard:', err);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground text-lg">Loading Surah...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-8 text-center max-w-md">
          <p className="text-destructive font-medium mb-4">Unable to load this Surah. Please check your connection.</p>
          <Link href="/">
            <Button variant="outline">Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { arabic, english } = data;
  const tips = PRONUNCIATION_TIPS[surahNumber.toString()] || {};

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-40">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40 px-4 py-4 flex items-center justify-between shadow-sm">
        <Link href="/">
          <div className="p-2 -ml-2 rounded-full hover:bg-muted text-foreground transition-colors flex items-center gap-2 group cursor-pointer" data-testid="button-back">
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </div>
        </Link>
        <div className="text-center">
          <h1 className="font-bold text-lg">{arabic.englishName}</h1>
          <p className="text-xs text-muted-foreground">{arabic.englishNameTranslation}</p>
        </div>
        <div className="w-auto">
          <TajweedGuide />
        </div>
      </div>

      {/* Font Controls + Progress */}
      <div className="sticky top-[73px] z-40 bg-card/95 backdrop-blur border-b border-border/40 px-6 py-3 flex flex-col gap-2 shadow-sm">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{arabic.numberOfAyahs} Verses</span>
          <span>{arabic.revelationType}</span>
        </div>
        
        {/* Controls Row */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button 
            onClick={() => setFontSize(Math.max(24, fontSize - 4))}
            className="p-3 rounded-full hover:bg-muted active:scale-95 transition-all text-muted-foreground hover:text-foreground"
            aria-label="Decrease font size"
            data-testid="button-font-decrease"
          >
            <Minus size={20} />
          </button>
          <span className="text-sm font-medium text-muted-foreground min-w-[3ch] text-center">Aa</span>
          <button 
            onClick={() => setFontSize(Math.min(64, fontSize + 4))}
            className="p-3 rounded-full hover:bg-muted active:scale-95 transition-all text-primary"
            aria-label="Increase font size"
            data-testid="button-font-increase"
          >
            <Plus size={24} />
          </button>
          
          <div className="w-px h-6 bg-border mx-1" />
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowTips(!showTips)}
            className={cn("rounded-full", showTips ? "bg-accent text-accent-foreground" : "text-muted-foreground")}
            title="Toggle Pronunciation Tips"
            data-testid="button-toggle-tips"
          >
            <Lightbulb size={20} />
          </Button>

          <Button 
            variant={showLegend ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setShowLegend(!showLegend)}
            className="rounded-full text-xs gap-1"
            title="Toggle Color Legend"
            data-testid="button-toggle-legend"
          >
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500"></span>
            Legend
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        {/* Color Legend - Collapsible */}
        <AnimatePresence>
          {showLegend && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <StopMarksLegend />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bismillah - Skip for Surah 1 (Al-Fatiha) and Surah 9 (At-Tawbah) */}
        {surahNumber !== 1 && surahNumber !== 9 && (
          <div className="text-center py-8 mb-4 font-arabic text-4xl text-primary/80">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </div>
        )}

        <div className="space-y-10">
          {arabic.ayahs.map((ayah, index) => {
            const tip = tips[ayah.numberInSurah];
            const translation = english.ayahs[index]?.text || "";

            return (
              <motion.div 
                key={ayah.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5 }}
                className="group space-y-6"
                data-testid={`ayah-${ayah.numberInSurah}`}
              >
                <div className="flex flex-col gap-6">
                  {/* Arabic Text with Color-Coded Stopping Marks */}
                  <ColorCodedVerse 
                    text={ayah.text} 
                    fontSize={fontSize} 
                    verseNumber={ayah.numberInSurah} 
                  />

                  {/* Pronunciation Tip */}
                  <AnimatePresence>
                    {showTips && tip && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-accent/30 border border-accent rounded-lg p-3 flex items-start gap-3"
                      >
                        <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-foreground/80 font-medium">
                          {tip}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Translation with Share Button */}
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-lg text-muted-foreground leading-relaxed flex-1">
                      {translation}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity rounded-full h-9 w-9"
                      onClick={() => handleShareVerse(ayah.numberInSurah, ayah.text, translation, arabic.englishName)}
                      title={copiedVerse === ayah.numberInSurah ? "Copied!" : "Share verse"}
                      data-testid={`share-verse-${ayah.numberInSurah}`}
                    >
                      {copiedVerse === ayah.numberInSurah ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                {index !== arabic.ayahs.length - 1 && (
                  <div className="h-px w-full bg-border/40" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Audio Player Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-card border-t border-border p-4 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="font-semibold text-sm truncate">{arabic.englishName}</p>
            <p className="text-xs text-muted-foreground">Mishary Alafasy</p>
          </div>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg active:scale-95 transition-transform hover:bg-primary/90"
            data-testid="button-play"
          >
            {isPlaying ? <Pause className="fill-current" /> : <Play className="fill-current ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );
}
