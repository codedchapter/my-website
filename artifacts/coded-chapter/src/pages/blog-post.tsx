import { useGetPost, useListComments, useCreateComment, useDeleteComment } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Show, useUser } from "@clerk/react";
import { format } from "date-fns";
import { motion, useScroll, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, ArrowLeft, Send, Trash2, Calendar } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id || "0", 10);
  
  const { data: post, isLoading } = useGetPost(postId, { 
    query: { enabled: !!postId } 
  });
  
  const { data: comments } = useListComments(postId, {
    query: { enabled: !!postId }
  });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-32 bg-muted rounded-full mx-auto" />
          <div className="h-16 w-3/4 bg-muted rounded-xl mx-auto" />
          <div className="h-64 w-full bg-muted rounded-2xl" />
          <div className="space-y-4 pt-8">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-2/3 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-32 text-center space-y-6">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-3xl font-mono text-muted-foreground">404</span>
        </div>
        <h1 className="text-3xl font-extrabold font-display">Post not found</h1>
        <p className="text-muted-foreground max-w-md mx-auto">The chapter you're looking for doesn't exist or has been moved.</p>
        <Link href="/blog">
          <Button variant="outline" className="mt-4"><ArrowLeft className="w-4 h-4 mr-2" /> Back to blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary origin-left z-50 shadow-[0_0_10px_rgba(91,91,214,0.5)]"
        style={{ scaleX }}
      />
      
      <article className="container max-w-3xl mx-auto px-4 py-16 md:py-24">
        <Link href="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-12 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to chapters
        </Link>

        <header className="mb-16 space-y-8">
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              {format(new Date(post.createdAt), 'MMMM d, yyyy')}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-secondary" />
              {post.readingTimeMinutes} min read
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] font-display">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-3">
            {post.tags.map(tag => (
              <Link key={tag} href={`/blog?tag=${tag}`}>
                <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-mono font-medium hover:bg-primary/20 hover:shadow-[0_0_10px_rgba(91,91,214,0.2)] transition-all cursor-pointer block">
                  #{tag}
                </span>
              </Link>
            ))}
          </div>
        </header>

        {post.coverImage && (
          <div className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden mb-16 border border-border shadow-2xl shadow-black/50">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
          </div>
        )}

        <div 
          className="prose prose-invert prose-lg max-w-none 
          prose-headings:font-display prose-headings:font-bold prose-h2:text-3xl prose-h3:text-2xl
          prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:font-light
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-pre:bg-[#141729] prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-pre:shadow-xl
          prose-code:text-secondary prose-code:bg-secondary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
          prose-strong:text-foreground prose-strong:font-semibold
          prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:text-muted-foreground prose-blockquote:font-style-normal
          prose-img:rounded-xl prose-img:border prose-img:border-border"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        <hr className="my-20 border-border" />
        
        <CommentSection postId={postId} comments={comments || []} />
      </article>
    </>
  );
}

function CommentSection({ postId, comments }: { postId: number, comments: any[] }) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  
  const createComment = useCreateComment({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`/api/posts/${postId}/comments`] });
        setContent("");
      }
    }
  });

  const deleteComment = useDeleteComment({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`/api/posts/${postId}/comments`] });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createComment.mutate({ postId, data: { content } });
  };

  return (
    <section className="space-y-12">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-extrabold tracking-tight font-display flex items-center gap-3">
          Discussion 
          <span className="inline-flex items-center justify-center bg-primary/20 text-primary text-sm rounded-full w-8 h-8 font-mono">
            {comments.length}
          </span>
        </h3>
      </div>

      <Show when="signed-out">
        <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-6 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <h4 className="text-xl font-bold mb-2">Join the conversation</h4>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">Sign in to share your thoughts, ask questions, or provide feedback on this chapter.</p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/sign-in">
                <Button variant="outline" className="h-11 px-6">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="h-11 px-6 bg-primary hover:bg-primary/90">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </Show>

      <Show when="signed-in">
        <form onSubmit={handleSubmit} className="flex gap-4 items-start bg-card/50 p-6 rounded-2xl border border-border">
          <Avatar className="w-12 h-12 border-2 border-background shadow-sm mt-1">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback className="bg-primary/10 text-primary font-mono">{user?.firstName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <Textarea 
              placeholder="What are your thoughts?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="resize-none min-h-[120px] bg-background border-border/50 focus-visible:ring-primary focus-visible:border-primary transition-all text-base p-4 rounded-xl"
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={!content.trim() || createComment.isPending}
                className="gap-2 px-6 h-11 rounded-xl bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(91,91,214,0.3)] transition-all"
              >
                <Send className="w-4 h-4" />
                {createComment.isPending ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>
        </form>
      </Show>

      <div className="space-y-8 mt-12">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-5 group">
            <Avatar className="w-12 h-12 border border-border shrink-0">
              <AvatarFallback className="bg-secondary/10 text-secondary font-mono">{comment.authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2 bg-card border border-border/50 p-5 rounded-2xl rounded-tl-sm transition-colors hover:border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-foreground">{comment.authorName}</span>
                  <span className="text-xs font-medium text-muted-foreground/80 font-mono">
                    {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
                {user && user.id === comment.authorId && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all rounded-full hover:bg-destructive/10"
                    onClick={() => deleteComment.mutate({ postId, commentId: comment.id })}
                    disabled={deleteComment.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <p className="text-[15px] text-foreground/90 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}