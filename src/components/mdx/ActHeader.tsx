export default function ActHeader({ children, title, ...props }: any) {
    return (
        <div className="my-12 text-center" {...props}>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent block mb-2">
                {title}
            </span>
            <h2 className="font-serif text-3xl font-medium text-ink">
                {children}
            </h2>
            <div className="w-12 h-px bg-accent/30 mx-auto mt-6" />
        </div>
    );
}
