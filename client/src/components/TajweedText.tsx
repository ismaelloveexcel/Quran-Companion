import { useState } from 'react';
import { TajweedEngine } from '@/lib/tajweed-engine';
import { TAJWEED_RULES, TajweedRule } from '@/lib/tajweed-rules';
import { WaqfPosition, WAQF_SIGNS } from '@/lib/waqf-signs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface TajweedTextProps {
  arabicText: string;
  fontSize?: number;
  showTajweed?: boolean;
  showWaqf?: boolean;
  waqfPositions?: WaqfPosition[];
}

export default function TajweedText({
  arabicText,
  fontSize = 32,
  showTajweed = true,
  showWaqf = true,
  waqfPositions = [],
}: TajweedTextProps) {
  const [selectedRule, setSelectedRule] = useState<TajweedRule | null>(null);
  const [selectedWaqf, setSelectedWaqf] = useState<WaqfPosition | null>(null);

  // Detect Tajweed spans
  const engine = new TajweedEngine();
  const tajweedSpans = showTajweed ? engine.analyze(arabicText) : [];

  // Build text segments with colors
  const segments: JSX.Element[] = [];
  let currentPos = 0;

  // Create a map of character positions to spans
  const spanMap = new Map<number, typeof tajweedSpans[0]>();
  tajweedSpans.forEach(span => {
    for (let i = span.start; i < span.end; i++) {
      spanMap.set(i, span);
    }
  });

  // Build segments
  while (currentPos < arabicText.length) {
    const span = spanMap.get(currentPos);

    if (span) {
      // Tajweed colored text
      const rule = TAJWEED_RULES[span.rule];
      segments.push(
        <span
          key={`tajweed-${currentPos}`}
          className="cursor-pointer px-0.5 rounded transition-all hover:opacity-80"
          style={{
            backgroundColor: rule.backgroundColor,
            borderBottom: `2px solid ${rule.color}`,
          }}
          onClick={() => setSelectedRule(span.rule)}
          title={`Click to learn about ${rule.name}`}
        >
          {span.text}
        </span>
      );
      currentPos = span.end;
    } else {
      // Regular text
      let nextTajweedPos = arabicText.length;
      for (const pos of spanMap.keys()) {
        if (pos > currentPos && pos < nextTajweedPos) {
          nextTajweedPos = pos;
        }
      }

      const regularText = arabicText.substring(currentPos, nextTajweedPos);

      // Check for Waqf signs in this segment
      if (showWaqf) {
        const segmentWithWaqf = insertWaqfSigns(
          regularText,
          currentPos,
          waqfPositions,
          setSelectedWaqf
        );
        segments.push(
          <span key={`regular-${currentPos}`}>{segmentWithWaqf}</span>
        );
      } else {
        segments.push(<span key={`regular-${currentPos}`}>{regularText}</span>);
      }

      currentPos = nextTajweedPos;
    }
  }

  return (
    <>
      <div
        className="font-arabic text-right leading-loose select-text"
        style={{ fontSize: `${fontSize}px`, lineHeight: 2.2 }}
        dir="rtl"
      >
        {segments}
      </div>

      {/* Tajweed Explainer Dialog */}
      {selectedRule && (
        <TajweedExplainerDialog
          rule={selectedRule}
          onClose={() => setSelectedRule(null)}
        />
      )}

      {/* Waqf Explainer Dialog */}
      {selectedWaqf && (
        <WaqfExplainerDialog
          waqfPosition={selectedWaqf}
          onClose={() => setSelectedWaqf(null)}
        />
      )}
    </>
  );
}

