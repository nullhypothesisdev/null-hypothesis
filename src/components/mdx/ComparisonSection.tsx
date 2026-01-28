export default function ComparisonSection({ children, title, ...props }: any) {
    return (
        <section className="my-16" {...props}>
            {title && (
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-ink/10 flex-1" />
                    <h3 className="font-serif text-xl italic text-ink/80">{title}</h3>
                    <div className="h-px bg-ink/10 flex-1" />
                </div>
            )}
            <div className="bg-paper border border-ink/5 rounded-2xl p-8 shadow-sm">
                {children}
            </div>
        </section>
    );
}
