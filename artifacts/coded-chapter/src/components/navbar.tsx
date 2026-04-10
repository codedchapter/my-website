import { Link, useLocation } from "wouter";
import { Show, useClerk, useUser } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
          <Terminal className="h-5 w-5 text-primary group-hover:text-secondary transition-colors" />
          <span className="font-mono font-medium text-lg tracking-tight flex items-center gap-1">
            <span className="text-primary font-bold">{'>'}</span>
            <span>Coded</span>
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Chapter</span>
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <div className="relative flex items-center">
            <Link href="/blog" className={`text-sm font-medium transition-colors ${location.startsWith('/blog') ? 'text-foreground' : 'text-muted-foreground hover:text-primary'}`}>
              Read
            </Link>
            {location.startsWith('/blog') && (
              <motion.div
                layoutId="nav-underline"
                className="absolute -bottom-6 left-0 right-0 h-0.5 bg-primary"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </div>
          
          <Show when="signed-out">
            <div className="flex items-center gap-3 border-l border-border/50 pl-6 ml-2">
              <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Sign In
              </Link>
              <Link href="/sign-up" className="text-sm font-medium">
                <Button size="sm" className="h-8 bg-primary hover:bg-primary/90 shadow-[0_0_10px_rgba(91,91,214,0.3)]">Sign Up</Button>
              </Link>
            </div>
          </Show>

          <Show when="signed-in">
            <div className="border-l border-border/50 pl-6 ml-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full border border-primary/20 hover:border-primary/50 transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary font-mono text-xs">{user?.firstName?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-destructive hover:text-destructive">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Show>
        </nav>
      </div>
    </header>
  );
}