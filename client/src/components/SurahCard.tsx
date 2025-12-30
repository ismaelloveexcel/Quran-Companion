import { Surah } from "@/lib/quran-data";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

export default function SurahCard({ surah }: { surah: Surah }) {
  return (
    <Link href={`/read/${surah.id}`}>
      <div className="block group cursor-pointer">
        <div className="bg-card hover:bg-accent/50 border border-border/40 rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            {/* Number Badge */}
            <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary font-bold text-xl font-serif border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              {surah.id}
            </div>
            
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-foreground font-sans tracking-tight group-hover:text-primary transition-colors">
                {surah.transliteration}
              </h3>
              <p className="text-muted-foreground text-sm font-medium">
                {surah.translation} • {surah.verses} Verses
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="font-arabic text-3xl text-foreground/90">{surah.name}</span>
            <ChevronRight className="text-muted-foreground/30 group-hover:text-primary transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}
