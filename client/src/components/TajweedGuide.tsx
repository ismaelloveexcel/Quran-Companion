import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Info, Volume2, MoveUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TajweedGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 rounded-full border-primary/20 text-primary hover:bg-primary/5 hover:text-primary">
          <Info size={16} />
          <span className="hidden sm:inline">Pronunciation Guide</span>
          <span className="sm:hidden">Guide</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-primary">Pronunciation Guide</DialogTitle>
          <DialogDescription>
            Simple rules to help you recite correctly.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <GuideItem 
            icon={<AlertCircle className="text-orange-500" />}
            title="Heavy Letters (Tafkheem)"
            description="These letters fill the mouth with a heavy sound."
            example="خ ص ض غ ط ق ظ"
            arabicExample="خَالِدِينَ"
          />
          
          <GuideItem 
            icon={<MoveUp className="text-blue-500" />}
            title="Elongation (Madd)"
            description="Stretch the sound when you see a wavy line (~) or prolonged vowels."
            example="Long 'Aaa', 'Eee', 'Ooo'"
            arabicExample="وَلَا ٱلضَّآلِّينَ"
          />

          <GuideItem 
            icon={<Volume2 className="text-green-600" />}
            title="Nasal Sound (Ghunnah)"
            description="Hold the sound in your nose for 2 counts on Noon (ن) and Meem (م) with Shaddah (ّ)."
            example="Inna, Amma"
            arabicExample="إِنَّ"
          />
          
          <GuideItem 
            icon={<span className="text-xl font-bold text-red-500">Q</span>}
            title="Echo (Qalqalah)"
            description="Create an echoing sound when these letters have a Sukoon (Stop)."
            example="q t b j d (ق ط ب ج د)"
            arabicExample="ٱلْفَلَقِ"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function GuideItem({ icon, title, description, example, arabicExample }: any) {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
      <div className="shrink-0 pt-1">{icon}</div>
      <div className="space-y-1">
        <h3 className="font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        <div className="mt-3 flex items-center gap-3 text-sm bg-card p-2 rounded-lg border border-border/50">
          <span className="font-arabic text-xl px-2 border-r border-border">{arabicExample}</span>
          <span className="text-muted-foreground italic">{example}</span>
        </div>
      </div>
    </div>
  );
}
