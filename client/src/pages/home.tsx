import Layout from "@/components/layout";
import SurahCard from "@/components/SurahCard";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getAllSurahs, ApiSurah } from "@/lib/quran-api";
import { Loader2, BookOpen, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { loadLastRead, LastReadData } from "@/lib/storage";

export default function Home() {
  const greeting = getGreeting();
  const [lastRead, setLastRead] = useState<LastReadData | null>(null);

  useEffect(() => {
    setLastRead(loadLastRead());
  }, []);

  const { data: surahs, isLoading, error } = useQuery<ApiSurah[]>({
    queryKey: ["surahs"],
    queryFn: getAllSurahs,
    staleTime: Infinity,
  });

  return (
    <Layout>
      <div className="px-6 py-10 space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <p className="text-primary font-medium text-lg font-serif italic opacity-80">{greeting}</p>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            Read Quran
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-xs">
            Assalamu Alaykum. Choose a Surah to begin reading.
          </p>
        </div>

        {/* Continue Reading Card */}
        {lastRead && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link href={`/read/${lastRead.surahNumber}`}>
              <div 
                className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-5 cursor-pointer hover:bg-primary/15 transition-all shadow-sm hover:shadow-md group"
                data-testid="continue-reading-card"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <BookOpen className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">Continue Reading</p>
                    <h3 className="text-lg font-bold text-foreground">{lastRead.surahName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {lastRead.totalVerses} verses • Last read {getTimeAgo(lastRead.timestamp)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-arabic text-2xl text-foreground/80">{lastRead.surahNameArabic}</span>
                    <ChevronRight className="text-muted-foreground/50 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Surah List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground/80 px-1">
            All Surahs <span className="text-sm font-normal text-muted-foreground">(114 Chapters)</span>
          </h2>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading the Holy Quran...</p>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center">
              <p className="text-destructive font-medium">Unable to load Quran data. Please check your internet connection and try again.</p>
            </div>
          )}

          {surahs && (
            <div className="space-y-3 pb-8">
              {surahs.map((surah, index) => (
                <motion.div
                  key={surah.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.02, 0.5), duration: 0.3 }}
                >
                  <SurahCard surah={surah} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(timestamp).toLocaleDateString();
}
