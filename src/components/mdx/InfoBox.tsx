export default function InfoBox({ children, title, ...props }: any) {
    return (
        <div className="bg-ink/5 border-l-2 border-ink p-4 my-6 rounded-r-sm" {...props}>
            {title && <h4 className="font-bold text-ink mb-2">{title}</h4>}
            <div className="text-ink/80 text-sm">
                {children}
            </div>
        </div>
    );
}