// Helper: Insert Waqf signs into text
function insertWaqfSigns(
  text: string,
  basePosition: number,
  waqfPositions: WaqfPosition[],
  onClick: (waqf: WaqfPosition) => void
): (string | JSX.Element)[] {
  const segments: (string | JSX.Element)[] = [];
  let currentPos = 0;

  waqfPositions.forEach((waqfPos, index) => {
    const relativePos = waqfPos.position - basePosition;

    if (relativePos >= 0 && relativePos <= text.length) {
      // Add text before Waqf
      if (currentPos < relativePos) {
        segments.push(text.substring(currentPos, relativePos));
      }

      // Add Waqf indicator
      const waqfInfo = WAQF_SIGNS[waqfPos.sign];
      segments.push(
        <span
          key={`waqf-${index}`}
          className="inline-flex items-center justify-center mx-1 px-2 py-1 rounded-lg cursor-pointer transition-all hover:scale-110 border-2"
          style={{
            backgroundColor: waqfInfo.backgroundColor,
            borderColor: waqfInfo.color,
            color: waqfInfo.color,
          }}
          onClick={() => onClick(waqfPos)}
          title={`Click to learn: ${waqfInfo.action}`}
        >
          <span className="font-arabic text-lg font-bold">
            {waqfInfo.symbol}
          </span>
        </span>
      );

      currentPos = relativePos;
    }
  });

  // Add remaining text
  if (currentPos < text.length) {
    segments.push(text.substring(currentPos));
  }

  return segments.length > 0 ? segments : [text];
}

// Tajweed Explainer Dialog Component
function TajweedExplainerDialog({
  rule,
  onClose,
}: {
  rule: TajweedRule;
  onClose: () => void;
}) {
  const ruleInfo = TAJWEED_RULES[rule];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: ruleInfo.color }}
            />
            <div>
              <DialogTitle className="text-2xl">{ruleInfo.name}</DialogTitle>
              <p
                className="text-3xl font-arabic mt-1"
                style={{ direction: 'rtl' }}
              >
                {ruleInfo.arabicName}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Explanation */}
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="text-xl">ℹ️</span> What is it?
            </h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="leading-relaxed">{ruleInfo.explanation}</p>
            </div>
          </div>

          {/* How to Apply */}
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="text-xl">📚</span> How to apply
            </h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="leading-relaxed">{ruleInfo.howToApply}</p>
            </div>
          </div>

          {/* Examples */}
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="text-xl">📖</span> Examples from Quran
            </h3>
            <div className="space-y-2">
              {ruleInfo.examples.map((example, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border-2 text-center"
                  style={{
                    backgroundColor: ruleInfo.backgroundColor,
                    borderColor: ruleInfo.color,
                  }}
                >
                  <p
                    className="text-4xl font-arabic"
                    style={{ direction: 'rtl' }}
                  >
                    {example}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100 flex items-start gap-2">
              <span className="text-lg">💡</span>
              <span>
                Tap any colored text while reading to see this explanation
              </span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Waqf Explainer Dialog Component
function WaqfExplainerDialog({
  waqfPosition,
  onClose,
}: {
  waqfPosition: WaqfPosition;
  onClose: () => void;
}) {
  const waqfInfo = WAQF_SIGNS[waqfPosition.sign];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-4"
              style={{
                backgroundColor: waqfInfo.color,
                borderColor: waqfInfo.backgroundColor,
              }}
            >
              <span className="text-4xl font-arabic text-white font-bold">
                {waqfInfo.symbol}
              </span>
            </div>
            <div>
              <DialogTitle className="text-xl">{waqfInfo.name}</DialogTitle>
              <p
                className="text-3xl font-arabic mt-1"
                style={{ direction: 'rtl' }}
              >
                {waqfInfo.arabicName}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Action */}
          <div
            className="p-6 rounded-xl text-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${waqfInfo.color}, ${waqfInfo.color}dd)`,
            }}
          >
            <p className="text-3xl font-bold text-white tracking-wide">
              {waqfInfo.action}
            </p>
          </div>

          {/* Explanation */}
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="text-xl">ℹ️</span> What does this mean?
            </h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="leading-relaxed">{waqfInfo.explanation}</p>
            </div>
          </div>

          {/* Priority */}
          <div
            className="p-4 rounded-lg border-2"
            style={{
              backgroundColor: waqfInfo.backgroundColor,
              borderColor: waqfInfo.color,
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">⚠️</span>
              <span className="font-bold" style={{ color: waqfInfo.color }}>
                Priority:{' '}
                {waqfInfo.priority === 5
                  ? 'MUST FOLLOW'
                  : waqfInfo.priority >= 3
                    ? 'RECOMMENDED'
                    : 'OPTIONAL'}
              </span>
            </div>
          </div>

          {/* Tip */}
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100 flex items-start gap-2">
              <span className="text-lg">💡</span>
              <span>
                Tap Waqf signs while reading to see this explanation
              </span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
