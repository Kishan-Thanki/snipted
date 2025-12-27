export function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn(
            "backdrop-blur-lg bg-white/10 border border-white/20",
            "shadow-xl rounded-2xl p-6",
            className
        )}>
            {children}
        </div>
    );
}