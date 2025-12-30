import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Info, Volume2, MoveUp, AlertCircle, Hand, CheckCircle, XCircle, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TajweedGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 rounded-full border-primary/20 text-primary hover:bg-primary/5 hover:text-primary">
          <Info size={16} />
          <span className="hidden sm:inline">Reading Help</span>
          <span className="sm:hidden">Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-primary">Recitation Helper</DialogTitle>
          <DialogDescription>
            Guides for pronunciation and stopping rules.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="stopping" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stopping">Stopping Rules</TabsTrigger>
            <TabsTrigger value="pronunciation">Pronunciation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stopping" className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Small symbols above the line tell you when to pause (take a breath) or continue.
            </p>
            
            <GuideItem 
              icon={<Hand className="text-red-500" />}
              title="Must Stop (Meem - مـ)"
              description="Compulsory stop. You must pause here to keep the correct meaning."
              example="Stop & Breathe"
              arabicExample="ۘ"
              symbol="مـ"
            />

            <GuideItem 
              icon={<XCircle className="text-orange-500" />}
              title="Do Not Stop (Laa - لا)"
              description="Do not pause here. Continue reading to the next word."
              example="Don't Stop"
              arabicExample="لا"
              symbol="لا"
            />

            <GuideItem 
              icon={<CheckCircle className="text-green-600" />}
              title="Permissible Stop (Jeem - ج)"
              description="You can stop if you need breath, or continue. Both are okay."
              example="Optional"
              arabicExample="ج"
              symbol="ج"
            />

            <GuideItem 
              icon={<ArrowRightLeft className="text-blue-500" />}
              title="Better to Continue (Saad Lam - صل)"
              description="You can stop, but it is better to continue reading."
              example="Keep Going"
              arabicExample="صل"
              symbol="صل"
            />

            <GuideItem 
              icon={<ArrowRightLeft className="text-purple-500" />}
              title="Better to Stop (Qaaf Lam - قلى)"
              description="You can continue, but it is better to stop and take a breath."
              example="Better to Pause"
              arabicExample="قلى"
              symbol="قلى"
            />
            
            <GuideItem 
              icon={<div className="flex gap-1"><span className="w-1 h-1 bg-foreground rounded-full"></span><span className="w-1 h-1 bg-foreground rounded-full"></span><span className="w-1 h-1 bg-foreground rounded-full"></span></div>}
              title="Paired Dots (Mu'anaqah - ۛ)"
              description="When you see these three dots twice, stop at one set, but not the other."
              example="Pick one to stop"
              arabicExample="ۛ"
              symbol="ۛ ... ۛ"
            />
          </TabsContent>

          <TabsContent value="pronunciation" className="space-y-4 py-4">
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function GuideItem({ icon, title, description, example, arabicExample, symbol }: any) {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 items-start">
      <div className="shrink-0 pt-1 flex flex-col items-center gap-2">
        {icon}
        {symbol && <span className="text-xs font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">{symbol}</span>}
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        <div className="mt-3 flex items-center gap-3 text-sm bg-card p-2 rounded-lg border border-border/50 w-fit">
          <span className="font-arabic text-xl px-2 border-r border-border min-w-[30px] text-center">{arabicExample}</span>
          <span className="text-muted-foreground italic px-1">{example}</span>
        </div>
      </div>
    </div>
  );
}
