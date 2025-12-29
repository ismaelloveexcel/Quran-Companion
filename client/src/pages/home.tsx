import Layout from "@/components/layout";
import { SURAHS } from "@/lib/quran-data";
import SurahCard from "@/components/SurahCard";
import { motion } from "framer-motion";

export default function Home() {
  const greeting = getGreeting();

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

        {/* Featured / Continue Reading could go here */}

        {/* Surah List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground/80 px-1">All Surahs</h2>
          <div className="space-y-3 pb-8">
            {SURAHS.map((surah, index) => (
              <motion.div
                key={surah.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <SurahCard surah={surah} />
              </motion.div>
            ))}
          </div>
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
