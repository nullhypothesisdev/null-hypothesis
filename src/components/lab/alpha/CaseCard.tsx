export default function CaseCard({ children, title, ...props }: any) {
    return (
        <div className="border border-ink/10 rounded-sm p-6 bg-paper my-4" {...props}>
            {title && <h3 className="font-serif text-lg text-ink mb-2">{title}</h3>}
            <div className="text-ink/80 text-sm">
                {children || "Case Card Content"}
            </div>
        </div>
    );
}
