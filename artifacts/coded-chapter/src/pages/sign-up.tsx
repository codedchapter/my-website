import { SignUp } from "@clerk/react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function SignUpPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md space-y-6 text-center mb-8 relative z-10">
        <h2 className="text-4xl font-extrabold text-foreground tracking-tight font-display">
          Start your chapter
        </h2>
        <p className="text-base text-muted-foreground font-light">
          Join the community of developers learning out loud.
        </p>
      </div>
      <div className="w-full max-w-md relative z-10">
        <div className="absolute -inset-1 bg-gradient-to-r from-secondary to-primary rounded-2xl blur opacity-20" />
        <div className="relative">
          <SignUp 
            routing="path" 
            path={`${basePath}/sign-up`} 
            signInUrl={`${basePath}/sign-in`}
            appearance={{
              elements: {
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all",
                card: "bg-card border border-white/5 shadow-2xl rounded-2xl p-6 backdrop-blur-sm",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border-border text-foreground hover:bg-muted transition-colors",
                socialButtonsBlockButtonText: "font-medium",
                dividerLine: "bg-border",
                dividerText: "text-muted-foreground font-mono text-xs",
                formFieldLabel: "text-foreground font-medium",
                formFieldInput: "bg-background border-border text-foreground focus:ring-primary focus:border-primary rounded-lg transition-all",
                footerActionText: "text-muted-foreground",
                footerActionLink: "text-primary hover:text-primary/90 font-medium"
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}