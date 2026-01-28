export default function ComparisonGrid({ children, ...props }: any) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10" {...props}>
            {children}
        </div>
    );
}
