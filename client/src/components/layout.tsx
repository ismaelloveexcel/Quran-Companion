import { Link, useLocation } from "wouter";
import { Home, BookOpen, Settings } from "lucide-react";
import bgPattern from '@assets/generated_images/subtle_islamic_geometric_pattern_background.png';
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 relative overflow-hidden flex justify-center">
      {/* Background Pattern Overlay */}
      <div 
        className="fixed inset-0 z-0 opacity-15 pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: `url(${bgPattern})`,
          backgroundSize: '400px',
          backgroundRepeat: 'repeat'
        }}
      />
      
      {/* Main Container - Mobile Optimized */}
      <div className="relative z-10 w-full max-w-md bg-background/80 min-h-screen shadow-2xl flex flex-col">
        {/* Content */}
        <main className="flex-1 pb-24 overflow-y-auto scroll-smooth">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 w-full max-w-md bg-card border-t border-border/40 backdrop-blur-md pb-safe">
          <div className="flex justify-around items-center h-20">
            <NavItem 
              href="/" 
              active={location === "/"} 
              icon={Home} 
              label="Home" 
            />
            {/* 
            <NavItem 
              href="/favorites" 
              active={location === "/favorites"} 
              icon={Heart} 
              label="Saved" 
            />
             */}
          </div>
        </nav>
      </div>
    </div>
  );
}

function NavItem({ href, active, icon: Icon, label }: { href: string, active: boolean, icon: any, label: string }) {
  return (
    <Link href={href}>
      <a className={cn(
        "flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300",
        active ? "text-primary scale-105" : "text-muted-foreground hover:text-primary/70"
      )}>
        <Icon size={32} strokeWidth={active ? 2.5 : 2} />
        <span className={cn("text-xs font-medium", active ? "font-bold" : "")}>{label}</span>
      </a>
    </Link>
  );
}
