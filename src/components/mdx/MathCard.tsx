export default function MathCard({ children, title, ...props }: any) {
    return (
        <div className="bg-ink/5 border border-ink/10 rounded-sm p-6 my-6 font-serif" {...props}>
            {title && <h4 className="font-bold text-ink mb-4 text-center italic">{title}</h4>}
            <div className="text-ink/80 text-lg leading-relaxed">
                {children}
            </div>
        </div>
    );
}
