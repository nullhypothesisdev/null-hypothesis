export default function CaseGrid({ children, ...props }: any) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6" {...props}>
            {children}
        </div>
    );
}
