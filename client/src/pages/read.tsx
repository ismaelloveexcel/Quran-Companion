import { useParams, Link } from "wouter";
import { SURAHS } from "@/lib/quran-data";
import { ArrowLeft, Minus, Plus, Play, Pause, Lightbulb } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import TajweedGuide from "@/components/TajweedGuide";
import ColorLegend, { CompactColorLegend } from "@/components/ColorLegend";
import TajweedText from "@/components/TajweedText";
import { Button } from "@/components/ui/button";

export default function Read() {
  const { id } = useParams();
  const surahId = parseInt(id || "1");
  const surah = SURAHS.find((s) => s.id === surahId);
  const [fontSize, setFontSize] = useState(32); // Default large font size
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTips, setShowTips] = useState(true);

  if (!surah) return <div className="p-10 text-center">Surah not found</div>;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-40">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40 px-4 py-4 flex items-center justify-between shadow-sm">
        <Link href="/">
          <div className="p-2 -ml-2 rounded-full hover:bg-muted text-foreground transition-colors flex items-center gap-2 group cursor-pointer">
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </div>
        </Link>
        <div className="text-center">
          <h1 className="font-bold text-lg">{surah.transliteration}</h1>
          <p className="text-xs text-muted-foreground">{surah.translation}</p>
        </div>
        <div className="w-auto flex gap-2">
             <ColorLegend />
             <TajweedGuide />
        </div>
      </div>

      {/* Font Controls - Fixed or Floating */}
      <div className="sticky top-[73px] z-40 bg-card/95 backdrop-blur border-b border-border/40 px-6 py-3 flex items-center justify-center gap-6 shadow-sm">
        <button 
          onClick={() => setFontSize(Math.max(24, fontSize - 4))}
          className="p-3 rounded-full hover:bg-muted active:scale-95 transition-all text-muted-foreground hover:text-foreground"
          aria-label="Decrease font size"
        >
          <Minus size={20} />
        </button>
        <span className="text-sm font-medium text-muted-foreground min-w-[3ch] text-center">Aa</span>
        <button 
          onClick={() => setFontSize(Math.min(64, fontSize + 4))}
          className="p-3 rounded-full hover:bg-muted active:scale-95 transition-all text-primary"
          aria-label="Increase font size"
        >
          <Plus size={24} />
        </button>
        
        <div className="w-px h-6 bg-border mx-2" />
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setShowTips(!showTips)}
          className={cn("rounded-full", showTips ? "bg-accent text-accent-foreground" : "text-muted-foreground")}
          title="Toggle Pronunciation Tips"
        >
          <Lightbulb size={20} />
        </Button>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-12">
        {/* Bismillah */}
        {surah.id !== 1 && surah.id !== 9 && (
          <div className="text-center py-8 mb-4 font-arabic text-4xl text-primary/80">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </div>
        )}

        <div className="space-y-10">
          {surah.content.map((ayah, index) => (
            <motion.div 
              key={ayah.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5 }}
              className="group space-y-6"
            >
              <div className="flex flex-col gap-6">
                {/* Arabic Text with Tajweed Colors & Waqf Signs */}
                <div className="flex items-start gap-3">
                  <TajweedText
                    arabicText={ayah.text}
                    fontSize={fontSize}
                    showTajweed={true}
                    showWaqf={true}
                    waqfPositions={ayah.waqfPositions}
                  />
                  <span className="inline-flex items-center justify-center min-w-[2.5rem] h-10 border-2 border-primary/20 rounded-full text-sm text-primary font-sans font-bold shrink-0">
                    {ayah.number}
                  </span>
                </div>

                {/* Pronunciation Tip - Contextual Guide */}
                <AnimatePresence>
                  {showTips && ayah.pronunciationTip && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-accent/30 border border-accent rounded-lg p-3 flex items-start gap-3"
                    >
                      <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground/80 font-medium">
                        {ayah.pronunciationTip}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Translation */}
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {ayah.translation}
                </p>
              </div>
              
              {index !== surah.content.length - 1 && (
                <div className="h-px w-full bg-border/40" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Audio Player Bar - Always visible at bottom */}
      <div className="fixed bottom-0 inset-x-0 bg-card border-t border-border p-4 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="font-semibold text-sm truncate">{surah.transliteration}</p>
            <p className="text-xs text-muted-foreground">Mishary Alafasy</p>
          </div>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg active:scale-95 transition-transform hover:bg-primary/90"
          >
            {isPlaying ? <Pause className="fill-current" /> : <Play className="fill-current ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );
}
