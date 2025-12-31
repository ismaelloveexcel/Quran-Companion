import { useState } from 'react';
import { TAJWEED_RULES, TajweedRule } from '@/lib/tajweed-rules';
import { WAQF_SIGNS, WaqfSign } from '@/lib/waqf-signs';
import { Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function ColorLegend() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Info size={16} />
          <span className="hidden sm:inline">Color Guide</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <span className="text-2xl">🎨</span> Color Guide
          </DialogTitle>
        </DialogHeader>

        <Accordion type="multiple" defaultValue={['tajweed', 'waqf']} className="w-full">
          {/* Tajweed Rules */}
          <AccordionItem value="tajweed">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <span className="text-xl">🗣️</span>
                Pronunciation Rules (Tajweed)
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 mt-2">
                {Object.entries(TAJWEED_RULES).map(([key, rule]) => (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-3 rounded-lg border-2 transition-all hover:shadow-md cursor-pointer"
                    style={{
                      backgroundColor: rule.backgroundColor,
                      borderColor: rule.color,
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex-shrink-0 shadow-md"
                      style={{ backgroundColor: rule.color }}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{rule.name}</p>
                      <p
                        className="text-xl font-arabic"
                        style={{ direction: 'rtl' }}
                      >
                        {rule.arabicName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Waqf Signs */}
          <AccordionItem value="waqf">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <span className="text-xl">⏸️</span>
                Stopping Rules (Waqf)
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 mt-2">
                {Object.entries(WAQF_SIGNS).map(([key, sign]) => (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-3 rounded-lg border-2 transition-all hover:shadow-md cursor-pointer"
                    style={{
                      backgroundColor: sign.backgroundColor,
                      borderColor: sign.color,
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center shadow-md border-2"
                      style={{
                        backgroundColor: sign.color,
                        borderColor: sign.backgroundColor,
                      }}
                    >
                      <span className="text-2xl font-arabic text-white font-bold">
                        {sign.symbol}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{sign.name}</p>
                      <p
                        className="font-bold text-sm"
                        style={{ color: sign.color }}
                      >
                        {sign.action}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Help text */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100 flex items-start gap-2">
            <span className="text-lg">💡</span>
            <span className="leading-relaxed">
              <strong>How to use:</strong> When reading, tap on any colored text
              to learn about that Tajweed rule, or tap on Waqf signs (ۘ ج لا) to
              understand stopping rules. This helps you recite correctly!
            </span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Compact version for inline display
export function CompactColorLegend() {
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4">
      <h3 className="font-bold text-lg flex items-center gap-2">
        <span>🎨</span> Quick Color Guide
      </h3>

      {/* Tajweed */}
      <div>
        <p className="text-sm font-semibold mb-2 text-muted-foreground">
          Pronunciation Colors:
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(TAJWEED_RULES).map(([key, rule]) => (
            <div
              key={key}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs border"
              style={{
                backgroundColor: rule.backgroundColor,
                borderColor: rule.color,
              }}
            >
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: rule.color }}
              />
              <span className="font-semibold">{rule.name.split('(')[0].trim()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Waqf */}
      <div>
        <p className="text-sm font-semibold mb-2 text-muted-foreground">
          Stopping Signs:
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(WAQF_SIGNS).map(([key, sign]) => (
            <div
              key={key}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs border"
              style={{
                backgroundColor: sign.backgroundColor,
                borderColor: sign.color,
              }}
            >
              <span
                className="font-arabic font-bold"
                style={{ color: sign.color }}
              >
                {sign.symbol}
              </span>
              <span className="font-semibold text-xs">{sign.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
