export default function CheckItem({ children, ...props }: any) {
    return (
        <div className="flex items-start gap-3 my-4 group" {...props}>
            <div className="mt-1.5 w-4 h-4 rounded-full border border-ink/20 flex items-center justify-center group-hover:border-accent transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-accent scale-0 group-hover:scale-100 transition-transform" />
            </div>
            <div className="text-ink/70 text-sm leading-relaxed">
                {children}
            </div>
        </div>
    );
}
