import { useParams, Link } from "wouter";
import { SURAHS } from "@/lib/quran-data";
import { ArrowLeft, Minus, Plus, Play, Pause } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Read() {
  const { id } = useParams();
  const surahId = parseInt(id || "1");
  const surah = SURAHS.find((s) => s.id === surahId);
  const [fontSize, setFontSize] = useState(32); // Default large font size
  const [isPlaying, setIsPlaying] = useState(false);

  if (!surah) return <div className="p-10 text-center">Surah not found</div>;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-40">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40 px-4 py-4 flex items-center justify-between shadow-sm">
        <Link href="/">
          <a className="p-2 -ml-2 rounded-full hover:bg-muted text-foreground transition-colors flex items-center gap-2 group">
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </a>
        </Link>
        <div className="text-center">
          <h1 className="font-bold text-lg">{surah.transliteration}</h1>
          <p className="text-xs text-muted-foreground">{surah.translation}</p>
        </div>
        <div className="w-20" /> {/* Spacer for centering */}
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
                {/* Arabic Text */}
                <p 
                  className="text-right leading-[2.2] text-foreground font-arabic"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {ayah.text} 
                  <span className="inline-flex items-center justify-center w-[1em] h-[1em] mx-2 border-2 border-primary/20 rounded-full text-[0.4em] align-middle text-primary font-sans font-bold">
                    {ayah.number}
                  </span>
                </p>

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
