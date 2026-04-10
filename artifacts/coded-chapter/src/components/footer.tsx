import { Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-12 mt-auto bg-background relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Terminal className="h-5 w-5 text-primary" />
          <span className="font-mono font-medium text-sm tracking-wide flex items-center gap-1">
            <span className="text-primary font-bold">{'>'}</span>
            <span>Coded</span>
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Chapter</span>
          </span>
        </div>
        <p className="text-sm text-muted-foreground/80 font-light">
          Documenting the journey, <span className="font-mono text-xs text-secondary/80">one commit at a time.</span>
        </p>
      </div>
    </footer>
  );
}