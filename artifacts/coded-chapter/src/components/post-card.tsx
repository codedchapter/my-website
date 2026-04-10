import { Link } from "wouter";
import { Post } from "@workspace/api-client-react/src/generated/api.schemas";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageSquare } from "lucide-react";
import { format } from "date-fns";

export function PostCard({ post }: { post: Post }) {
  // Simple deterministic color rotation based on tag string length
  const getTagColor = (tag: string) => {
    const colors = [
      "bg-primary/10 text-primary hover:bg-primary/20",
      "bg-secondary/10 text-secondary hover:bg-secondary/20",
      "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20",
      "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
    ];
    return colors[tag.length % colors.length];
  };

  return (
    <Link href={`/blog/${post.id}`} className="block h-full outline-none">
      <div className="relative h-full group rounded-2xl">
        {/* Glow Shadow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500" />
        
        {/* Gradient Border Wrapper */}
        <div className="relative h-full p-[1px] rounded-2xl bg-gradient-to-b from-border/50 to-transparent group-hover:from-primary/50 group-hover:to-secondary/50 transition-colors duration-500 overflow-hidden">
          
          {/* Shimmer Line */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <Card className="h-full flex flex-col overflow-hidden bg-card border-none rounded-[15px]">
            {post.coverImage && (
              <div className="relative aspect-[2/1] w-full overflow-hidden">
                <img 
                  src={post.coverImage} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
              </div>
            )}
            <CardHeader className="flex-1 p-6 pb-4">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className={`${getTagColor(tag)} font-mono text-[11px] px-2 py-0.5 transition-colors border-transparent`}>
                    #{tag}
                  </Badge>
                ))}
              </div>
              <h3 className="text-2xl font-display font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                {post.title}
              </h3>
              <p className="text-muted-foreground mt-3 line-clamp-3 text-sm leading-relaxed font-light">
                {post.excerpt}
              </p>
            </CardHeader>
            <CardFooter className="p-6 pt-0 flex items-center justify-between text-xs text-muted-foreground/80 font-medium">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 group-hover:text-foreground/90 transition-colors">
                  <Clock className="w-4 h-4 text-primary" />
                  {post.readingTimeMinutes} min read
                </span>
                <span className="flex items-center gap-1.5 group-hover:text-foreground/90 transition-colors">
                  <MessageSquare className="w-4 h-4 text-secondary" />
                  {post.commentCount}
                </span>
              </div>
              <span className="font-mono">{format(new Date(post.createdAt), 'MMM d, yy')}</span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Link>
  );
}