import { useListPosts, useGetAllTags } from "@workspace/api-client-react";
import { useLocation, useSearch } from "wouter";
import { PostCard } from "@/components/post-card";
import { Input } from "@/components/ui/input";
import { Search, Hash } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function BlogList() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const tagParam = searchParams.get("tag");
  const [, setLocation] = useLocation();

  const { data: posts, isLoading } = useListPosts(tagParam ? { tag: tagParam } : undefined);
  const { data: tags } = useGetAllTags();

  const handleTagClick = (tag: string | null) => {
    if (tag) {
      setLocation(`/blog?tag=${tag}`);
    } else {
      setLocation('/blog');
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
      <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
        {/* Main Content */}
        <div className="flex-1 space-y-12">
          <div className="space-y-6 max-w-2xl">
            <h1 className="text-5xl font-extrabold tracking-tight font-display">
              {tagParam ? `Posts tagged ` : "All Chapters"}
              {tagParam && <span className="text-primary">#{tagParam}</span>}
            </h1>
            <p className="text-xl text-muted-foreground font-light leading-relaxed">
              Everything I've learned, written down. Unpolished thoughts and deep dives into code.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-[420px] bg-card/50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : posts?.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-center border border-dashed border-border/50 rounded-2xl bg-card/30">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No posts found</h3>
              <p className="text-muted-foreground">Try selecting a different tag or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {posts?.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-64 lg:w-80 space-y-8">
          <div className="sticky top-28 space-y-8">
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-xl shadow-black/20">
              <h3 className="font-bold mb-6 flex items-center gap-2 font-display text-lg">
                <Hash className="w-5 h-5 text-primary" />
                Filter by Tag
              </h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => handleTagClick(null)}
                  className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    !tagParam ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-muted border border-transparent hover:border-border/50"
                  }`}
                >
                  All Posts
                </button>
                {tags?.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium font-mono transition-all ${
                      tagParam === tag ? "bg-secondary/10 text-secondary border border-secondary/20" : "text-muted-foreground hover:bg-muted border border-transparent hover:border-border/50"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}