import Layout from "@/components/layout";
import SurahCard from "@/components/SurahCard";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getAllSurahs, ApiSurah } from "@/lib/quran-api";
import { Loader2 } from "lucide-react";

export default function Home() {
  const greeting = getGreeting();

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
