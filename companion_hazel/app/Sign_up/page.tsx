import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black relative">
      <div className="z-10">
        <SignUp 
            appearance={{
                elements: {
                    card: "bg-white/5 border border-white/10 backdrop-blur-md",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    textDimmed: "text-white/60",
                    textSecondary: "text-white/60",
                    formFieldLabel: "text-white/80",
                    formFieldInput: "bg-black/40 border-white/10 text-white",
                    socialButtonsBlockButton: "bg-white/5 border-white/10 text-white hover:bg-white/10",
                    footerActionLink: "text-blue-400 hover:text-blue-300"
                }
            }}
        />
      </div>
    </main>
  );
}