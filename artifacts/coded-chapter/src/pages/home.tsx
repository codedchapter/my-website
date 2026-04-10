import { motion } from "framer-motion";
import { Link } from "wouter";
import { useGetFeaturedPosts, useGetAllTags } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/post-card";
import { ArrowRight, Code2, TerminalSquare, BookOpen } from "lucide-react";

export default function Home() {
  const { data: featuredPosts, isLoading: isLoadingFeatured } = useGetFeaturedPosts();
  const { data: tags } = useGetAllTags();

  return (
    <div className="flex flex-col w-full relative">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden border-b border-border/30">
        {/* Animated Background Grids */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--primary)/0.08)_1px,_transparent_1px)] bg-[size:24px_24px] opacity-40 mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            <div className="flex-1 space-y-8 max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-mono shadow-[0_0_15px_rgba(14,194,172,0.1)]"
              >
                <TerminalSquare className="w-4 h-4" />
                <span>Hello, World!<span className="inline-block w-2 h-4 bg-secondary ml-1 align-middle animate-blink"></span></span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[1.1]"
              >
                Documenting the journey from <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 drop-shadow-[0_0_20px_rgba(91,91,214,0.3)]">confusion</span> to <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-teal-400 drop-shadow-[0_0_20px_rgba(14,194,172,0.3)]">clarity.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground/90 leading-relaxed max-w-2xl font-light"
              >
                A digital notebook where I untangle concepts, share mistakes, and celebrate the small victories of learning to code.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center gap-4 pt-4"
              >
                <Link href="/blog">
                  <Button size="lg" className="h-14 px-8 gap-3 text-base rounded-xl bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(91,91,214,0.4)] hover:shadow-[0_0_30px_rgba(91,91,214,0.6)] transition-all duration-300">
                    <BookOpen className="w-5 h-5" />
                    Read the Chapters
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Decorative Code Block */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="hidden lg:block w-[400px] bg-[#1a1e36] rounded-2xl border border-white/10 shadow-2xl shadow-primary/20 overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#141729]">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-4 text-xs font-mono text-muted-foreground">journey.ts</span>
              </div>
              <div className="p-6 font-mono text-sm leading-loose">
                <span className="text-purple-400">const</span> <span className="text-blue-300">chapter</span> <span className="text-white">=</span> <span className="text-purple-400">await</span> <span className="text-teal-300">learn</span>(<span className="text-yellow-300">"coding"</span>);<br/>
                <span className="text-purple-400">if</span> (chapter.<span className="text-blue-300">hasBugs</span>) {'{'}<br/>
                &nbsp;&nbsp;<span className="text-teal-300">debug</span>();<br/>
                &nbsp;&nbsp;<span className="text-teal-300">drinkCoffee</span>();<br/>
                {'}'} <span className="text-purple-400">else</span> {'{'}<br/>
                &nbsp;&nbsp;<span className="text-teal-300">publish</span>(chapter);<br/>
                {'}'}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <Code2 className="w-8 h-8 text-primary drop-shadow-[0_0_10px_rgba(91,91,214,0.5)]" />
              Featured Chapters
            </h2>
            <Link href="/blog" className="text-sm font-semibold text-primary hover:text-secondary hover:underline flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {isLoadingFeatured ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[420px] bg-card/50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts?.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About/Tags Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-extrabold tracking-tight">The Story So Far</h2>
              <p className="text-muted-foreground/90 text-lg md:text-xl leading-relaxed font-light">
                I started coding because I wanted to build things. I quickly realized that building things means breaking things first. This blog is my attempt to map the territory as I explore it — writing down the solutions I spend hours finding so my future self (and maybe you) won't have to.
              </p>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              <div className="relative bg-card/80 backdrop-blur-xl border border-white/5 p-10 rounded-2xl">
                <h3 className="text-2xl font-bold mb-8 font-mono flex items-center gap-3">
                  <TerminalSquare className="w-6 h-6 text-secondary" />
                  Topics.explored
                </h3>
                <div className="flex flex-wrap gap-3">
                  {tags?.map(tag => (
                    <Link key={tag} href={`/blog?tag=${tag}`}>
                      <span className="px-4 py-2 rounded-lg bg-background text-foreground/80 hover:text-white transition-all text-sm font-mono cursor-pointer border border-white/10 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(91,91,214,0.3)] block">
                        #{tag}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}