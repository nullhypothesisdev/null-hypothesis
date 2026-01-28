export default function TwoColumnSection({ children, ...props }: any) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8" {...props}>
            {children}
        </div>
    );
}
