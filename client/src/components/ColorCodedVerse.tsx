import { cn } from "@/lib/utils";

interface ColorCodedVerseProps {
  text: string;
  fontSize: number;
  verseNumber: number;
}

const STOP_MARKS = [
  { symbol: "ۘ", name: "Must Stop", color: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30", description: "Compulsory" },
  { symbol: "مـ", name: "Must Stop", color: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30", description: "Compulsory" },
  { symbol: "لا", name: "Don't Stop", color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30", description: "Continue" },
  { symbol: "ج", name: "Optional", color: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30", description: "Can stop" },
  { symbol: "صل", name: "Better Continue", color: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30", description: "Keep going" },
  { symbol: "صلى", name: "Better Continue", color: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30", description: "Keep going" },
  { symbol: "قلى", name: "Better Stop", color: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30", description: "Pause here" },
  { symbol: "ۛ", name: "Choose One", color: "text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30", description: "Pick one" },
  { symbol: "ۖ", name: "Can Stop", color: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30", description: "Optional" },
  { symbol: "ۗ", name: "Can Stop", color: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30", description: "Optional" },
  { symbol: "ۚ", name: "Better Stop", color: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30", description: "Pause here" },
  { symbol: "ۙ", name: "Don't Stop", color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30", description: "Continue" },
];

function getMarkStyle(symbol: string): { color: string; name: string } | null {
  const mark = STOP_MARKS.find(m => m.symbol === symbol);
  return mark ? { color: mark.color, name: mark.name } : null;
}

export default function ColorCodedVerse({ text, fontSize, verseNumber }: ColorCodedVerseProps) {
  const parts: React.ReactNode[] = [];
  let currentText = text;
  let key = 0;

  const allSymbols = STOP_MARKS.map(m => m.symbol).sort((a, b) => b.length - a.length);
  const symbolRegex = new RegExp(`(${allSymbols.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');

  const segments = currentText.split(symbolRegex);

  segments.forEach((segment, index) => {
    if (!segment) return;
    
    const markStyle = getMarkStyle(segment);
    if (markStyle) {
      parts.push(
        <span 
          key={key++}
          className={cn(
            "inline-flex items-center justify-center px-1.5 py-0.5 mx-1 rounded-md font-bold text-[0.7em] align-middle cursor-help transition-transform hover:scale-110",
            markStyle.color
          )}
          title={markStyle.name}
        >
          {segment}
        </span>
      );
    } else {
      parts.push(<span key={key++}>{segment}</span>);
    }
  });

  return (
    <p 
      className="text-right leading-[2.2] text-foreground font-arabic"
      style={{ fontSize: `${fontSize}px` }}
      dir="rtl"
    >
      {parts}
      <span className="inline-flex items-center justify-center w-[1em] h-[1em] mx-2 border-2 border-primary/20 rounded-full text-[0.4em] align-middle text-primary font-sans font-bold">
        {verseNumber}
      </span>
    </p>
  );
}

export function StopMarksLegend() {
  const legendItems = [
    { symbol: "مـ", name: "Must Stop", color: "bg-red-500", textColor: "text-red-600 dark:text-red-400" },
    { symbol: "لا", name: "Don't Stop", color: "bg-blue-500", textColor: "text-blue-600 dark:text-blue-400" },
    { symbol: "ج", name: "Optional", color: "bg-amber-500", textColor: "text-amber-600 dark:text-amber-400" },
    { symbol: "صل", name: "Continue", color: "bg-green-500", textColor: "text-green-600 dark:text-green-400" },
    { symbol: "قلى", name: "Better Stop", color: "bg-purple-500", textColor: "text-purple-600 dark:text-purple-400" },
  ];

  return (
    <div className="bg-card/80 backdrop-blur border border-border/50 rounded-xl p-4 shadow-sm">
      <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500"></span>
        Stopping Guide
      </h4>
      <div className="flex flex-wrap gap-3">
        {legendItems.map((item) => (
          <div key={item.symbol} className="flex items-center gap-2">
            <span className={cn("w-2.5 h-2.5 rounded-full", item.color)}></span>
            <span className={cn("font-arabic text-lg", item.textColor)}>{item.symbol}</span>
            <span className="text-xs text-muted-foreground">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
